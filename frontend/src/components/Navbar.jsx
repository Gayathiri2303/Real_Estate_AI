import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import ThemeSelector from './ThemeSelector';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.email === 'admin@gmail.com';
  const isLoggedIn = !!token && !!user;

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    color: isActive(path) ? '#fff' : (theme.text || '#334155'),
    textDecoration: 'none',
    fontWeight: isActive(path) ? 600 : 500,
    padding: '8px 14px',
    borderRadius: '10px',
    background: isActive(path) 
      ? `linear-gradient(135deg, ${theme.primary}, ${theme.secondary || '#1d4ed8'})` 
      : 'transparent',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    display: 'inline-block'
  });

  return (
    <nav style={{
      background: theme.card || 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${theme.border || '#e2e8f0'}`,
      padding: '0 28px',
      height: '68px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
    }}>
      {/* Logo */}
      <Link to="/" style={{ 
        fontSize: '21px', 
        fontWeight: 800, 
        color: theme.primary || '#1e40af', 
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        letterSpacing: '-0.3px'
      }}>
        <span style={{
          background: `linear-gradient(135deg, ${theme.primary || '#2563eb'}, #7c3aed)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🏠 RealEstate AI
        </span>
      </Link>

      {isLoggedIn && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          <Link to="/" style={linkStyle('/')}>Home</Link>
          <Link to="/properties" style={linkStyle('/properties')}>Properties</Link>
          <Link to="/favorites" style={linkStyle('/favorites')}>Favorites</Link>
          <Link to="/predict" style={linkStyle('/predict')}>Predict</Link>
          <Link to="/analytics" style={linkStyle('/analytics')}>Analytics</Link>
          <Link to="/chat" style={linkStyle('/chat')}>Chat</Link>
          <Link to="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link>
          
          {isAdmin ? (
            <Link to="/admin" style={linkStyle('/admin')}>Admin</Link>
          ) : (
            <Link to="/profile" style={linkStyle('/profile')}>Profile</Link>
          )}

          <div style={{ marginLeft: '8px' }}>
            <ThemeSelector />
          </div>

          <button
            onClick={handleLogout}
            style={{
              marginLeft: '10px',
              padding: '8px 18px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;