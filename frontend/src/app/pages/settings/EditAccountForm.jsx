import React, { useState } from 'react';

export function EditAccountForm({ currentDisplayName, currentUsername, currentEmail, onSave, onCancel }) {
  const [displayName, setDisplayName] = useState(currentDisplayName);
  const [username, setUsername] = useState(currentUsername);
  const [email, setEmail] = useState(currentEmail);

  const handleSave = () => {
    onSave({ displayName, username, email });
  };

  return (
    <div className="edit-account-popup">
      <div className="popup-content">
        <h2>Edit Account Information</h2>
        <div className="detail-row">
          <label htmlFor="displayName">Display Name</label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="detail-row">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="detail-row">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="popup-actions">
          <button onClick={onCancel} className="cancel-button">Cancel</button>
          <button onClick={handleSave} className="save-button">Save Changes</button>
        </div>
      </div>
    </div>
  );
} 