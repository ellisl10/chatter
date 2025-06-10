import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav } from 'react-bootstrap';
import './NavigationBar.css';

export const NavigationBar = () => {
    return (
        <Navbar expand="lg" className="navbar bg-body-tertiary" fixed="top">
            <Navbar.Brand href="/">
                <img src="/chatter-logo.svg" className="chatter-logo" width="30" height="30" />
                {' '}Chatter
            </Navbar.Brand>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/chat">Chat</Nav.Link>
                    <Nav.Link href="/contacts">Contacts</Nav.Link>
                    <Nav.Link href="/settings">Settings</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}