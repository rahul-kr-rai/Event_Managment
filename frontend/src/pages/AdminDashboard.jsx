import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../api';

const AdminDashboard = () => {
  const { setIsSidebarOpen } = useOutletContext(); // Access toggle from Layout
  
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchEvents(); fetchNotifications(); }, []);
  const fetchEvents = () => { axios.get(`${API_URL}/api/events`).then(res => setEvents(res.data)); };
  const fetchNotifications = () => { axios.get(`${API_URL}/api/notifications`).then(res => setNotifications(res.data)); };

  const handleDismiss = async (id) => {
      await axios.delete(`${API_URL}/api/notifications/${id}`);
      fetchNotifications();
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this event?")) {
      await axios.delete(`${API_URL}/api/events/${id}`);
      fetchEvents();
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    await axios.put(`${API_URL}/api/events/${id}`, { status: newStatus });
    fetchEvents();
  };

  const filteredEvents = events.filter(ev => {
    return (filter === 'all' || ev.status === filter) && ev.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <main className="admin-content">
      <button className="menu-toggle-btn" onClick={() => setIsSidebarOpen(true)}>
        <i className="fas fa-bars"></i> Menu
      </button>

      {notifications.length > 0 && (
        <div style={{marginBottom:'30px', background:'#fff0f0', border:'1px solid #ffcdd2', borderRadius:'10px', padding:'20px'}}>
            <h3 style={{margin:'0 0 15px 0', color:'#c62828'}}>⚠️ Security Alerts</h3>
            {notifications.map(notif => (
                <div key={notif._id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'white', padding:'10px', borderRadius:'5px', marginBottom:'10px', borderLeft:'4px solid #c62828'}}>
                    <div>
                        <strong style={{color:'#c62828'}}>Unauthorized Access:</strong> {notif.message}
                        <br/>
                        <small style={{color:'#555'}}>{new Date(notif.date).toLocaleString()}</small>
                    </div>
                    <button onClick={() => handleDismiss(notif._id)} style={{background:'transparent', border:'none', color:'#777', cursor:'pointer', fontWeight:'bold'}}>Dismiss</button>
                </div>
            ))}
            <Link to="/admin/users" style={{color:'#c62828', fontWeight:'bold', textDecoration:'underline'}}>Go to Users to Block</Link>
        </div>
      )}

      <h1>Events Management</h1>
      <div className="admin-controls-bar">
        <div className="admin-search-bar" style={{flex:1}}>
          <input type="text" placeholder="Search..." onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="admin-filter-dropdown">
          <select onChange={e => setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="live">Live</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
      </div>

      <div className="admin-event-list">
        {filteredEvents.map(ev => (
          <div className="admin-event-card" key={ev._id}>
            <div>
              <h3>{ev.title}</h3>
              <p><i className="fas fa-map-marker-alt"></i> {ev.location} | {ev.date}</p>
            </div>
            <div>
               <span style={{fontWeight:'bold', color: ev.status==='live' ? '#2ecc71' : (ev.status==='past' ? '#e74c3c' : '#f39c12')}}>
                 {ev.status.toUpperCase()}
               </span>
            </div>
            <div className="admin-event-actions">
              <Link to={`/admin/edit/${ev._id}`}><button className="edit-btn">Edit</button></Link>
              {ev.status !== 'live' && <button className="start-btn" onClick={() => handleStatusUpdate(ev._id, 'live')}>Start</button>}
              {ev.status === 'live' && <button className="stop-btn" onClick={() => handleStatusUpdate(ev._id, 'past')}>Stop</button>}
              <button className="delete-btn" onClick={() => handleDelete(ev._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default AdminDashboard;