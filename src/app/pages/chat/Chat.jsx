import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Chat.css';
import NavigationBar from 'src/app/components/NavigationBar';

const mockContacts = [
  { id: 1, name: 'John Doe', lastMessage: 'Last message' },
  { id: 2, name: 'Jane Doe', lastMessage: 'Last message' },
  { id: 3, name: 'Alice Smith', lastMessage: 'Last message' },
  { id: 4, name: 'Joe Brown', lastMessage: 'Last message' },
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

export function Chat() {
  const [username, setUsername] = useState('');
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messagesByContact, setMessagesByContact] = useState({});
  const [newMessage, setNewMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username') || 'User Name';
    setUsername(storedUsername);
    setContacts(mockContacts);
    setMessagesByContact(mockMessages);
    setSelectedContact(mockContacts[0]);
  }, []);

  const messages = selectedContact ? messagesByContact[selectedContact.id] || [] : [];

  const handleProfileClick = () => {
    navigate('/Settings');
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
        [selectedContact.id]: [...prevMessages, { from: 'me', text: newMessage.trim(), timestamp: new Date().toISOString() }],
      };
    });

    setNewMessage('');
  };

  const handleNewChat = () => {
    const existingIds = Object.keys(messagesByContact).map(Number);
    const remainingContacts = contacts.filter(c => !existingIds.includes(c.id));

    if (remainingContacts.length > 0) {
      const newContact = remainingContacts[0];
      setMessagesByContact(prev => ({
        ...prev,
        [newContact.id]: [{ from: 'them', text: 'Hello, let\'s chat!', timestamp: new Date().toISOString() }]
      }));
      setSelectedContact(newContact);
    } else {
      alert('All contacts are already in chats!');
    }
  };

  return (
    <>
      <NavigationBar />
      <div className="chat-container">
        <aside className="sidebar">
          <div className="sidebar-header" onClick={handleProfileClick}>
            <div className="user-avatar" />
            <span className="username">{username}</span>
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
              <div
                key={`${msg.from}-${msg.text}-${msg.timestamp}-${idx}`}
                className={`message ${msg.from === 'me' ? 'outgoing' : 'incoming'}`}
              >
                {msg.text}
                <div className="message-timestamp">
                  {msg.timestamp && new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
    </>
  );
}