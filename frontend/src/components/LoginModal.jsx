import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../api';

const LoginModal = ({ isOpen, onClose, intent }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [view, setView] = useState('login'); 
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    
    if (view === 'forgot') {
        try {
            await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
            alert(`Password reset link sent to ${email}`);
            setView('login');
        } catch (err) { alert("Error sending email"); }
        return;
    }

    const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = { email, password };
    if (type === 'signup') payload.name = name;

    try {
      const res = await axios.post(`${API_URL}${endpoint}`, payload);
      const loggedUser = res.data;
      
      if (type === 'login') {
        
        // --- SECURITY NOTIFICATION CHECK ---
        if (intent === 'admin' && loggedUser.role !== 'admin') {
            
            // 1. Send Notification to Backend (Await ensures it finishes)
            try {
              await axios.post(`${API_URL}/api/notifications`, {
                  message: `Unauthorized Admin Access Attempt by ${loggedUser.name} (${loggedUser.email})`,
                  userEmail: loggedUser.email,
                  userName: loggedUser.name,
                  type: 'security',
                  date: new Date()
              });
            } catch (notifErr) {
              console.error("Notification failed:", notifErr);
            }

            // 2. Alert User
            alert("You are trying to log in admin dashboard through a student ID");
            
            // 3. Redirect to Student Dashboard
            login(loggedUser); 
            onClose();
            navigate('/dashboard');
            return;
        }

        // Normal Login
        alert(`Welcome back, ${loggedUser.name}!`);
        login(loggedUser);
        onClose();
        if (loggedUser.role === 'admin') navigate('/admin');
        else navigate('/dashboard');

      } else {
        alert('Account created successfully! Please login.');
        setView('login');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Invalid Email or Password');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        
        {view === 'forgot' ? (
           <div style={{padding:'40px'}}>
             <h2>Reset Password</h2>
             <form onSubmit={handleSubmit}>
               <div className="form-group"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
               <button type="submit" className="login-btn" style={{width:'100%', marginTop:'20px'}}>Send Link</button>
               <span className="toggle-link" onClick={() => setView('login')}>Back to Login</span>
             </form>
           </div>
        ) : (
          <div className="modal-form-wrapper" style={{ transform: view === 'login' ? 'translateX(0%)' : 'translateX(-50%)' }}>
            <div className="login-form">
              <h2>{intent === 'admin' ? 'Admin Login' : 'Login to Eventia'}</h2>
              <form onSubmit={(e) => handleSubmit(e, 'login')}>
                <div className="form-group"><label>Email</label><input type="text" value={email} onChange={e => setEmail(e.target.value)} required /></div>
                <div className="form-group"><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
                <button type="submit" className="login-btn" style={{width:'100%', marginTop:'20px'}}>Login</button>
                <div style={{display:'flex', justifyContent:'space-between', marginTop:'15px'}}>
                    <span className="toggle-link" onClick={() => setView('signup')} style={{margin:0}}>Create Account</span>
                    <span className="toggle-link" onClick={() => setView('forgot')} style={{margin:0, color:'#e74c3c'}}>Forgot Password?</span>
                </div>
              </form>
            </div>
            <div className="signup-form">
              <h2>Create Account</h2>
              <form onSubmit={(e) => handleSubmit(e, 'signup')}>
                <div className="form-group"><label>Full Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} required /></div>
                <div className="form-group"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
                <div className="form-group"><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
                <button type="submit" className="login-btn" style={{width:'100%', marginTop:'20px'}}>Sign Up</button>
                <span className="toggle-link" onClick={() => setView('login')}>Back to Login</span>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;