import { NavigationBar } from '../../../components/NavigationBar.jsx';
import { Sidebar } from './Sidebar.jsx';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Contacts.css';
import './Sidebar.css';
import { Container, Row, Col, Form, Button, ListGroup, InputGroup } from 'react-bootstrap';
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const Contacts = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);

        const contactsRef = collection(db, "users", user.uid, "contacts");
        onSnapshot(contactsRef, (snapshot) => {
          const fetchedContacts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setContacts(fetchedContacts);
        });
      }
    });
  return () => unsubscribe();
}, []);

useEffect(() => {
  if (users?.length > 0) {
    setAllUsers(users);
  }
}, [users]);

const filteredUsernames = allUsers.filter(
  (user) =>
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    user.id !== currentUser?.uid &&
    !contacts.some((contact) => contact.uid === user.id)
);

  const handleAddContact = async (userToAdd) => {
    if (!currentUser || !userToAdd) return;
  
    try {
      await setDoc(doc(db, "users", currentUser.uid, "contacts", userToAdd.id), {
        uid: userToAdd.id,
        email: userToAdd.email,
        displayName: userToAdd.displayName || userToAdd.name,
        addedAt: new Date()
      });
      alert("Contact added!");
    } catch (err) {
      console.error("Error adding contact:", err);
      alert("Failed to add contact.");
    }
  };

  return (
    <>
      <div className="contacts">
        <h3 className="fw-bold mb-4 text-center">Add Friends</h3>
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search by username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        {/* Display all users by their displaynames list */}
        {filteredUsernames.length > 0 ? (
          <ListGroup>
            {filteredUsernames.map((user) => (
              <ListGroup.Item key={user.username} className="d-flex justify-content-between align-items-center">
                @{user.displayName}
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleAddContact(user)}
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
