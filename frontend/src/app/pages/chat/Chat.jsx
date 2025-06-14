import { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import './Chat.css';
import { NavigationBar } from '../../../components/NavigationBar';
import MarginFix from '../../../components/MarginFix';
import { Modal, Button, Form } from 'react-bootstrap';
import { db, auth } from '../../../firebase';
import { onAuthStateChanged } from "firebase/auth";
import {
    collection, query, orderBy, onSnapshot,
    addDoc, getDocs, getDoc, setDoc, doc,
    deleteDoc
} from 'firebase/firestore';
import { API_BASE_URL } from '../../../utils/apiBase.js';

function getChatId(uid1, uid2) {
    return [uid1, uid2].sort().join('_'); // consistent ID regardless of order
}

export function Chat() {
    const [unsubscribeChatListener, setUnsubscribeChatListener] = useState(null);
    const [displayName, setDisplayName] = useState(null);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [allContacts, setAllContacts] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isSendingImage, setIsSendingImage] = useState(false);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
    const messagesEndRef = useRef(null);
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const deleteMessage = async (msg) => {
        try {
            // get the chat id between the user and selected contact
            const chatId = selectedGroup ? selectedGroup.id : getChatId(auth.currentUser.uid, selectedContact.uid);

            // find the message
            const msgRef = doc(db, selectedGroup ? 'groups' : 'messages', chatId, 'messages', msg.id);

            // delete message from db
            await deleteDoc(msgRef);
            console.log('Message deleted.');
            alert('Message deleted successfully!')
        } catch (err) {
            console.log('Error deleting message: ', err)
            alert('Failed to delete message')
        }
    };
    const navigate = useNavigate();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, [messages]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("only image files are allowed.");
            return;
        }

        setImageFile(file);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    const handleConfirmImageSend = async () => {
        if (!imageFile || !selectedContact) return;

        setIsSendingImage(true);

        try {
            const formData = new FormData();
            formData.append("file", imageFile);
            formData.append("upload_preset", "chatter_preset"); // Replace with your Cloudinary unsigned preset name
            formData.append("cloud_name", "dgxmwuy9k"); // Replace with your Cloudinary cloud name

            const res = await fetch("https://api.cloudinary.com/v1_1/dgxmwuy9k/image/upload", {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                throw new Error("Image upload failed");
            }

            const data = await res.json();
            const imageUrl = data.secure_url;

            await handleSendImageMessage(imageUrl);
            cancelImagePreview();
        } catch (err) {
            console.error("Error sending image:", err);
            alert("Failed to send image.");
        } finally {
            setIsSendingImage(false);
        }
    };

    const handleGroupClick = (group) => {
        if (unsubscribeChatListener) unsubscribeChatListener();

        setSelectedContact(null);
        setSelectedGroup(group);

        const groupRef = collection(db, "groups", group.id, "messages");
        const q = query(groupRef, orderBy("timestamp"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(msgs);
        });

        setUnsubscribeChatListener(() => unsubscribe);
    };

    const cancelImagePreview = () => {
        setImagePreview(null);
        setImageFile(null);
    }

    const ensureContactExists = async (currentUid, contactUid, contactData) => {
        const contactRef = doc(db, "users", currentUid, "contacts", contactUid);
        const docSnap = await getDoc(contactRef);
        if (!docSnap.exists()) {
            await setDoc(contactRef, {
                displayName: contactData.displayName || "",
                email: contactData.email || "",
                username: contactData.username || "",
                createdAt: new Date(),
            });
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                const unsubUser = onSnapshot(userRef, (snapshot) => {
                const data = snapshot.data();
                if (data?.displayName) setDisplayName(data.displayName);
                });
            } else {
                setDisplayName(null); // user signed out
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!auth.currentUser) return;

        const q = collection(db, 'groups');

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const allGroups = snapshot.docs.map(doc => {
                const data = doc.data();
                return { id: doc.id, ...data };
            });

            const myGroups = allGroups.filter(group =>
                group.members?.includes(auth.currentUser.uid)
            );

            setGroups(myGroups);
        });

        return () => unsubscribe();
    }, [displayName]);

    useEffect(() => {
        if (!auth.currentUser) return;

        const fetchChats = async () => {
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const users = usersSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    uid: data.uid || doc.id,
                    displayName: data.displayName || 'Unnamed',
                    ...data
                };
            });

            const allChatIds = [];

            // For each possible chatId, check if messages exist
            for (const user of users) {
                if (user.uid === auth.currentUser.uid) continue;

                const chatId = getChatId(auth.currentUser.uid, user.uid);
                const msgSnapshot = await getDocs(collection(db, 'messages', chatId, 'messages'));

                if (!msgSnapshot.empty) {
                    allChatIds.push(user.uid); // This user has chatted with current user
                }
            }

            const matchedContacts = users.filter(user => allChatIds.includes(user.uid));
            setContacts(matchedContacts);
        };

        fetchChats();
    }, [displayName]);

    const handleProfileClick = () => {
        navigate('/Settings');
    };

    const handleContactClick = (contact) => {
        // unsubscribe previous listener
        if (unsubscribeChatListener) {
            unsubscribeChatListener();
        }

        setSelectedGroup(null);
        setSelectedContact(contact);
        const chatId = getChatId(auth.currentUser.uid, contact.uid);
        const chatRef = collection(db, 'messages', chatId, 'messages');
        const q = query(chatRef, orderBy('timestamp'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(msgs);
        });

        setUnsubscribeChatListener(() => unsubscribe);
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim() || selectedGroupMembers.length === 0) return;
        try {
            await addDoc(collection(db, "groups"), {
                name: groupName.trim(),
                members: [...selectedGroupMembers, auth.currentUser.uid],
                createdAt: new Date()
            });
            setShowGroupModal(false);
            setGroupName('');
            setSelectedGroupMembers([]);
        } catch (err) {
            console.error("Error creating group:", err);
            alert("Failed to create group.");
        }
    };

    useEffect(() => {
        return () => {
            if (unsubscribeChatListener) unsubscribeChatListener();
        };
    }, [unsubscribeChatListener]);

    const handleSendImageMessage = async (imageUrl) => {
        if (!auth.currentUser) return;

        if (selectedGroup) {
            const chatRef = collection(db, 'groups', selectedGroup.id, 'messages');
            const docRef = await addDoc(chatRef, {
                from: auth.currentUser.uid,
                senderName: auth.currentUser.displayName || "Unknown",
                imageUrl,
                timestamp: new Date()
            });

        } else if (selectedContact) {
            const chatId = getChatId(auth.currentUser.uid, selectedContact.uid);
            const chatRef = collection(db, 'messages', chatId, 'messages');

            await ensureContactExists(auth.currentUser.uid, selectedContact.uid, selectedContact);
            await ensureContactExists(selectedContact.uid, auth.currentUser.uid, {
                displayName: auth.currentUser.displayName,
                email: auth.currentUser.email,
                username: auth.currentUser.displayName,
            });

            await addDoc(chatRef, {
                from: auth.currentUser.uid,
                senderName: auth.currentUser.displayName || "Unknown",
                imageUrl,
                timestamp: new Date()
            });
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !auth.currentUser) return;

        let chatRef;

        const messageData = {
            from: auth.currentUser.uid,
            senderName: auth.currentUser.displayName || "Unknown",
            text: newMessage.trim(),
            timestamp: new Date()
        };

        if (selectedGroup) {
            const groupId = selectedGroup.id;
            chatRef = collection(db, 'groups', groupId, 'messages');
        } else if (selectedContact) {
            const chatId = getChatId(auth.currentUser.uid, selectedContact.uid);
            chatRef = collection(db, 'messages', chatId, 'messages');

            await ensureContactExists(auth.currentUser.uid, selectedContact.uid, selectedContact);
            await ensureContactExists(selectedContact.uid, auth.currentUser.uid, {
                displayName: auth.currentUser.displayName,
                email: auth.currentUser.email,
                username: auth.currentUser.displayName,
            });
        } else {
            return;
        }

        // Add document and then update with its ID
        const docRef = await addDoc(chatRef, messageData);
        await setDoc(docRef, { ...messageData, id: docRef.id });

        setNewMessage('');
    };


    const handleNewChat = async () => {
        setShowNewChatModal(true);

        const contactsRef = collection(db, 'users', auth.currentUser.uid, 'contacts');
        const snapshot = await getDocs(contactsRef);

        const contactsList = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                uid: doc.id,
                displayName: data.displayName || 'Unnamed',
                ...data
            };
        });

        setAllContacts(contactsList);
    };

    const handleNewGroup = async () => {
        setShowGroupModal(true);
        const snapshot = await getDocs(collection(db, 'users'));
        const usersList = snapshot.docs
            .map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    uid: data.uid || doc.id,
                    displayName: data.displayName || 'Unnamed',
                    ...data
                };
            })
            .filter(user => user.uid !== auth.currentUser?.uid);
        setAllContacts(usersList);
    };

    const handleViewAllClick = () => {
        navigate('/contacts');
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, [messages]);

    return (
        <>
            <NavigationBar />
            <div className="chat-page-wrapper">
                <div className="chat-inner-wrapper">
                    <div className="chat-container">
                        <aside className="sidebar">
                            <div className="sidebar-header" onClick={handleProfileClick}>
                                <div className="user-avatar" />
                                <span className="username">{displayName || "Loading..."}</span>
                            </div>
                            <button className="new-chat-button" onClick={handleNewChat}>New Chat</button>
                            <button className="new-chat-button" onClick={handleNewGroup}>New Group</button>
                            <div className="contact-list">
                                {[...groups, ...contacts].map((item) => {
                                    const isGroup = item.members !== undefined; // simple way to detect groups
                                    const isActive = selectedGroup?.id === item.id || selectedContact?.id === item.id;

                                    return (
                                        <div
                                            key={item.id}
                                            className={`contact-item ${isActive ? 'active' : ''}`}
                                            onClick={() => {
                                                if (isGroup) handleGroupClick(item);
                                                else handleContactClick(item);
                                            }}
                                        >
                                            <div className={`contact-avatar ${isGroup ? 'group' : ''}`} />
                                            <div>
                                                <div className="contact-name">
                                                    {isGroup ? item.name : item.username}
                                                </div>
                                                <div className="contact-subtext">
                                                    {isGroup ? 'Group chat' : item.lastMessage || ''}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="view-all" onClick={handleViewAllClick}>View All</div>
                        </aside>

                        <main className="chat-main">
                            {(!selectedContact && !selectedGroup) ? (
                                <div className="no-thread-message">Select a thread</div>
                            ) : (
                                <>
                                    <div className="chat-header">
                                        <div className="chat-username">
                                            {selectedGroup?.name || selectedContact?.displayName || 'Select a chat'}
                                        </div>
                                    </div>
                                    <div className="chat-messages">
                                        {[...messages]
                                            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                                            .map((msg, idx) => (
                                                <div
                                                    key={`${msg.from}-${msg.text || msg.imageUrl || ''}-${msg.timestamp}-${idx}`}
                                                    className={`message ${msg.from === auth.currentUser?.uid ? 'outgoing' : 'incoming'}`}
                                                    // display window for message deletion on click of message from own user
                                                    onClick={() => {
                                                        if (msg.from === auth.currentUser?.uid) {
                                                            const confirmDelete = window.confirm("Do you want to delete this message?");
                                                            if (confirmDelete) deleteMessage(msg);
                                                        }
                                                    }}
                                                >
                                                    {selectedGroup && msg.senderName && (
                                                        <div className="sender-name">{msg.senderName}</div>
                                                    )}
                                                    {msg.imageUrl && (
                                                        <img src={msg.imageUrl} alt="sent" className="sent-image" />
                                                    )}
                                                    {msg.text && (
                                                        <div className="text-message">{msg.text}</div>
                                                    )}
                                                    <div className="message-timestamp">
                                                        {msg.timestamp && new Date(msg.timestamp?.toDate?.() || msg.timestamp).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}

                                                    </div>
                                                </div>
                                            ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                    {imagePreview && (
                                        <div className="image-preview-container">
                                            <img src={imagePreview} alt="preview" className="image-preview" />
                                            <div className="preview-buttons">
                                                <button onClick={handleConfirmImageSend}
                                                    disabled={isSendingImage}>{isSendingImage ? "Sending..." : "Send Image"}</button>
                                                <button onClick={cancelImagePreview}>Cancel</button>
                                            </div>
                                        </div>
                                    )}
                                    <div className="chat-input">
                                        <input
                                            type="text"
                                            placeholder="Type a message..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                        <button className="send-button" onClick={handleSendMessage}>➤</button>
                                    </div>
                                </>
                            )}
                        </main>
                    </div>
                </div>
            </div>
            <Modal show={showNewChatModal} onHide={() => setShowNewChatModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Start a New Chat</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="text"
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-3"
                    />
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {allContacts
                            .filter(user => user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map(user => (
                                <div
                                    key={user.uid || user.id}
                                    className="d-flex justify-content-between align-items-center border-bottom py-2"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        setSelectedContact(user);
                                        setShowNewChatModal(false);
                                        handleContactClick(user);
                                        setContacts(prev => {
                                            if (prev.find(c => c.uid === user.uid)) return prev;
                                            return [...prev, user];
                                        });
                                    }}
                                >
                                    <span>{user.displayName}</span>
                                    <Button variant="outline-primary" size="sm">Chat</Button>
                                </div>
                            ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowNewChatModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showGroupModal} onHide={() => setShowGroupModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Group Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Enter a group name"
                        />
                    </Form.Group>
                    {imagePreview && (
                        <div className="image-preview-container">
                            <img src={imagePreview} alt="preview" className="image-preview" />
                            <div className="preview-buttons">
                                <button onClick={handleConfirmImageSend}
                                disabled={isSendingImage}>{isSendingImage ? "Sending..." : "Send Image"}</button>
                                <button onClick={cancelImagePreview}>Cancel</button>
                            </div>
                        </div>
                    )}
                    <div className="chat-input">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                    </div>
                    <Form.Label>Select Members</Form.Label>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {allContacts.map(user => (
                            <Form.Check
                                key={user.uid}
                                type="checkbox"
                                label={user.displayName}
                                checked={selectedGroupMembers.includes(user.uid)}
                                onChange={() => {
                                    setSelectedGroupMembers(prev => {
                                        if (prev.includes(user.uid)) {
                                            return prev.filter(id => id !== user.uid);
                                        } else {
                                            return [...prev, user.uid];
                                        }
                                    });
                                }}
                            />
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowGroupModal(false)}>Cancel</Button>
                    <Button
                        variant="primary"
                        disabled={!groupName.trim() || selectedGroupMembers.length === 0}
                        onClick={handleCreateGroup}>
                        Create Group
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
