import NavigationBar from '../../../components/NavigationBar';
import { Sidebar } from './Sidebar.jsx';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Contacts.css';


export const Contacts = () => {
  return (
    <>
        <NavigationBar />
        <div className="d-flex contacts">
          <div className='sidebar'>
            <Sidebar />
          </div>
          <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center bg-white">
              <h3 className="fw-bold mb-4">Add Friends</h3>
              <div className="d-flex align-items-center gap-3">
                <div className="input-group rounded-pill border px-3">
                    <input type="text" className="form-control border-0" placeholder="Enter a username" />
                </div>
                <button className="btn btn-primary rounded-pill px-6">Send Request</button>
              </div>
          </div>
        </div>
    </>
  );
}
