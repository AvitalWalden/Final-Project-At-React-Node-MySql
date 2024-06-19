import React, { useState, useEffect } from 'react';
import '../css/Home.css';
import gift1 from '../images/gift1.jpg';
import gift2 from '../images/gift2.jpg';
import gift3 from '../images/gift3.jpg';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeSection, setActiveSection] = useState('intro');
  const [isScrolledDown, setIsScrolledDown] = useState(false);

  const slides = [gift1, gift2, gift3];

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSection = () => {
    setActiveSection('intro');
  };

  const nextSection = () => {
    setActiveSection('about');
  };

  const handleArrowClickDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    setIsScrolledDown(true);
  };

  const handleArrowClickUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsScrolledDown(false);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="home-container">
        <h1 className="title">
          <span style={{ '--animation-order': 0 }}>Donation</span>
          {'                    '}
          <span style={{ '--animation-order': 1 }}>Sale</span>
          {'                    '}
          <span style={{ '--animation-order': 2 }}>Site</span>
        </h1>
        <div className="slideshow">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={index === currentSlide ? 'slide active' : 'slide'}
              style={{ backgroundImage: `url(${slide})` }}
            />
          ))}
        </div>
        {!isScrolledDown && (
          <div className="arrow-scroll" onClick={handleArrowClickDown}>
            <MdKeyboardDoubleArrowDown style={{ color: "white", fontSize: "50px" }} />
          </div>
        )}
      </div>
      {isScrolledDown && (
        <div className="arrow-scroll" onClick={handleArrowClickUp}>
          <MdKeyboardDoubleArrowUp style={{ fontSize: "50px" }} />
        </div>
      )}
      <div className="content">
        {activeSection === 'intro' && (
          <div className="intro">
            <p>
              <span style={{ fontSize: "50px" }}>Welcome</span> to our online platform dedicated to supporting charitable causes through the
              sale of donated gifts. Here, every purchase you make directly contributes to meaningful
              charitable endeavors. Explore our selection of unique gifts from generous donors and
              find something special while making a difference in the lives of those in need.
            </p>
            <button className="next-button" onClick={nextSection}>
              Next➡
            </button>
          </div>
        )}

        {activeSection === 'about' && (
          <div className="about">
            <h2>About Us 😁</h2>
            <p>
              At our donation sale site, we believe in the power of giving. Our mission is to connect
              donated gifts with compassionate buyers, creating a cycle of generosity that benefits
              charitable organizations. Whether you're looking for a thoughtful gift or a meaningful
              purchase, your contribution helps support various causes, making a positive impact in
              our community and beyond. Thank you for visiting and for being a part of our journey to
              make the world a better place through your generosity.
            </p>
            <button className="prev-button" onClick={prevSection}>
              ⬅Previous
            </button>
            <button className="gifts-button" onClick={() => { navigate('/gifts') }}>
              See our gifts🎁
            </button>
          </div>
        )}
      </div>
      <footer className="footer">
        <div className="inner">
          <p>&copy; 2024 Donation Sale Site. All rights reserved.</p>
          <div className="social-links">
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
            <a href="#">Instagram</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
