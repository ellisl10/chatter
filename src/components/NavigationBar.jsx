import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavigationBar.css';

export default function NavigationBar() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    return (
        <nav className="navbar fixed-top navbar-expand-xl navbar-dark bg-dark">
            <a className="navbar-brand" href="#">Chatter</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
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
}
