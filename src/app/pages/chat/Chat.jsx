import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Chat.css';
import NavigationBar from '../../../components/NavigationBar';
import MarginFix from '../../../components/MarginFix';

const mockContacts = [
    { id: 1, name: 'John Doe', lastMessage: 'Last message' },
    { id: 2, name: 'Jane Doe', lastMessage: 'Last message' },
    { id: 3, name: 'Alice Smith', lastMessage: 'Last message' },
    { id: 4, name: 'Joe Brown', lastMessage: 'Last message' },
];

const mockGroups = [
    { id: 'g1', name: 'Project Team', members: [1, 2, 3] },
    { id: 'g2', name: 'Family Group', members: [2, 4] }
];

const mockMessages = {
    1: [
        { from: 'them', text: 'Hey!', timestamp: new Date().toISOString() },
        { from: 'me', text: 'Hello, John!', timestamp: new Date().toISOString() },
    ],
    2: [
        { from: 'them', text: 'Are we still on for lunch?', timestamp: new Date().toISOString() },
        { from: 'me', text: 'Yep, see you at noon.', timestamp: new Date().toISOString() },
    ],
    3: [
        { from: 'them', text: 'Project update?', timestamp: new Date().toISOString() },
        { from: 'me', text: 'Working on it today!', timestamp: new Date().toISOString() },
    ],
    4: [
        { from: 'them', text: 'Can you send that file?', timestamp: new Date().toISOString() },
        { from: 'me', text: 'Sent it this morning.', timestamp: new Date().toISOString() },
    ],
};

const mockGroupMessages = {
    'g1': [
        { from: 'John Doe', text: 'Hello Team!', timestamp: new Date().toISOString() },
        { from: 'Jane Doe', text: 'Good morning!', timestamp: new Date().toISOString() }
    ],
    'g2': [
        { from: 'Alice Smith', text: 'Happy Birthday!', timestamp: new Date().toISOString() }
    ]
};

export function Chat() {
    const [username, setUsername] = useState('');
    const [contacts, setContacts] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messagesByChat, setMessagesByChat] = useState({});
    const [newMessage, setNewMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [newContactName, setNewContactName] = useState('');
    MarginFix('chat-mode');

    const navigate = useNavigate();

    // Load mock data
    useEffect(() => {
        const storedUsername = localStorage.getItem('username') || 'User Name';
        setUsername(storedUsername);
        setContacts(mockContacts);
        setGroups(mockGroups);
        setMessagesByChat({ ...mockMessages, ...mockGroupMessages });
    }, []);

    // Handle switching between individual and group chats
    const messages = selectedChat ? messagesByChat[selectedChat.id] || [] : [];

    // Navigate to settings
    const handleProfileClick = () => {
        navigate('/Settings');
    };

    // Switch chat view
    const handleChatClick = (chat) => {
        setSelectedChat(chat);
    };

    // Navigate to contacts
    const handleViewAllClick = () => {
        navigate('/contacts');
    };

    // Add a new contact
    const handleAddContact = () => {
        if (newContactName.trim()) {
            const newContact = {
                id: contacts.length + 1,
                name: newContactName,
                lastMessage: 'No messages yet'
            };
            setContacts(prev => [...prev, newContact]);
            setNewContactName('');
        }
    };

    // Open new chat modal
    const handleNewChat = () => {
        setShowModal(true);
    };

    const handleContactSelect = (contactId) => {
        setSelectedContacts((prev) =>
            prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId]
        );
    };

    const handleCreateGroup = () => {
        if (selectedContacts.length > 1) {
            const newGroup = {
                id: `g${groups.length + 1}`,
                name: `Group ${groups.length + 1}`,
                members: selectedContacts
            };
            setGroups((prev) => [...prev, newGroup]);
            setMessagesByChat((prev) => ({
                ...prev,
                [newGroup.id]: []
            }));
            setSelectedChat(newGroup);
            setShowModal(false);
            setSelectedContacts([]);
        }
    };

    // Send a message in the current chat
    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedChat) return;

        setMessagesByChat((prev) => {
            const prevMessages = prev[selectedChat.id] || [];
            return {
                ...prev,
                [selectedChat.id]: [
                    ...prevMessages,
                    { from: username, text: newMessage.trim(), timestamp: new Date().toISOString() }
                ],
            };
        });

        setNewMessage('');
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
                            <span className="username">{username}</span>
                        </div>
                        <button className="new-chat-button" onClick={handleNewChat}>New Chat</button>

                        <div className="modal" style={{ display: showModal ? 'block' : 'none' }}>
                            <h3>Select Contacts for Group Chat</h3>
                            {contacts.map((contact) => (
                                <div key={contact.id}>
                                    <input
                                        type="checkbox"
                                        onChange={() => handleContactSelect(contact.id)}
                                    />
                                    {contact.name}
                                </div>
                            ))}
                            <button onClick={handleCreateGroup}>Create Group</button>
                            <button onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </aside>

                    <main className="chat-main">
                        <div className="chat-header">
                            <div className="chat-username">{selectedChat?.name || 'Select a contact or group'}</div>
                        </div>
                        <div className="chat-messages">
                            {messages.map((msg, idx) => (
                                <div
                                    key={`${msg.from}-${msg.text}-${msg.timestamp}-${idx}`}
                                    className={`message ${msg.from === username ? 'outgoing' : 'incoming'}`}
                                >
                                    {msg.from !== username && <strong>{msg.from}: </strong>}
                                    {msg.text}
                                    <div className="message-timestamp">
                                        {new Date(msg.timestamp).toLocaleTimeString()}
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
        </>
    );
}