import { NavigationBar } from '../../../components/NavigationBar.jsx';
import { Sidebar } from './Sidebar.jsx';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Contacts.css';
import './Sidebar.css';
import { Container, Row, Col, Form, Button, ListGroup, InputGroup } from 'react-bootstrap';
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../../firebase";

export const Contacts = ({users}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const filteredUsernames = allUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !contacts.some((contact) => contact.username === user.username)
  );

  useEffect(() => {
    setAllUsers(users);
  }, [users]);

  const addContact = async (contactUid, conactData) => {
    const user = auth.currentUser;
    if (!user) return;

    const contactRef = doc(db, "users", user.uid, "contacts", contactUid);
    await setDoc(contactRef, conactData);
  };

  return (
    <>
      <div className="contacts">
        <h3 className="fw-bold mb-4 text-center">Add Friends</h3>
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter a username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="primary">Send Request</Button>
        </InputGroup>
        {filteredUsernames.length > 0 ? (
          <ListGroup>
            {filteredUsernames.map((user) => (
              <ListGroup.Item key={user.username} className="d-flex justify-content-between align-items-center">
                {user.name || user.username} ({user.username})
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => addContact(user.uid, {
                    username: user.username,
                    email: user.email,
                    addedAt: serverTimestamp()
                  })}
                >
                  Add
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p className="text-muted text-center">No users found.</p>
        )}
    </div>
    </>
    );
};
