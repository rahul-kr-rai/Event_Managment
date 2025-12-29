import React, { useState, useEffect } from 'react';
import Slider from "react-slick"; 
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../api';

const Carousel = () => {
  const [slides, setSlides] = useState([]);

  // Default Fallback Images
  const defaultSlides = [
    { _id: '1', imageUrl: "https://images.unsplash.com/photo-1459749411177-8c275bb0cc94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", title: "Welcome to Eventia" },
    { _id: '2', imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", title: "Discover Amazing Events" },
    { _id: '3', imageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", title: "Join the Community" }
  ];

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/events`);
        const eventsWithImages = res.data.filter(ev => ev.imageUrl);
        
        if (eventsWithImages.length > 0) {
          setSlides(eventsWithImages);
        } else {
          setSlides(defaultSlides);
        }
      } catch (err) {
        console.error(err);
        setSlides(defaultSlides);
      }
    };
    fetchImages();
  }, []);

  // --- SLIDER SETTINGS ---
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,        // Transition speed (0.8s)
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // <--- UPDATED: 3 Seconds per slide
    pauseOnHover: true,
    arrows: false,
  };

  return (
    <section className="carousel-banner" style={{ marginBottom: '40px', overflow: 'hidden' }}>
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide._id} style={{position: 'relative', outline: 'none'}}>
            
            <div style={{ width: '100%', height: '450px', position: 'relative' }}>
                <img 
                    src={slide.imageUrl} 
                    alt={slide.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                
                {/* Dark Gradient Overlay */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
                }}></div>

                {/* Text Content */}
                <div style={{
                    position: 'absolute', bottom: '40px', left: '50px', color: 'white', zIndex: 10
                }}>
                    <h2 style={{ fontSize: '36px', margin: '0 0 10px 0', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
                        {slide.title}
                    </h2>
                    
                    {/* "View Details" Button (Only for real events) */}
                    {slide.date && (
                        <Link to={`/event/${slide._id}`}>
                            <button style={{
                                padding: '10px 25px', borderRadius: '30px', border: 'none', 
                                background: '#2ecc71', color: 'white', fontWeight: 'bold', 
                                cursor: 'pointer', marginTop: '10px'
                            }}>
                                View Details
                            </button>
                        </Link>
                    )}
                </div>
            </div>

          </div>
        ))}
      </Slider>
    </section>
  );
};

export default Carousel;