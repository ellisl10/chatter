import { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';
import './Chat.css';

//For demo purposes until we have a backend
const mockContacts = [
    { id: 1, name: 'John Doe', lastMessage: 'Last message' },
    { id: 2, name: 'Jane Doe', lastMessage: 'Last message' },
    { id: 3, name: 'Alice Smith', lastMessage: 'Last message' },
    { id: 4, name: 'Joe Brown', lastMessage: 'Last message' },
  ];

  const mockMessages = {
    1: [
      { from: 'them', text: 'Hey!' },
      { from: 'me', text: 'Hello, John!' },
    ],
    2: [
      { from: 'them', text: 'Are we still on for lunch?' },
      { from: 'me', text: 'Yep, see you at noon.' },
    ],
    3: [
      { from: 'them', text: 'Project update?' },
      { from: 'me', text: 'Working on it today!' },
    ],
    4: [
      { from: 'them', text: 'Can you send that file?' },
      { from: 'me', text: 'Sent it this morning.' },
    ],
  };

export function Chat() {
    const [username, setUsername] = useState('');
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messagesByContact, setMessagesByContact] = useState({});
    const [newMessage, setNewMessage] = useState('');  

    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    
    useEffect(() => {
        const storedUsername = localStorage.getItem('username') || 'User Name';
            setUsername(storedUsername);

        setContacts(mockContacts);
        setMessagesByContact(mockMessages);
        setSelectedContact(mockContacts[0]);
    }, []);

    const messages = selectedContact ? messagesByContact[selectedContact.id] || [] : [];

    const handleProfileClick = () => {
        navigate('/Settings')
    };

    const handleContactClick = (contact) => {
        setSelectedContact(contact);
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedContact) return;
    
        setMessagesByContact((prev) => {
          const prevMessages = prev[selectedContact.id] || [];
          return {
            ...prev,
            [selectedContact.id]: [...prevMessages, { from: 'me', text: newMessage.trim() }],
          };
        });
    
        setNewMessage('');
      };

    return (
        <>
            <div className="chat-container">
                <aside className="sidebar">
                    <div className="sidebar-header" onClick={handleProfileClick}>
                        <div className="user-avatar" />
                        <span className="username">{username}</span>
                    </div>
                    <button className="new-chat-button">New Chat</button>
                    <div className="contact-list">
                    {contacts.map((contact) => (
                        <div
                        key={contact.id}
                        className={`contact-item ${selectedContact?.id === contact.id ? 'active' : ''}`}
                        onClick={() => handleContactClick(contact)}
                        >
                        <div className="contact-avatar" />
                        <div>
                            <div className="contact-name">{contact.name}</div>
                            <div className="contact-subtext">{contact.lastMessage}</div>
                        </div>
                        </div>
                    ))}
                    </div>
                    <div className="view-all">View All</div>
                </aside>

                <main className="chat-main">
                    <div className="chat-header">
                    <div className="chat-username">{selectedContact?.name || 'Select a contact'}</div>
                    <div className="chat-status">Online</div>
                    </div>
                    <div className="chat-messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.from === 'me' ? 'outgoing' : 'incoming'}`}>
                        {msg.text}
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
        </>
    )
}