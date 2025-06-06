import React, {useEffect, useState} from 'react';
import './ContactsPage.css';
import { Contacts } from './Contacts.jsx';
import { Sidebar } from './Sidebar.jsx';
import { NavigationBar } from '../../../components/NavigationBar.jsx';


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
                <Sidebar contacts={users}/>
            </div>
            <div className="contacts-wrapper">
                <Contacts users={users} />
            </div>
        </div>
    );
};
