import React from 'react';
import './LogOut.css';
import logo from '../../../assets/chatter-logo.svg';

export function LogOut() {
    return (
        <div className="logout-container">
            <img src={logo} alt="Chatter Logo" className="logout-logo" />
            <h1 className="logout-message">You have successfully logged out</h1>
        </div>
    );
} 