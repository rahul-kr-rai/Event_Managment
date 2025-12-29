import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const AdminSidebar = ({ active, isOpen, onClose }) => {
  const { user } = useAuth(); // Get logged-in user details
  
  // Dynamic Style Generator for Buttons
  const getButtonStyle = (isActive) => ({
    width: '100%',
    padding: '15px 30px',
    textAlign: 'left',
    background: isActive ? '#6a0dad' : 'transparent', // Purple when active
    color: isActive ? 'white' : '#555',
    border: 'none',
    borderLeft: isActive ? '5px solid #2ecc71' : '5px solid transparent', // Green border
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '5px',
    transition: 'all 0.3s ease',
    display: 'block' // Ensures full width clickable area
  });

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      ></div>

      {/* Sidebar Container */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        
        {/* Mobile Close Button */}
        <div style={{ textAlign: 'right', padding: '0 20px', display: window.innerWidth > 900 ? 'none' : 'block' }}>
          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#555' }}
          >
            &times;
          </button>
        </div>

        {/* --- MENU LINKS --- */}
        <nav className="sidebar-nav">
          
          {/* 1. Manage Events */}
          <Link to="/admin" style={{textDecoration:'none'}}>
            <button style={getButtonStyle(active === 'manage')}>
              Manage Events
            </button>
          </Link>
          
          {/* 2. Create New Event */}
          <Link to="/admin/create" style={{textDecoration:'none'}}>
            <button style={getButtonStyle(active === 'create')}>
              Create New Event
            </button>
          </Link>
          
          {/* 3. Registrations */}
          <Link to="/admin/registrations" style={{textDecoration:'none'}}>
            <button style={getButtonStyle(active === 'registrations')}>
              Registration
            </button>
          </Link>

          {/* 4. Users (Manage Students) */}
          <Link to="/admin/users" style={{textDecoration:'none'}}>
            <button style={getButtonStyle(active === 'users')}>
              Users
            </button>
          </Link>

        </nav>

        {/* --- FOOTER (Logged In User Info) --- */}
        <div style={{marginTop: 'auto', padding: '20px', borderTop: '1px solid #eee'}}>
          <p style={{margin: '0 0 5px 0', fontSize: '13px', color: '#888'}}>Logged in as</p>
          <div style={{fontWeight: 'bold', color: '#333', fontSize: '15px'}}>
            {user?.name || 'Admin'}
          </div>
          <div style={{fontSize: '12px', color: '#555'}}>
            {user?.email}
          </div>
        </div>

      </aside>
    </>
  );
};

export default AdminSidebar;