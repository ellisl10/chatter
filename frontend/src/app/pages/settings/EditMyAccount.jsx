import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditAccountForm } from './EditAccountForm';

export function EditMyAccount() {
  const navigate = useNavigate();
  const [accountDetails, setAccountDetails] = useState({
    displayName: 'Your Name',
    username: 'username',
    email: 'youremail@gmail.com',
  });

  const handleSave = (updatedDetails) => {
    // In a real application, you would send this data to your backend
    console.log('Saving changes:', updatedDetails);
    setAccountDetails(updatedDetails);
    navigate(-1); // Go back to the previous page (My Account)
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page (My Account)
  };

  return (
    <div className="edit-my-account-container">
      <EditAccountForm
        currentDisplayName={accountDetails.displayName}
        currentUsername={accountDetails.username}
        currentEmail={accountDetails.email}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
} 