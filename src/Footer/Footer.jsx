import React from 'react';
import { FaFacebookF, FaInstagram, FaEnvelope } from 'react-icons/fa';
import './Footer.css'; // Stilizujte footer prema vašim potrebama

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="social-media">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebookF />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
        </div>
        <div className="contact">
          <a href="mailto:fejzo999@gmail.com">
            <FaEnvelope /> contact@hairdressingsalons.com
          </a>
        </div>
      </div>
      <p className="footer-bottom">© {new Date().getFullYear()} Hairdressing salons. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
