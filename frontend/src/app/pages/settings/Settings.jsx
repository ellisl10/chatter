import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { NavigationBar } from '../../../components/NavigationBar';
import './Settings.css';

export function Settings() {
  const location = useLocation();
  const getLinkClass = (path) => {
    return location.pathname === path ? 'menu-item active' : 'menu-item';
  };

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
              <Link to="/settings" className={getLinkClass('/settings')}>My Account</Link>
              <Link to="/settings/privacy" className={getLinkClass('/settings/privacy')}>Privacy</Link>
              <Link to="/settings/about-us" className={getLinkClass('/settings/about-us')}>About Us</Link>
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
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
