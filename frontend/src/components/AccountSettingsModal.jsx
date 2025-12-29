import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../api';

const AccountSettingsModal = ({ isOpen, onClose }) => {
  const { user, login } = useAuth(); 
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(''); // For instant preview
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      // If user already has an image from DB, use it
      setPreviewUrl(user.profileImage || '');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setImageFile(file);
        // Create a fake local URL to show preview instantly
        setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Use FormData because we are sending a file
    const formData = new FormData();
    formData.append('userId', user.id || user._id);
    formData.append('name', name);
    formData.append('email', email);
    if (imageFile) {
        formData.append('profileImage', imageFile);
    }

    try {
      const res = await axios.put(`${API_URL}/api/auth/update-profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Update Local Context
      const updatedUserData = { ...user, ...res.data };
      login(updatedUserData); 

      alert("Profile updated successfully!");
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ padding: '40px', maxWidth: '450px' }}>
        <span className="close-button" onClick={onClose}>&times;</span>
        
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#2c3e50' }}>Account Settings</h2>
        
        <form onSubmit={handleSubmit}>
            
          {/* IMAGE PREVIEW SECTION */}
          <div style={{textAlign: 'center', marginBottom: '20px'}}>
            <div className="profile-avatar" style={{
                width:'100px', 
                height:'100px', 
                fontSize:'40px', 
                margin:'0 auto 10px',
                backgroundImage: previewUrl ? `url(${previewUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                {/* Show Letter ONLY if no image */}
                {!previewUrl && name.charAt(0).toUpperCase()}
            </div>
            
            {/* Custom File Input Button */}
            <label style={{cursor:'pointer', color:'#3498db', fontSize:'14px', fontWeight:'bold'}}>
                Change Profile Picture
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    style={{display:'none'}} 
                />
            </label>
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <button 
            type="submit" 
            className="login-btn" 
            style={{ width: '100%', marginTop: '20px', opacity: isLoading ? 0.7 : 1 }}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountSettingsModal;