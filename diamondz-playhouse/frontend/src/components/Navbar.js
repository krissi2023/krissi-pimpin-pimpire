import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          💎 Diamondz Playhouse
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/comics" className="nav-link">Comic Store</Link>
          </li>
          <li className="nav-item">
            <Link to="/arcade" className="nav-link neon-text">Arcade</Link>
          </li>
          <li className="nav-item">
            <Link to="/daily-bonus" className="nav-link">🎁 Daily Bonus</Link>
          </li>
          
          {isAuthenticated && user ? (
            <>
              <li className="nav-item">
                <div className="points-display">
                  <span className="arcade-credits">🎰 ${((user.arcadeCredits || 0) / 100).toFixed(2)}</span>
                  <span className="gold-points">⭐ {user.goldPoints || 0}</span>
                  <span className="pb-points">💎 {user.pbPoints || 0} PB</span>
                </div>
              </li>
              <li className="nav-item">
                <span className="nav-link username">👤 {user.username}</span>
              </li>
              <li className="nav-item">
                <button onClick={logout} className="btn btn-logout">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="btn btn-secondary">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="btn btn-primary">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
