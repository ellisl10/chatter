import React, {useEffect, useState} from 'react';
import './ContactsPage.css';
import { Contacts } from './Contacts.jsx';
import { Sidebar } from './Sidebar.jsx';
import { NavigationBar } from '../../../components/NavigationBar.jsx';

const mockContacts = [
    { name: 'Joe Brown', username: 'joebrown' },
    { name: 'John Doe', username: 'johndoe' },
    { name: 'Jane Doe', username: 'janedoe' },
    { name: 'Alice Smith', username: 'alicesmith' },
  ];

export const ContactsPage = () => {
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        fetch('/api/users')
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(err => console.error('Failed to fetch users:', err));
    }, []);

    return (
        <div className="main-wrapper">
            <div>
                <NavigationBar />
            </div>
            <div className="sidebar-wrapper">
                <Sidebar contacts={mockContacts}/>
            </div>
            <div className="contacts-wrapper">
                <Contacts />
            </div>
        </div>
    );
};
