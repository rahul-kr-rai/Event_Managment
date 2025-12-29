import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill-new'; 
import 'react-quill-new/dist/quill.snow.css';
import { API_URL } from '../api';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const setIsSidebarOpen = outletContext ? outletContext.setIsSidebarOpen : () => {};

  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '', date: '', time: '', location: '', 
    price: 0, capacity: 100, mode: 'onsite', status: 'draft', 
    category: 'hackathon', description: ''
  });

  useEffect(() => {
    axios.get(`${API_URL}/api/events/${id}`).then(res => {
        const d = res.data;
        setFormData({ 
            title: d.title, date: d.date, time: d.time, location: d.location, 
            price: d.price || 0, capacity: d.capacity || 100, mode: d.mode, 
            status: d.status, category: d.category || 'hackathon', 
            description: d.description || '' 
        });
      }).catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
  const handleDescriptionChange = (value) => setFormData(prev => ({ ...prev, description: value }));
  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) data.append('image', imageFile);

    try {
      await axios.put(`${API_URL}/api/events/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert('Event Updated Successfully!');
      navigate('/admin');
    } catch (error) { alert('Error updating event'); }
  };

  return (
    <main className="admin-content">
       <button className="menu-toggle-btn" onClick={() => setIsSidebarOpen(true)}><i className="fas fa-bars"></i> Menu</button>
      <h1>Edit Event</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row"><div className="form-group"><label>Title</label><input name="title" value={formData.title} onChange={handleChange} required /></div><div className="form-group"><label>Date</label><input type="date" name="date" value={formData.date} onChange={handleChange} required /></div></div>
        <div className="form-row"><div className="form-group"><label>Time</label><input type="time" name="time" value={formData.time} onChange={handleChange} required /></div><div className="form-group"><label>Location</label><input name="location" value={formData.location} onChange={handleChange} required /></div></div>
        <div className="form-row"><div className="form-group"><label>Price</label><input type="number" name="price" value={formData.price} onChange={handleChange} /></div><div className="form-group"><label>Capacity</label><input type="number" name="capacity" value={formData.capacity} onChange={handleChange} /></div></div>
        <div className="form-row">
           <div className="form-group"><label>Category</label><select name="category" value={formData.category} onChange={handleChange}><option value="hackathon">Hackathon</option><option value="mentorship">Mentorship</option><option value="workshop">Workshop</option><option value="placement_drive">Placement Drive</option><option value="internship_drive">Internship Drive</option><option value="college_fest">College Fest</option><option value="other">Other</option></select></div>
           <div className="form-group"><label>Mode</label><select name="mode" value={formData.mode} onChange={handleChange}><option value="onsite">Onsite</option><option value="online">Online</option></select></div>
        </div>
        <div className="form-row"><div className="form-group"><label>Status</label><select name="status" value={formData.status} onChange={handleChange}><option value="draft">Draft</option><option value="upcoming">Upcoming</option><option value="live">Live</option></select></div><div className="form-group"><label>Image</label><input type="file" accept="image/*" onChange={handleFileChange} /></div></div>
        
        {/* UPDATED EDITOR CONTAINER */}
        <div className="form-group" style={{marginBottom: '80px'}}>
            <label style={{marginBottom: '10px', display: 'block'}}>Description</label>
            <ReactQuill 
                theme="snow" 
                value={formData.description} 
                onChange={handleDescriptionChange} 
                style={{height: '200px', background: 'white'}} 
            />
        </div>
        
        <button type="submit" className="save-btn">Update Event</button>
      </form>
    </main>
  );
};
export default EditEvent;