import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-columns">
        <div className="footer-col">
          <h4>ABOUT US</h4>
          <p>Eventia is your go-to platform for discovering and managing events. We connect event organizers with attendees worldwide, making event planning and participation seamless and enjoyable.</p>
        </div>
        
        <div className="footer-col">
          <h4>SERVICES</h4>
          <ul>
            <li><a href="#">Event Listing</a></li>
            <li><a href="#">Ticketing</a></li>
            <li><a href="#">Promotion</a></li>
            <li><a href="#">Venue Booking</a></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h4>QUICK LINKS</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Sitemap</a></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h4>CONTACT US</h4>
          <p>123 Event Street</p>
          <p>City, State, 12345</p>
          <p>info@eventia.com</p>
          <div className="social-icons">
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
          </div>
        </div>
      </div>
      
      <div className="copyright" style={{textAlign:'center', marginTop:'20px', fontSize:'14px', color:'#ccc'}}>
        &copy; 2025 Eventia. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;