import React from 'react';

export function MyAccount() {
  return (
    <>
      <div className="settings-header">
        <div className="settings-avatar">👤</div>
        <h1 className="settings-username">User Name</h1>
        <a href="#edit" className="settings-edit">Edit</a>
      </div>

      <div className="settings-details">
        <div className="detail-row">
          <span className="detail-label">Display Name</span>
          <span className="detail-value">Your Name</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Username</span>
          <span className="detail-value">username</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Email</span>
          <span className="detail-value">youremail@gmail.com</span>
        </div>
      </div>
    </>
  );
} 