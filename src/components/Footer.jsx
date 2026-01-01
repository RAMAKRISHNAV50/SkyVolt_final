import { Link,NavLink } from "react-router-dom";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">
          <div className="brand-logo">SV</div>
          <h2>Sky Volt</h2>
          <p>
            instead of using electricity to make wind like a fan—wind turbines use wind to make electricity
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About Us</NavLink>
          <NavLink href="/contact">Contact Us</NavLink>
          {/* <NavLink to="/">Home</NavLink>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link> */}
        </div>

        {/* CONTACT */}
        <div className="footer-contact">
          <h3>Contact</h3>
          <p>support@skyvolt.com</p>
          <p>+91 8688 151326</p>
          <p>India</p>
        </div>

        {/* SOCIAL */}
        <div className="footer-social">
          <h3>Follow Us</h3>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <FaFacebookF /> Facebook
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            <FaLinkedinIn /> LinkedIn
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <FaTwitter /> Twitter
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <FaInstagram /> Instagram
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer">
            <FaYoutube /> YouTube
          </a>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        © 2025 SkyVolt · All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
