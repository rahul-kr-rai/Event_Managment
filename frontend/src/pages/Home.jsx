import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../api';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('live');
  const [registeredIds, setRegisteredIds] = useState([]); 
  const { user } = useAuth(); 

  // --- HELPER: STRIP HTML TAGS FOR CLEAN PREVIEW ---
  const stripHtml = (html) => {
    if (!html) return "";
    // Create a temporary element to extract text
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  // 1. Fetch All Events
  useEffect(() => {
    axios.get(`${API_URL}/api/events`)
      .then(res => setEvents(res.data))
      .catch(err => console.log(err));
  }, []);

  // 2. Fetch User's Registrations
  useEffect(() => {
    if (user) {
      axios.get(`${API_URL}/api/my-registrations?email=${user.email}`)
        .then(res => {
          const ids = res.data.map(reg => reg.eventId);
          setRegisteredIds(ids);
        })
        .catch(err => console.log(err));
    } else {
      setRegisteredIds([]);
    }
  }, [user]);

  // Filter events based on tab
  const filteredEvents = events.filter(event => event.status === activeTab);

  return (
    <div>
      <Navbar />
      <Carousel />
      
      <main className="content">
        
        {/* TAB SWITCHER */}
        <div className="tab-container">
          <button 
            className={`tab-btn ${activeTab === 'live' ? 'active' : ''}`} 
            onClick={() => setActiveTab('live')}
          >
            Live Events
          </button>
          <button 
            className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`} 
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Events
          </button>
        </div>

        <section className="events-section">
          <h2>{activeTab === 'live' ? 'Happening Now' : 'Coming Soon'}</h2>
          
          {filteredEvents.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px', color: '#777'}}>
              <h3>No {activeTab} events found.</h3>
            </div>
          ) : (
            <div className="event-cards-container">
              {filteredEvents.map(event => {
                const isBooked = registeredIds.includes(event._id);
                
                // Convert HTML description to Plain Text
                const cleanDescription = stripHtml(event.description);

                return (
                  <div className="event-card" key={event._id} style={{border: isBooked ? '2px solid #27ae60' : '2px solid #2ecc71'}}>
                    
                    {/* Header */}
                    <div className="event-card-header">
                      <h3>{event.title}</h3>
                      
                      {isBooked ? (
                        <div className="event-status" style={{color: '#27ae60', fontWeight:'800'}}>
                          <span className="status-dot" style={{backgroundColor: '#27ae60'}}></span>
                          Registered
                        </div>
                      ) : (
                        <div className="event-status" style={{color: event.status === 'live' ? '#2ecc71' : '#f39c12'}}>
                          <span className="status-dot" style={{backgroundColor: event.status === 'live' ? '#2ecc71' : '#f39c12'}}></span>
                          {event.status === 'live' ? 'Live' : 'Upcoming'}
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="event-details-row" style={{margin: '15px 0'}}>
                      <span style={{color: '#555'}}><i className="fas fa-calendar-alt" style={{color:'#3498db'}}></i> {event.date}</span>
                      <span style={{color: '#555'}}><i className="fas fa-map-marker-alt" style={{color:'#3498db'}}></i> {event.location}</span>
                    </div>

                    {/* Tags */}
                    <div className="event-tags" style={{display: 'flex', gap: '10px', marginBottom: '15px', flexWrap:'wrap'}}>
                       <span style={{background:'#e0f7fa', color:'#006064', padding:'6px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:'600'}}>
                          {event.category || 'Event'}
                       </span>
                       
                       {!isBooked && (
                         <span style={{background:'#fff3e0', color:'#ef6c00', padding:'6px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:'600'}}>
                            Seats left: {event.capacity}
                         </span>
                       )}
                    </div>
                    
                    {/* FIXED DESCRIPTION: Shows clean text only */}
                    <p style={{color: '#666', fontSize: '15px', lineHeight: '1.5', marginBottom: '25px'}}>
                      {cleanDescription ? cleanDescription.substring(0, 90) : "Join the event..."}...
                    </p>
                    
                    {/* Button */}
                    <Link to={`/event/${event._id}`} className="view-details-btn" style={{width: '100%', textAlign: 'center', boxSizing: 'border-box', backgroundColor: isBooked ? '#27ae60' : '#2ecc71'}}>
                      {isBooked ? 'View Ticket' : 'View Details'}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;