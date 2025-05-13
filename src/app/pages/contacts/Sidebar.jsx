import React, { useState } from 'react';
import './Sidebar.css';
import { BsGear, BsPerson, BsArrowLeft } from 'react-icons/bs';
import MarginFix from '../../../components/MarginFix';

const contacts = [
  { name: 'Joe Brown' },
  { name: 'John Doe' },
  { name: 'Jane Doe' },
  { name: 'Alice Smith' },
];

function groupByFirstLetter(data) {
  const grouped = {};
  data.forEach(({ name }) => {
    const letter = name[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(name);
  });
  return grouped;
}

export const Sidebar = () => {
  const [search, setSearch] = useState('');
  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  MarginFix('decenter-mode');

  const grouped = groupByFirstLetter(filtered);

  return (
    <div className='"sidebar d-flex flex-column p-3"'>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <BsArrowLeft size={20} />
        <div className="d-flex align-items-center gap-2">
          <BsPerson />
          <strong>User Name</strong>
        </div>
        <BsGear size={20} />
      </div>

      <div className="input-group mb-3 rounded-pill search-bar px-2">
        <input
          type="text"
          className="form-control border-0"
          placeholder="Search Contacts"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-sm btn-outline-secondary">×</button>
      </div>

      <div className="contacts-list">
        {Object.keys(grouped).sort().map(letter => (
          <div key={letter}>
            <div className="fw-bold text-muted small py-1">{letter}</div>
            {grouped[letter].map(name => (
              <div key={name} className="contact-entry d-flex align-items-center py-2 border-top">
                <div className="avatar bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-2">
                  <BsPerson />
                </div>
                <span>{name}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
