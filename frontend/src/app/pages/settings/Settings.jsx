import React, { useState, useEffect } from 'react';
import { NavigationBar } from '../../../components/NavigationBar';
import { Button } from './EditButton';
import './Settings.css';
import { Modal } from 'react-bootstrap';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

export function Settings() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    email: ''
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const fetchUserData = async () => {
          try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const data = userSnap.data();
              setFormData({
                displayName: data.displayName || '',
                username: data.username || '',
                email: data.email || '',
              });
            }
          } catch (error) {
            console.error("Could not fetch user data:", error);
          }
        };
        fetchUserData();
      }
    });
  
    return () => unsubscribe(); // cleanup
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        username: formData.username,
        email: formData.email,
      });
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating Firestore:", error);
      alert("Failed to update settings.");
    }
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
              <a href="/settings" className="menu-item active">My Account</a>
              <a href="/about-us" className="menu-item">About Us</a>
              <a href="/support" className="menu-item">Support</a>
            </nav>

            <a href="/logout" className="logout-link">
              Log Out ↗
            </a>
          </aside>

          <main className="settings-main">
            <h1 className="about-us-title" style={{ marginBottom: '2rem' }}>Edit Profile</h1>
            <div className="settings-header">
              <div className="settings-avatar">👤</div>
              <h1 className="settings-username">{formData.username}</h1>
              <button 
                className="settings-edit"
                onClick={() => setShowEditModal(true)}
              >
                Edit
              </button>
            </div>

            <div className="settings-details">
              <div className="detail-row">
                <span className="detail-label">Display Name</span>
                <span className="detail-value">{formData.displayName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Username</span>
                <span className="detail-value">{formData.username}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email</span>
                <span className="detail-value">{formData.email}</span>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="edit-form">
            <div className="form-group mb-3">
              <label htmlFor="displayName">Display Name</label>
              <input
                type="text"
                className="form-control"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSaveChanges}>
            Save Changes
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
