import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavigationBar.css';

export default function NavigationBar() {
<<<<<<< HEAD
=======
<<<<<<< HEAD
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    return (
        <nav className="navbar fixed-top navbar-expand-xl navbar-dark bg-dark">
            <a className="navbar-brand" href="#">
                <img src="src/assets/message-icon.png" className="chatter-logo" width="30" height="30" />
                Chatter
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <div class="navbar-nav">
                    <a class={`nav-item nav-link ${isActive('/') ? 'active' : ''}`} href="/">Home</a>
                    <a class={`nav-item nav-link ${isActive('/login') ? 'active' : ''}`} href="/login">Login</a>
                    <a class={`nav-item nav-link ${isActive('/register') ? 'active' : ''}`} href="/register">Register</a>
                    <a class={`nav-item nav-link ${isActive('/chat') ? 'active' : ''}`} href="/chat">Chat</a>
                    <a class={`nav-item nav-link ${isActive('/contacts') ? 'active' : ''}`} href="/contacts">Contacts</a>
                </div>
            </div>
        </nav>
    );
=======
>>>>>>> HEAD@{1}
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar fixed-top navbar-expand-xl navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">Chatter</Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <div className="navbar-nav">
          <Link className={`nav-item nav-link ${isActive('/') ? 'active' : ''}`} to="/">Home</Link>
          <Link className={`nav-item nav-link ${isActive('/login') ? 'active' : ''}`} to="/login">Login</Link>
          <Link className={`nav-item nav-link ${isActive('/register') ? 'active' : ''}`} to="/register">Register</Link>
          <Link className={`nav-item nav-link ${isActive('/chat') ? 'active' : ''}`} to="/chat">Chat</Link>
          <Link className={`nav-item nav-link ${isActive('/contacts') ? 'active' : ''}`} to="/contacts">Contacts</Link>
          <Link className={`nav-item nav-link ${isActive('/settings') ? 'active' : ''}`} to="/settings">Settings</Link>
        </div>
      </div>
    </nav>
  );
<<<<<<< HEAD
=======
>>>>>>> 0437d66 (Settings Implementation)
>>>>>>> HEAD@{1}
}
