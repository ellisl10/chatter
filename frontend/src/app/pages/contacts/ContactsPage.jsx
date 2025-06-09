import React, { useEffect, useState } from 'react';
import './ContactsPage.css';
import { Contacts } from './Contacts.jsx';
import { Sidebar } from './Sidebar.jsx';
import { NavigationBar } from '../../../components/NavigationBar.jsx';
import { db } from '../../../firebase.js';
import { collection, getDocs } from 'firebase/firestore';

export const ContactsPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersArray);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="main-wrapper">
      <NavigationBar />
      <div className="sidebar-wrapper">
        <Sidebar />
      </div>
      <div className="contacts-wrapper">
        <Contacts users={users} />
      </div>
    </div>
  );
};
