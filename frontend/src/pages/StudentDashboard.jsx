import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../api';

const StudentDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); 
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      axios.get(`${API_URL}/api/my-registrations?email=${user.email}`)
        .then(res => setRegistrations(res.data))
        .catch(err => console.log(err));
    }
  }, [user]);

  // --- FILTERING LOGIC ---
  const activeEvents = registrations.filter(reg => 
    reg.currentStatus === 'live' || reg.currentStatus === 'upcoming'
  );
  
  const historyEvents = registrations.filter(reg => 
    reg.currentStatus === 'past' || reg.currentStatus === 'deleted'
  );

  return (
    <div>
      <Navbar />
      
      <main className="content" style={{ minHeight: '60vh' }}>

        {/* Welcome Header */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '30px', textAlign: 'center' }}>
            <h2 style={{margin: '0 0 10px 0', color: '#6a0dad'}}>
              Welcome, {user?.name}!
            </h2>
            <p style={{color: '#777', margin:0}}>
              {user?.email}
            </p>
        </div>

        {/* --- TOGGLE SWITCH BUTTONS --- */}
        <div className="tab-container" style={{marginBottom: '40px'}}>
          <button 
            className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`} 
            onClick={() => setActiveTab('active')}
          >
            Active Events ({activeEvents.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} 
            onClick={() => setActiveTab('history')}
          >
            Event History ({historyEvents.length})
          </button>
        </div>

        {/* --- VIEW 1: ACTIVE EVENTS --- */}
        {activeTab === 'active' && (
          <div>
            {activeEvents.length === 0 ? (
              <div style={{textAlign:'center', padding:'40px', color:'#777'}}>
                <h3>No active events found.</h3>
                <Link to="/" style={{color:'#3498db', fontWeight:'bold'}}>Browse Events</Link>
              </div>
            ) : (
              <div className="event-cards-container">
                {activeEvents.map(reg => (
                  <div className="event-card" key={reg._id}>
                    <div className="event-card-header">
                      <h3>{reg.eventTitle}</h3>
                      <div className="event-status" style={{ color: '#2ecc71' }}>
                        <span className="status-dot" style={{ backgroundColor: '#2ecc71' }}></span>
                        Registered
                      </div>
                    </div>
                    <div className="event-details-row" style={{ margin: '15px 0' }}>
                      <span style={{ color: '#555' }}><i className="fas fa-calendar-alt" style={{ color: '#3498db' }}></i> {reg.eventDate}</span>
                      <span style={{ color: '#555' }}><i className="fas fa-map-marker-alt" style={{ color: '#3498db' }}></i> {reg.eventLocation}</span>
                    </div>
                    <div className="event-tags" style={{ marginBottom: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ background: '#e0f7fa', color: '#006064', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                         Booked on: {new Date(reg.registrationDate).toLocaleDateString()}
                      </span>
                      {/* Show Seats Left */}
                      {reg.currentStatus !== 'deleted' && (
                        <span style={{background:'#fff3e0', color:'#ef6c00', padding:'6px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:'600'}}>
                            Seats left: {reg.currentCapacity}
                        </span>
                      )}
                    </div>
                    <Link to={`/event/${reg.eventId}`} className="view-details-btn" style={{ width: '100%', textAlign: 'center', boxSizing: 'border-box' }}>
                      View Event Page
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- VIEW 2: EVENT HISTORY --- */}
        {activeTab === 'history' && (
          <div>
            {historyEvents.length === 0 ? (
              <div style={{textAlign:'center', padding:'40px', color:'#777'}}>
                <h3>No past events found.</h3>
              </div>
            ) : (
              <div className="event-cards-container">
                {historyEvents.map(reg => (
                  <div className="event-card" key={reg._id} style={{ borderColor: '#ddd', opacity: 0.8, backgroundColor: '#f9f9f9' }}>
                    <div className="event-card-header">
                      <h3 style={{ color: '#7f8c8d' }}>{reg.eventTitle}</h3>
                      <div className="event-status" style={{ color: '#e74c3c' }}>
                        <span className="status-dot" style={{ backgroundColor: '#e74c3c' }}></span>
                        {reg.currentStatus === 'deleted' ? 'Deleted' : 'Past'}
                      </div>
                    </div>
                    <div className="event-details-row" style={{ margin: '15px 0' }}>
                      <span style={{ color: '#999' }}><i className="fas fa-calendar-alt" style={{ color: '#bbb' }}></i> {reg.eventDate}</span>
                      <span style={{ color: '#999' }}><i className="fas fa-map-marker-alt" style={{ color: '#bbb' }}></i> {reg.eventLocation}</span>
                    </div>
                    
                    {reg.currentStatus === 'deleted' ? (
                      <button disabled style={{ width: '100%', padding: '12px', border: '1px solid #ddd', background: '#eee', color: '#999', borderRadius: '30px', cursor: 'not-allowed' }}>
                        Event Removed
                      </button>
                    ) : (
                      <Link to={`/event/${reg.eventId}`} style={{ display:'block', width: '100%', padding: '12px', textAlign: 'center', border: '1px solid #3498db', background: 'transparent', color: '#3498db', borderRadius: '30px', textDecoration:'none', fontWeight:'bold' }}>
                        View Past Event
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default StudentDashboard;