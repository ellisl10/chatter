import React, { useState } from 'react';
import './Sidebar.css';
import { BsGear, BsPerson, BsArrowLeft } from 'react-icons/bs';
import { Modal, Button } from 'react-bootstrap';

function groupByFirstLetter(data) {
  const grouped = {};
  data.forEach((contact) => {
    const letter = contact.name[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(contact); // Push the full contact object
  });
  return grouped;
}

export const Sidebar = ({ contacts }) => {
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState(null); // State for selected contact
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  const clearForm = () => {
    setSearch('');
  };

  // Filter contacts based on search input
  const filtered = contacts.filter(c =>
    c.username.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = groupByFirstLetter(filtered);

  const handleContactClick = (contact) => {
    setSelectedContact(contact); // Set the selected contact
    setShowModal(true); // Show the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
    setSelectedContact(null); // Clear the selected contact
  };

  return (
    <div className='sidebar'>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <BsPerson />
          <strong>User Name</strong>
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
                key={contact.username}
                className="contact-entry d-flex align-items-center py-2 border-top"
                onClick={() => handleContactClick(contact)} // Handle contact click
                style={{ cursor: 'pointer' }}
              >
                <div className="avatar bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-2">
                  <BsPerson />
                </div>
                <span>{contact.name}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Modal for contact details */}
      {selectedContact && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Contact Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Name:</strong> {selectedContact.name}</p>
            <p><strong>Username:</strong> {selectedContact.username}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => window.location.href = `/chat`} // Navigate to chat page `/chat/${selectedContact.username}`
            >
              Message
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};
