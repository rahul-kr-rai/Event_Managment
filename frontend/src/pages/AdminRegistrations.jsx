import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx-js-style'; // Library for styling
import { API_URL } from '../api';

const AdminRegistrations = () => {
  const { setIsSidebarOpen } = useOutletContext();
  
  const [events, setEvents] = useState([]);
  const [allRegistrations, setAllRegistrations] = useState([]);
  
  const [selectedEvent, setSelectedEvent] = useState(null); 
  const [selectedEventRegs, setSelectedEventRegs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsRes = await axios.get(`${API_URL}/api/events`);
        setEvents(eventsRes.data);

        const regsRes = await axios.get(`${API_URL}/api/admin/registrations`);
        setAllRegistrations(regsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const getRegistrationCount = (eventId) => {
    return allRegistrations.filter(reg => reg.eventId === eventId).length;
  };

  const handleViewDetails = (event) => {
    const specificRegs = allRegistrations.filter(reg => reg.eventId === event._id);
    setSelectedEventRegs(specificRegs);
    setSelectedEvent(event);
  };

  // --- EXCEL EXPORT WITH STYLED HEADERS (A2 RANGE) ---
  const exportToExcel = () => {
    if (selectedEventRegs.length === 0) {
      alert("No data to download.");
      return;
    }

    const isHackathon = selectedEvent.category?.toLowerCase().includes('hackathon');
    let excelData = [];

    if (isHackathon) {
      excelData = selectedEventRegs.map(reg => {
        const date = new Date(reg.registrationDate).toLocaleDateString();
        const members = reg.teamMembers || [];
        const val = (v) => (v && v.toString().trim() !== "") ? v.toString() : "-";

        const rowData = {
          "Team Name": reg.isTeamRegistration ? val(reg.teamName) : "Individual",
          "Leader Name": val(reg.userName),
          "Leader Email": val(reg.userEmail),
          "Leader Mobile": reg.isTeamRegistration ? val(reg.teamLeaderMobile) : "-",
        };

        for (let i = 0; i < 3; i++) {
          const member = members[i];
          rowData[`Member ${i + 1} Name`] = member ? val(member.name) : "-";
          rowData[`Member ${i + 1} Email`] = member ? val(member.email) : "-";
          rowData[`Member ${i + 1} Mobile`] = member ? val(member.mobile) : "-";
        }

        rowData["Registration Date"] = date;
        rowData["Status"] = "Confirmed";
        return rowData;
      });

    } else {
      excelData = selectedEventRegs.map(reg => {
        const date = new Date(reg.registrationDate).toLocaleDateString();
        const time = new Date(reg.registrationDate).toLocaleTimeString();
        return {
          "Student Name": reg.userName || "N/A",
          "Student Email": reg.userEmail,
          "Registration Date": date,
          "Registration Time": time,
          "Status": "Confirmed"
        };
      });
    }

    // 1. Create Worksheet at A2
    const worksheet = XLSX.utils.json_to_sheet(excelData, { origin: 'A2' });

    // 2. Add Title at A1
    XLSX.utils.sheet_add_aoa(worksheet, [[`Event Title : ${selectedEvent.title}`]], { origin: 'A1' });

    // 3. Calculate Range
    const range = XLSX.utils.decode_range(worksheet['!ref']); // Get dimensions
    const numberOfColumns = Object.keys(excelData[0]).length;

    // 4. Merge Title Row
    if (!worksheet['!merges']) worksheet['!merges'] = [];
    worksheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: numberOfColumns - 1 } });

    // 5. Style Title (A1) - Yellow Background
    if (!worksheet['A1']) worksheet['A1'] = {};
    worksheet['A1'].s = {
        font: { bold: true, sz: 14, color: { rgb: "000000" } },
        alignment: { horizontal: "center", vertical: "center" },
        fill: { fgColor: { rgb: "FFFF00" } }
    };

    // --- 6. APPLY STYLE TO HEADER ROW (A2 to End of Row) ---
    // We loop through every column in Row 2 (Index 1)
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: 1, c: C }); // r:1 means Row 2
        if (!worksheet[address]) continue;
        
        worksheet[address].s = {
            font: {
                bold: true,
                sz: 12,
                color: { rgb: "FF0000" } // Red Text
            },
            alignment: {
                horizontal: "center",
                vertical: "center"
            },
            // Optional: Add a light gray background to make the red pop
            fill: { fgColor: { rgb: "F0F0F0" } },
            border: {
                bottom: { style: "thin", color: { rgb: "000000" } }
            }
        };
    }

    // 7. Auto-Size Columns
    const maxWidths = [];
    const headers = Object.keys(excelData[0]);
    headers.forEach(key => {
        let maxLen = key.length;
        excelData.forEach(row => {
            const value = row[key] ? row[key].toString() : "";
            if (value.length > maxLen) maxLen = value.length;
        });
        maxWidths.push({ wch: maxLen + 2 }); 
    });
    worksheet['!cols'] = maxWidths;

    // 8. Download
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(workbook, `${selectedEvent.title}_Data.xlsx`);
  };

  return (
    <main className="admin-content" style={{backgroundColor: '#f8f9fc'}}> 
      <button className="menu-toggle-btn" onClick={() => setIsSidebarOpen(true)}>
        <i className="fas fa-bars"></i> Menu
      </button>

      {!selectedEvent && (
        <div style={{background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
            <h2 style={{margin:0, color:'#2c3e50'}}>All Events</h2>
            <button style={{border:'1px solid #6a0dad', background:'white', color:'#6a0dad', padding:'10px 20px', borderRadius:'20px', fontWeight:'bold', cursor:'pointer'}}>
              Export Summary
            </button>
          </div>

          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', fontSize:'14px'}}>
              <thead>
                <tr style={{borderBottom: '2px solid #f0f0f0', color:'#888', textTransform:'uppercase', fontSize:'12px'}}>
                  <th style={{padding: '15px', textAlign: 'left'}}>TITLE</th>
                  <th style={{padding: '15px', textAlign: 'left'}}>DATE</th>
                  <th style={{padding: '15px', textAlign: 'left'}}>STATUS</th>
                  <th style={{padding: '15px', textAlign: 'left'}}>LOCATION</th>
                  <th style={{padding: '15px', textAlign: 'left'}}>REGISTRATIONS</th>
                  <th style={{padding: '15px', textAlign: 'left'}}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => {
                  const count = getRegistrationCount(event._id);
                  const totalCapacity = event.capacity + count; 

                  return (
                    <tr key={event._id} style={{borderBottom: '1px solid #f9f9f9'}}>
                      <td style={{padding: '20px 15px', fontWeight:'500', color:'#333'}}>{event.title}</td>
                      <td style={{padding: '20px 15px', color:'#555'}}>{event.date}</td>
                      <td style={{padding: '20px 15px'}}>
                        <span style={{
                          padding: '5px 12px', borderRadius: '15px', fontSize: '11px', fontWeight: 'bold',
                          backgroundColor: event.status === 'live' ? '#e8f5e9' : (event.status === 'upcoming' ? '#fff3e0' : '#ffebee'),
                          color: event.status === 'live' ? '#2e7d32' : (event.status === 'upcoming' ? '#ef6c00' : '#c62828')
                        }}>
                          {event.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{padding: '20px 15px', color:'#555'}}>{event.location}</td>
                      <td style={{padding: '20px 15px', color:'#555'}}>
                        {count} / {totalCapacity}
                      </td>
                      <td style={{padding: '20px 15px'}}>
                        <button 
                          onClick={() => handleViewDetails(event)}
                          style={{backgroundColor: '#3498db', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize:'13px', fontWeight:'600'}}
                        >
                          View Registration
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedEvent && (
         <div style={{background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)'}}>
           <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
              <div>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  style={{border:'none', background:'transparent', color:'#6a0dad', cursor:'pointer', fontSize:'16px', fontWeight:'bold', marginBottom:'10px'}}
                >
                  ← Back to Events
                </button>
                <h2 style={{margin:0, color:'#2c3e50'}}>Registrations for: {selectedEvent.title}</h2>
              </div>
              
              <button 
                onClick={exportToExcel}
                style={{border:'1px solid #217346', background:'white', color:'#217346', padding:'10px 20px', borderRadius:'20px', fontWeight:'bold', cursor:'pointer'}}
              >
                Download Excel
              </button>
           </div>

           <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '20px'}}>
            <thead>
              <tr style={{backgroundColor: '#f8f9fa', textAlign: 'left', color:'#555'}}>
                <th style={{padding: '15px'}}>Student Name</th>
                <th style={{padding: '15px'}}>Student Email</th>
                <th style={{padding: '15px'}}>Type</th>
                <th style={{padding: '15px'}}>Date</th>
                <th style={{padding: '15px'}}>Status</th>
              </tr>
            </thead>
            <tbody>
              {selectedEventRegs.length === 0 ? (
                <tr><td colSpan="5" style={{padding:'30px', textAlign:'center', color:'#777'}}>No students registered yet.</td></tr>
              ) : (
                selectedEventRegs.map(reg => (
                  <tr key={reg._id} style={{borderBottom: '1px solid #eee'}}>
                    <td style={{padding: '15px', fontWeight:'bold', color:'#333'}}>
                        {reg.userName || 'N/A'}
                    </td>
                    <td style={{padding: '15px', color:'#555'}}>
                        {reg.userEmail}
                    </td>
                    
                    <td style={{padding: '15px'}}>
                        {reg.isTeamRegistration ? (
                            <div>
                                <span style={{color:'#6a0dad', fontWeight:'bold'}}>Team: {reg.teamName}</span>
                                <div style={{fontSize:'11px', color:'#777'}}>+ {reg.teamMembers ? reg.teamMembers.length : 0} Members</div>
                            </div>
                        ) : (
                            <span style={{color:'#777'}}>Individual</span>
                        )}
                    </td>

                    <td style={{padding: '15px'}}>{new Date(reg.registrationDate).toLocaleDateString()}</td>
                    <td style={{padding: '15px'}}>
                      <span style={{color:'green', fontWeight:'bold', fontSize:'14px'}}>✔ Confirmed</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
         </div>
      )}

    </main>
  );
};

export default AdminRegistrations;