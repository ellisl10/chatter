import { NavigationBar } from '../../../components/NavigationBar.jsx';
import { Sidebar } from './Sidebar.jsx';
import { React, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Contacts.css';
import './Sidebar.css';
import { Container, Row, Col, Form, Button, ListGroup, InputGroup } from 'react-bootstrap';

const mockContacts = [
  { name: 'Joe Brown', username: 'joebrown' },
  { name: 'John Doe', username: 'johndoe' },
  { name: 'Jane Doe', username: 'janedoe' },
  { name: 'Alice Smith', username: 'alicesmith' },
];

export const Contacts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState(mockContacts);

  const mockUsernames = [
    { name: 'John Doe', username: 'johndoe' },
    { name: 'Jane Smith', username: 'janesmith' },
    { name: 'Alice Wonder', username: 'alice' },
    { name: 'Bob Builder', username: 'bob' },
    { name: 'Charlie Brown', username: 'charliebrown' },
  ];

  const filteredUsernames = mockUsernames.filter(
    (user) =>
      user.username.includes(searchTerm) &&
      !contacts.some((contact) => contact.username === user.username)
  );

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
                {user.name} ({user.username})
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setContacts([...contacts, user])}
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
