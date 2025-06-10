import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Chat.css';
import { NavigationBar } from '../../../components/NavigationBar';
import MarginFix from '../../../components/MarginFix';
import { Modal, Button, Form } from 'react-bootstrap';
import { db, auth } from '../../../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, addDoc, getDocs, getDoc, setDoc, doc } from 'firebase/firestore';

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
        if(!imageFile || !selectedContact) return;

        setIsSendingImage(true);

        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const res = await fetch('https://us-central1-chatter-24302.cloudfunctions.net/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            const imageUrl = data.imageUrl;

            await handleSendImageMessage(imageUrl);

            cancelImagePreview();
        } catch (err) {
            console.error("Error sending image:", err);
            alert("Failed to send image.");
        } finally {
            setIsSendingImage(false);
        }
    }

    const handleGroupClick = (group) => {
        if (unsubscribeChatListener) unsubscribeChatListener();

        setSelectedContact(null);
        setSelectedGroup(group);

        const groupRef = collection(db, "groups", group.id, "messages");
        const q = query(groupRef, orderBy("timestamp"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => doc.data());
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
            setDisplayName(user.displayName || "Anonymous");
            } else {
            setDisplayName(null); // user signed out
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if(!auth.currentUser) return;

        const fetchGroups = async () => {
            const groupsSnapshot = await getDocs(collection(db, 'groups'));
            const groups = groupsSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data
                };
            });

            const allGroupIds = [];
            // For each group, check if current user is a member
            for (const group of groups) {
                if (group.members && group.members.includes(auth.currentUser.uid)) {
                    allGroupIds.push(group.id); // This user is a member of this group
                }
            }
            setGroups(groups.filter(group => allGroupIds.includes(group.id)));
        };
        fetchGroups();

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

    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const navigate = useNavigate();

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
          const msgs = snapshot.docs.map(doc => doc.data());
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
            await addDoc(chatRef, {
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

        if (selectedGroup) {
            // Group chat case
            const groupId = selectedGroup.id;
            chatRef = collection(db, 'groups', groupId, 'messages');

            await addDoc(chatRef, {
                from: auth.currentUser.uid,
                senderName: auth.currentUser.displayName || "Unknown",
                text: newMessage.trim(),
                timestamp: new Date()
            });
        } else if (selectedContact) {
            // One-on-one chat case
            const chatId = getChatId(auth.currentUser.uid, selectedContact.uid);
            chatRef = collection(db, 'messages', chatId, 'messages');

            await ensureContactExists(auth.currentUser.uid, selectedContact.uid, selectedContact);
            await ensureContactExists(selectedContact.uid, auth.currentUser.uid, {
                displayName: auth.currentUser.displayName,
                email: auth.currentUser.email,
                username: auth.currentUser.displayName,
            });

            await addDoc(chatRef, {
                from: auth.currentUser.uid,
                senderName: auth.currentUser.displayName || "Unknown",
                text: newMessage.trim(),
                timestamp: new Date()
            });
        }

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
                            <div className="chat-status">Online</div>
                        </div>
                        <div className="chat-messages">
                            {[...messages]
                            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                            .map((msg, idx) => (
                            <div
                                key={`${msg.from}-${msg.text || msg.imageUrl || ''}-${msg.timestamp}-${idx}`}
                                className={`message ${msg.from === auth.currentUser?.uid ? 'outgoing' : 'incoming'}`}
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
