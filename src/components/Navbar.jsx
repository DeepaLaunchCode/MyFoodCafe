import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file for styling

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo or Brand Name (optional) */}
        <div className="navbar-brand">
          <Link to="/" className="brand-link">  <img width="150" height="100" src="brand.jpg" alt="Moving Image" /></Link>
        </div>

        {/* Hamburger Menu Button for Mobile */}
        <button className="hamburger" onClick={toggleMenu}>
          <span className="hamburger-icon">&#9776;</span>
        </button>

        {/* Navigation Links */}
        <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/orderonline" className="nav-link" onClick={() => setIsMenuOpen(false)}>Order Online</Link>
            </li>
            <li className="nav-item">
              <Link to="/about-us" className="nav-link" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact-us" className="nav-link" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
            </li>
            <li className="nav-item">
              <Link to="/reviews" className="nav-link" onClick={() => setIsMenuOpen(false)}>Reviews</Link>
            </li>
            <li className="nav-item">
              <Link to="/reservetable" className="nav-link" onClick={() => setIsMenuOpen(false)}>Table Reservation</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;