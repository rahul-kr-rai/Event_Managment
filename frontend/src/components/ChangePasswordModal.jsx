import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../api';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/auth/change-password`, {
        userId: user.id, // Ensure your auth context stores 'id'
        currentPassword,
        newPassword
      });
      
      alert("Password changed successfully!");
      onClose();
      // Clear fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      alert(err.response?.data?.error || "Failed to change password");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{padding: '40px'}}>
        <span className="close-button" onClick={onClose}>&times;</span>
        
        <h2 style={{textAlign:'center', marginBottom:'20px', color:'#2c3e50'}}>Change Password</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Current Password</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
          </div>
          
          <div className="form-group">
            <label>New Password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>

          <button type="submit" className="login-btn" style={{width:'100%', marginTop:'20px'}}>Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;