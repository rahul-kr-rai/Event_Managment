import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('manage');

  // Sync Sidebar Active Tab with URL
  useEffect(() => {
    const path = location.pathname;
    if (path === '/admin') setActiveTab('manage');
    else if (path.includes('/admin/create')) setActiveTab('create');
    else if (path.includes('/registrations')) setActiveTab('registrations');
    else if (path.includes('/users')) setActiveTab('users');
  }, [location]);

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        
        {/* Sidebar (Fixed here) */}
        <AdminSidebar 
          active={activeTab} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* Content Area (Pages load here) */}
        <div style={{flex: 1, width: '100%'}}>
            {/* Pass the toggle function down to pages so the Menu button works */}
            <Outlet context={{ setIsSidebarOpen }} /> 
        </div>

      </div>
    </div>
  );
};

export default AdminLayout;