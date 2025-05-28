import React from 'react';
import { NavigationBar } from '../../../components/NavigationBar';
import './Settings.css';

export function Settings() {
  return (
    <>
      <NavigationBar />

      <div className="settings-wrapper">
        <div className="settings-container">
          <aside className="settings-sidebar">
            <input
              type="text"
              className="settings-search"
              placeholder="Search Settings"
            />

            <nav className="settings-menu">
              <a href="#!" className="menu-item active">My Account</a>
              <a href="#!" className="menu-item">Privacy</a>
              <a href="#!" className="menu-item">About Us</a>
            </nav>

            <a href="/logout" className="logout-link">
              Log Out ↗
            </a>
          </aside>

          <main className="settings-main">
            <button
              className="settings-close"
              onClick={() => window.history.back()}
              aria-label="Close Settings"
            >
              ×
            </button>

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
          </main>
        </div>
      </div>
    </>
  );
}
