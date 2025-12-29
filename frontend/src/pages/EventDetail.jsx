import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../api';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registrationDetails, setRegistrationDetails] = useState(null);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [teamData, setTeamData] = useState({ teamName: '', leaderMobile: '', members: [] });

  useEffect(() => {
    axios.get(`${API_URL}/api/events/${id}`).then(res => setEvent(res.data));
    if (user) {
      axios.get(`${API_URL}/api/my-registrations?email=${user.email}`).then(res => {
          const found = res.data.find(reg => reg.eventId === id);
          if (found) { setIsRegistered(true); setRegistrationDetails(found);
            if (found.isTeamRegistration) { setTeamData({ teamName: found.teamName, leaderMobile: found.teamLeaderMobile, members: found.teamMembers }); }
          }
        }).catch(err => console.log(err));
    }
  }, [id, user]);

  const addMember = () => setTeamData({ ...teamData, members: [...teamData.members, { name: '', email: '', mobile: '' }] });
  const removeMember = (index) => { const m = [...teamData.members]; m.splice(index, 1); setTeamData({ ...teamData, members: m }); };
  const handleMemberChange = (index, field, value) => { const m = [...teamData.members]; m[index][field] = value; setTeamData({ ...teamData, members: m }); };
  const handleProceed = () => { if (!user) { setIsLoginModalOpen(true); return; } if (!agreed) { alert("Please agree to Terms."); return; } setShowTeamForm(true); };
  const handleCancel = () => { setShowTeamForm(false); };

  const handleRegister = async () => {
    if (!agreed) { alert("Please agree to the Terms & Conditions"); return; }
    if (!user) { setIsLoginModalOpen(true); return; }
    
    const isHackathon = event.category?.toLowerCase().includes('hackathon');
    if (isHackathon && (!teamData.teamName || !teamData.leaderMobile)) { alert("Please fill Team Name and Leader Mobile"); return; }

    const payload = {
      eventId: event._id, eventTitle: event.title, eventDate: event.date, eventLocation: event.location,
      userEmail: user.email, userName: user.name,
      isTeamRegistration: isHackathon,
      teamName: isHackathon ? teamData.teamName : undefined,
      teamLeaderMobile: isHackathon ? teamData.leaderMobile : undefined,
      teamMembers: isHackathon ? teamData.members : undefined,
      amount: event.price
    };

    // CASE 1: FREE EVENT
    if (!event.price || event.price === 0) {
        completeRegistration(payload);
        return;
    }

    // CASE 2: PAID EVENT (RAZORPAY)
    try {
        // A. Create Order
        const orderRes = await axios.post(`${API_URL}/api/payment/create-order`, { amount: event.price });
        
        // B. Configure Razorpay
        const options = {
            // --- FIX: USING YOUR REAL KEY HERE ---
            key: "rzp_test_Ro4Mcyum4HfPMy", 
            amount: orderRes.data.amount,
            currency: "INR",
            name: "Eventia",
            description: `Registration for ${event.title}`,
            image: "https://cdn-icons-png.flaticon.com/512/2907/2907150.png",
            order_id: orderRes.data.id,
            
            handler: async function (response) {
                try {
                    // C. Verify Payment
                    const verifyRes = await axios.post(`${API_URL}/api/payment/verify`, {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    });

                    if (verifyRes.status === 200) {
                        // D. Register User
                        payload.paymentId = response.razorpay_payment_id;
                        payload.orderId = response.razorpay_order_id;
                        completeRegistration(payload);
                    } else {
                        alert("Payment verification failed.");
                    }
                } catch (verifyErr) {
                    console.error(verifyErr);
                    alert("Payment verification failed on server.");
                }
            },
            prefill: { name: user.name, email: user.email },
            theme: { color: "#6a0dad" }
        };
        
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response){
            alert("Payment Failed: " + response.error.description);
        });
        rzp.open();

    } catch (err) {
        console.error(err);
        alert("Payment initiation failed.");
    }
  };

  const completeRegistration = async (payload) => {
    try {
      await axios.post(`${API_URL}/api/register`, payload);
      alert("Registration Successful!");
      setShowSuccess(true);
      setEvent(prev => ({ ...prev, capacity: prev.capacity - 1 }));
      setIsRegistered(true); 
    } catch (error) {
      alert(error.response?.data?.error || "Registration failed");
    }
  };

  if (!event) return <div style={{textAlign:'center', padding:'50px'}}>Loading...</div>;
  const isHackathon = event.category?.toLowerCase().includes('hackathon');
  const showForm = isHackathon && ( (showTeamForm && !isRegistered && !showSuccess) || (isRegistered && registrationDetails?.isTeamRegistration) );

  return (
    <div className="event-page-container">
      <Navbar />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      <img src={event.imageUrl} alt="Banner" className="event-hero-banner" />

      <div className="event-split-layout">
        <div className="event-left-content">
          <h1 className="event-title-large">{event.title}</h1>
          <div className="title-underline"></div>
          
          {!showForm && (
            <>
              <h3 className="about-heading">About this event</h3>
              <div className="event-desc-text" dangerouslySetInnerHTML={{ __html: event.description }} />
            </>
          )}

          {showForm && (
            <div id="team-form-section" className={`hackathon-form-card ${isRegistered ? 'read-only' : ''}`}>
                <div className="hackathon-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div><h3>{isRegistered ? "✅ Your Team Details" : "🚀 Team Registration"}</h3><p>{isRegistered ? "You are already registered." : "Fill in the details below."}</p></div>
                    {!isRegistered && !showSuccess && <button onClick={handleCancel} style={{background:'rgba(255,255,255,0.2)', border:'none', color:'white', cursor:'pointer', padding:'5px 10px', borderRadius:'5px'}}>Cancel</button>}
                </div>
                
                <div className="hackathon-body">
                    <div className="form-row" style={{display:'flex', gap:'20px', marginBottom:'15px'}}>
                        <div className="form-group" style={{flex:1}}><label className="section-label">Team Name</label><input type="text" value={teamData.teamName} onChange={e => setTeamData({...teamData, teamName: e.target.value})} disabled={isRegistered || showSuccess} style={{width:'100%', padding:'12px', border:'1px solid #ddd', borderRadius:'8px'}} /></div>
                        <div className="form-group" style={{flex:1}}><label className="section-label">Leader Mobile</label><input type="text" value={teamData.leaderMobile} onChange={e => setTeamData({...teamData, leaderMobile: e.target.value})} disabled={isRegistered || showSuccess} style={{width:'100%', padding:'12px', border:'1px solid #ddd', borderRadius:'8px'}} /></div>
                    </div>

                    <div className="leader-section"><span className="section-label">Team Leader (You)</span><div style={{display:'flex', gap:'20px', color:'#555', fontWeight:'500'}}><span>👤 {user ? user.name : 'Login Required'}</span><span>📧 {user ? user.email : '...'}</span></div></div>

                    <span className="section-label" style={{marginBottom:'10px'}}>Team Members</span>
                    {teamData.members.map((member, index) => (
                        <div key={index} className="member-card">
                            {!isRegistered && !showSuccess && <button onClick={() => removeMember(index)} className="remove-member-btn" title="Remove">&times;</button>}
                            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'10px'}}>
                                <input type="text" placeholder="Member Name" value={member.name} onChange={e => handleMemberChange(index, 'name', e.target.value)} disabled={isRegistered || showSuccess} style={{padding:'10px', border:'1px solid #ddd', borderRadius:'6px'}} />
                                <input type="text" placeholder="Mobile" value={member.mobile} onChange={e => handleMemberChange(index, 'mobile', e.target.value)} disabled={isRegistered || showSuccess} style={{padding:'10px', border:'1px solid #ddd', borderRadius:'6px'}} />
                            </div>
                            <input type="email" placeholder="Member Email" value={member.email} onChange={e => handleMemberChange(index, 'email', e.target.value)} disabled={isRegistered || showSuccess} style={{width:'95%', padding:'10px', border:'1px solid #ddd', borderRadius:'6px'}} />
                        </div>
                    ))}

                    {!isRegistered && !showSuccess && (
                        <>
                            <button onClick={addMember} className="add-member-btn"><i className="fas fa-plus-circle"></i> Add Team Member</button>
                            <button onClick={handleRegister} className="save-btn" style={{width:'100%', marginTop:'20px', fontSize:'18px'}}>
                                {event.price > 0 ? `Pay ₹${event.price} & Register Team` : 'Submit Team Registration'}
                            </button>
                        </>
                    )}
                </div>
            </div>
          )}
        </div>

        <div className="event-right-sidebar">
          <div className="details-card">
            <h4 className="card-heading">Event details</h4>
            <div className="info-row"><span className="info-label">Status</span><span className="info-value"><span style={{color: event.status === 'live' ? '#2ecc71' : '#f39c12'}}>● {event.status}</span></span></div>
            <div className="info-row"><span className="info-label">Date</span><span className="info-value">{event.date}</span></div>
            <div className="info-row"><span className="info-label">Time</span><span className="info-value">{event.time}</span></div>
            <div className="info-row"><span className="info-label">Location</span><span className="info-value">{event.location}</span></div>
            <div className="info-row"><span className="info-label">Seat Left</span><span className="info-value">{event.capacity}</span></div>
            <div className="info-row"><span className="info-label">Registration</span><span className="info-value" style={{fontWeight:'bold', color: event.price > 0 ? '#6a0dad' : '#333'}}>{event.price > 0 ? `₹${event.price}` : 'Free'}</span></div>

            {isRegistered ? (
              <div style={{marginTop: '25px', textAlign: 'center', backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '8px', border: '1px solid #a5d6a7'}}>
                <h4 style={{margin: '0 0 5px 0', color: '#2e7d32'}}>✔ Already Registered</h4>
                <button onClick={() => navigate('/dashboard')} style={{marginTop:'10px', background:'transparent', border:'1px solid #2e7d32', color:'#2e7d32', padding:'8px 15px', borderRadius:'20px', cursor:'pointer'}}>Go to Dashboard</button>
              </div>
            ) : showSuccess ? (
              <div style={{marginTop: '25px', textAlign: 'center', backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '8px', border: '1px solid #90caf9'}}>
                <h4 style={{margin: '0 0 5px 0', color: '#1565c0'}}>🎉 Success!</h4>
                <button onClick={() => navigate('/dashboard')} style={{marginTop:'10px', background:'#1565c0', border:'none', color:'white', padding:'10px 20px', borderRadius:'20px', cursor:'pointer', fontWeight:'bold'}}>View Ticket</button>
              </div>
            ) : (
              <>
                <div className="terms-checkbox" style={{marginTop: '25px', display:'flex', alignItems:'center', gap:'10px'}}>
                  <input type="checkbox" id="agree" onChange={(e) => setAgreed(e.target.checked)} style={{cursor:'pointer', transform:'scale(1.2)'}} />
                  <label htmlFor="agree" style={{fontSize:'14px', color:'#555', cursor:'pointer'}}>Agree Terms & Condition</label>
                </div>
                {!showTeamForm && (
                    <button 
                    onClick={isHackathon ? handleProceed : handleRegister} 
                    disabled={!agreed}
                    className={`register-action-btn ${agreed ? 'active' : 'disabled'}`}
                    >
                    {user ? (isHackathon ? "Proceed" : (event.price > 0 ? `Pay ₹${event.price}` : "Register Now")) : "Login to Register"}
                    </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetail;