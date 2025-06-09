import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Chat.css';
import { NavigationBar } from '../../../components/NavigationBar';
import MarginFix from '../../../components/MarginFix';
import { Modal, Button, Form } from 'react-bootstrap';
import { db } from '../../../firebase';
import { auth } from '../../../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, addDoc, getDocs } from 'firebase/firestore';

function getChatId(uid1, uid2) {
    return [uid1, uid2].sort().join('_'); // consistent ID regardless of order
}

export function Chat() {
    const [unsubscribeChatListener, setUnsubscribeChatListener] = useState(null);
    const [displayName, setDisplayName] = useState(null);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [allContacts, setAllContacts] = useState([]);

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

      useEffect(() => {
        return () => {
          if (unsubscribeChatListener) unsubscribeChatListener();
        };
      }, [unsubscribeChatListener]);

      const handleSendMessage = async () => {
        console.log(selectedContact.uid);
        if (!newMessage.trim() || !selectedContact || !auth.currentUser) return;
      
        const chatId = getChatId(auth.currentUser.uid, selectedContact.uid);
        const chatRef = collection(db, 'messages', chatId, 'messages');
      
        await addDoc(chatRef, {
          from: auth.currentUser.uid,
          to: selectedContact.uid,
          text: newMessage.trim(),
          timestamp: new Date()
        });
      
        setNewMessage('');
      };

    const handleNewChat = async () => {
        setShowNewChatModal(true);

        const snapshot = await getDocs(collection(db, 'users'));
        const usersList = snapshot.docs
        .map(doc => {
            const data = doc.data();
            return {
            id: doc.id,
            uid: data.uid || doc.id, // fallback
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
                    <div className="contact-list">
                        {contacts.map((contact) => (
                        <div
                            key={contact.id}
                            className={`contact-item ${selectedContact?.id === contact.id ? 'active' : ''}`}
                            onClick={() => handleContactClick(contact)}
                        >
                            <div className="contact-avatar" />
                            <div>
                            <div className="contact-name">{contact.username}</div>
                            <div className="contact-subtext">{contact.lastMessage}</div>
                            </div>
                        </div>
                        ))}
                    </div>
                    <div className="view-all" onClick={handleViewAllClick}>View All</div>
                    </aside>

                    <main className="chat-main">
                    <div className="chat-header">
                        <div className="chat-username">{selectedContact?.displayName || 'Select a contact'}</div>
                        <div className="chat-status">Online</div>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, idx) => (
                        <div
                            key={`${msg.from}-${msg.text}-${msg.timestamp}-${idx}`}
                            className={`message ${msg.from === auth.currentUser?.uid ? 'outgoing' : 'incoming'}`}
                        >
                            {msg.text}
                            <div className="message-timestamp">
                            {msg.timestamp && new Date(msg.timestamp?.toDate?.() || msg.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                            </div>
                        </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button className="send-button" onClick={handleSendMessage}>➤</button>
                    </div>
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
        </>
    );
    }
