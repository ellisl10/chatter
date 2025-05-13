import './ContactsPage.css';
import { Contacts } from './Contacts.jsx';
import { Sidebar } from './Sidebar.jsx';
import { NavigationBar } from '../../../components/NavigationBar';

const mockContacts = [
    { name: 'Joe Brown', username: 'joebrown' },
    { name: 'John Doe', username: 'johndoe' },
    { name: 'Jane Doe', username: 'janedoe' },
    { name: 'Alice Smith', username: 'alicesmith' },
  ];

export const ContactsPage = () => {
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
