import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import ChangePasswordModal from './ChangePasswordModal';
import AccountSettingsModal from './AccountSettingsModal';

const Navbar = () => {
  const { user, logout } = useAuth();
  
  // Modal States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  
  // --- FIX: LOGIN INTENT STATE ---
  // Tracks if user clicked "Admin" text or "Login" button
  const [loginIntent, setLoginIntent] = useState('general'); 

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const handleLogout = () => { logout(); navigate('/'); setIsProfileOpen(false); };

  // --- CLICK HANDLERS ---
  const handleAdminClick = () => { 
    setLoginIntent('admin'); // <--- CRITICAL: Mark this as an Admin attempt
    setIsLoginModalOpen(true); 
  };

  const handleGeneralLoginClick = () => {
    setLoginIntent('general'); // Mark as normal login
    setIsLoginModalOpen(true);
  };

  const isActive = (path) => (path === '/admin' && location.pathname.startsWith('/admin')) || location.pathname === path;
  
  const getLinkStyle = (path) => ({
    textDecoration: 'none',
    color: isActive(path) ? '#f1c40f' : 'inherit',
    borderBottom: isActive(path) ? '2px solid #f1c40f' : '2px solid transparent',
    paddingBottom: '5px',
    transition: 'all 0.3s ease',
    fontWeight: isActive(path) ? 'bold' : '600'
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="navbar">
        <div className="logo">Eventia.</div>
        
        <nav style={{ flexGrow: 1 }}>
          <ul style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '30px', marginRight: '20px', listStyle: 'none', margin: 0, padding: 0 }}>
            <li><Link to="/" style={getLinkStyle('/')}>Home</Link></li>
            
            {user && (
              <li>
                <Link 
                  to={user.role === 'admin' ? "/admin" : "/dashboard"}
                  style={getLinkStyle(user.role === 'admin' ? "/admin" : "/dashboard")}
                >
                  {user.role === 'admin' ? "Admin Dashboard" : "My Dashboard"}
                </Link>
              </li>
            )}
            
            {/* ADMIN TAB (Visible to Guests) */}
            {!user && (
              <li>
                <span onClick={handleAdminClick} style={{cursor: 'pointer', fontWeight:'600', color:'#555'}}>
                  Admin
                </span>
              </li>
            )}

            {/* USER PROFILE */}
            {user ? (
              <li className="profile-menu-container" ref={dropdownRef}>
                <div 
                  className="profile-avatar" 
                  onClick={() => setIsProfileOpen(!isProfileOpen)} 
                  title="Menu"
                  style={{
                    backgroundImage: user.profileImage ? `url(${user.profileImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {!user.profileImage && user.name.charAt(0).toUpperCase()}
                </div>

                {isProfileOpen && (
                  <div className="profile-dropdown-card">
                    <div className="dropdown-header">
                      <div className="dropdown-name">{user.name}</div>
                      <div className="dropdown-email">{user.email}</div>
                      <span className="dropdown-role">{user.role}</span>
                    </div>

                    <div className="dropdown-body">
                      <div className="dropdown-item" onClick={() => { setIsChangePassOpen(true); setIsProfileOpen(false); }}>
                        <i className="fas fa-key"></i> Change Password
                      </div>
                      <div className="dropdown-item" onClick={() => { setIsAccountSettingsOpen(true); setIsProfileOpen(false); }}>
                        <i className="fas fa-cog"></i> Account Settings
                      </div>
                    </div>

                    <div className="dropdown-footer">
                      <button className="dropdown-logout" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ) : (
              <li><button className="login-btn" onClick={handleGeneralLoginClick}>Login</button></li>
            )}
          </ul>
        </nav>
      </header>
      
      {/* Pass 'intent' to LoginModal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} intent={loginIntent} />
      <ChangePasswordModal isOpen={isChangePassOpen} onClose={() => setIsChangePassOpen(false)} />
      <AccountSettingsModal isOpen={isAccountSettingsOpen} onClose={() => setIsAccountSettingsOpen(false)} />
    </>
  );
};

export default Navbar;