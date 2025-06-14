import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { BsPerson } from 'react-icons/bs';
import { Modal, Button } from 'react-bootstrap';
import { auth, db } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

function groupByFirstLetter(data) {
  const grouped = {};
  data.forEach((contact) => {
    const letter = contact.displayName[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(contact);
  });
  return grouped;
}

export const Sidebar = () => {
  const [contacts, setContacts] = useState([]);
  const [displayName, setDisplayName] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const unsubUser = onSnapshot(userRef, (snapshot) => {
          const data = snapshot.data();
          if (data?.displayName) setDisplayName(data.displayName);
        });
        const contactsRef = collection(db, "users", user.uid, "contacts");
        const unsubContacts = onSnapshot(contactsRef, (snapshot) => {
          const contactList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setContacts(contactList);
        });
        return unsubContacts;
      } else {
        setContacts([]);
        setDisplayName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const clearForm = () => setSearch('');

  const filtered = contacts.filter(c => c.displayName?.toLowerCase().includes(search.toLowerCase()));
  const grouped = groupByFirstLetter(filtered);

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const handleDeleteContact = async () => {
    if (!selectedContact) return;
    try {
      const contactRef = doc(db, "users", auth.currentUser.uid, "contacts", selectedContact.id);
      await deleteDoc(contactRef); // Actually deletes the document
      setShowModal(false);
      setSelectedContact(null);
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete contact. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedContact(null);
  };

  return (
    <div className='sidebar'>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <BsPerson />
          <strong>{displayName}</strong>
        </div>
      </div>

      <div className="input-group mb-3 rounded-pill search-bar px-2">
        <input
          type="text"
          className="form-control border-0"
          placeholder="Search Contacts"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-sm btn-outline-secondary" onClick={clearForm}>×</button>
      </div>

      <div className="contacts-list">
        {Object.keys(grouped).sort().map(letter => (
          <div key={letter}>
            <div className="fw-bold text-muted small py-1">{letter}</div>
            {grouped[letter].map(contact => (
              <div
                key={contact.uid}
                className="contact-entry d-flex align-items-center py-2 border-top"
                onClick={() => handleContactClick(contact)}
                style={{ cursor: 'pointer' }}
              >
                <div className="avatar bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-2">
                  <BsPerson />
                </div>
                <span>{contact.displayName}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {selectedContact && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Contact Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Name:</strong> {selectedContact.displayName}</p>
            <p><strong>Email:</strong> {selectedContact.email}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
            <Button variant="primary" onClick={handleDeleteContact}>
              Delete Contact
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};