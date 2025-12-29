import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../api';
import Navbar from '../components/Navbar';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/auth/reset-password/${token}`, { password });
      alert("Password reset successful! You can now login.");
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || "Link expired or invalid");
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{maxWidth: '400px', margin: '100px auto', padding: '30px', background: 'white', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}>
        <h2 style={{textAlign:'center', color:'#2c3e50'}}>Set New Password</h2>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'15px'}}>
            <label style={{display:'block', marginBottom:'5px', fontWeight:'600'}}>New Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{width:'100%', padding:'10px', border:'1px solid #ddd', borderRadius:'5px'}} />
          </div>
          <div style={{marginBottom:'15px'}}>
            <label style={{display:'block', marginBottom:'5px', fontWeight:'600'}}>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{width:'100%', padding:'10px', border:'1px solid #ddd', borderRadius:'5px'}} />
          </div>
          <button type="submit" style={{width:'100%', padding:'12px', background:'#3498db', color:'white', border:'none', borderRadius:'30px', cursor:'pointer', fontWeight:'bold'}}>
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;