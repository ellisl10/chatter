import React from 'react';
import { Link } from 'react-router-dom';

export function MyAccount() {
  // In a real application, these details would come from a global state or API
  const accountDetails = {
    displayName: 'Your Name',
    username: 'username',
    email: 'youremail@gmail.com',
  };

  return (
    <>
      <div className="settings-header">
        <div className="settings-avatar">👤</div>
        <h1 className="settings-username">User Name</h1>
        <Link to="/settings/my-account/edit" className="settings-edit">Edit</Link>
      </div>

      <div className="settings-details">
        <div className="detail-row">
          <span className="detail-label">Display Name</span>
          <span className="detail-value">{accountDetails.displayName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Username</span>
          <span className="detail-value">{accountDetails.username}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Email</span>
          <span className="detail-value">{accountDetails.email}</span>
        </div>
      </div>
    </>
  );
} 