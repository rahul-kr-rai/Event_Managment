import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { API_URL } from '../api';

const AdminUsers = () => {
  const { setIsSidebarOpen } = useOutletContext();
  const [users, setUsers] = useState([]);

  useEffect(() => { fetchUsers(); }, []);
  const fetchUsers = async () => { try { const res = await axios.get(`${API_URL}/api/admin/users`); setUsers(res.data); } catch (err) {} };

  const handleRestrict = async (userId) => {
    if(window.confirm("Change user status?")) {
      await axios.put(`${API_URL}/api/admin/users/${userId}/restrict`);
      fetchUsers();
    }
  };

  const handleDelete = async (userId) => {
    if(window.confirm("Are you sure? Data will be lost.")) {
      await axios.delete(`${API_URL}/api/admin/users/${userId}`);
      fetchUsers();
    }
  };

  return (
    <main className="admin-content" style={{backgroundColor: '#f8f9fc'}}> 
      <button className="menu-toggle-btn" onClick={() => setIsSidebarOpen(true)}><i className="fas fa-bars"></i> Menu</button>
      <div style={{background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)'}}>
        <h2 style={{margin:'0 0 30px 0', color:'#2c3e50'}}>Manage Users</h2>
        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', fontSize:'14px'}}>
            <thead><tr style={{borderBottom: '2px solid #f0f0f0', color:'#888', textAlign:'left'}}><th style={{padding:'15px'}}>Name</th><th style={{padding:'15px'}}>Email</th><th style={{padding:'15px'}}>Role</th><th style={{padding:'15px'}}>Status</th><th style={{padding:'15px'}}>Actions</th></tr></thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} style={{borderBottom: '1px solid #f9f9f9', opacity: user.isBlocked ? 0.6 : 1}}>
                  <td style={{padding:'15px', fontWeight:'bold'}}>{user.name}</td>
                  <td style={{padding:'15px', color:'#555'}}>{user.email}</td>
                  <td style={{padding:'15px'}}><span style={{background:'#e3f2fd', color:'#1565c0', padding:'5px 10px', borderRadius:'15px', fontWeight:'bold'}}>{user.role}</span></td>
                  <td style={{padding:'15px'}}>{user.isBlocked ? <span style={{color:'red'}}>🚫 Restricted</span> : <span style={{color:'green'}}>✔ Active</span>}</td>
                  <td style={{padding:'15px'}}>
                    <button onClick={() => handleRestrict(user._id)} style={{marginRight:'10px', cursor:'pointer', background:'none', border:'1px solid orange', borderRadius:'10px', padding:'5px'}}>Block/Unblock</button>
                    <button onClick={() => handleDelete(user._id)} style={{cursor:'pointer', background:'none', border:'1px solid red', color:'red', borderRadius:'10px', padding:'5px'}}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};
export default AdminUsers;