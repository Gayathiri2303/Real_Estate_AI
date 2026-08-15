import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

const API_URL = 'https://realestate.gayathiriportfolio.xyz/api';

function FavoritesPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const favKey = `favorites_${user.id || user.email || 'guest'}`;

  const [favorites, setFavorites] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favIds = JSON.parse(localStorage.getItem(favKey) || '[]');
      
      if (favIds.length === 0) {
        setFavorites([]);
        setProperties([]);
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_URL}/properties`);
      const all = res.data.properties || [];
      const favProps = all.filter(p => favIds.includes(p.id));
      
      setFavorites(favIds);
      setProperties(favProps);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (id) => {
    const updated = favorites.filter(f => f !== id);
    localStorage.setItem(favKey, JSON.stringify(updated));
    setFavorites(updated);
    setProperties(prev => prev.filter(p => p.id !== id));
    toast.success('Removed from favorites');
  };

  const cardStyle = {
    background: theme.card || 'white',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
    border: `1px solid ${theme.border || '#eee'}`,
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s'
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: theme.text || '#111' }}>
        Loading Favorites...
      </div>
    );
  }

  return (
    <div style={{ background: theme.background || '#f8fafc', minHeight: '100vh', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <h1 style={{ margin: '0 0 8px', fontSize: '28px', color: theme.text || '#111' }}>
          ❤️ My Favorites
        </h1>
        <p style={{ margin: '0 0 28px', color: theme.textSecondary || '#666' }}>
          {properties.length} saved {properties.length === 1 ? 'property' : 'properties'}
        </p>

        {properties.length === 0 ? (
          <div style={{
            ...cardStyle,
            textAlign: 'center',
            padding: '60px 20px',
            cursor: 'default'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🤍</div>
            <h3 style={{ color: theme.text || '#111', margin: '0 0 8px' }}>No favorites yet</h3>
            <p style={{ color: theme.textSecondary || '#666', marginBottom: '24px' }}>
              Browse properties and tap the heart to save them here
            </p>
            <button
              onClick={() => navigate('/properties')}
              style={{
                padding: '12px 28px',
                background: theme.primary || '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '22px'
          }}>
            {properties.map((p) => (
              <div
                key={p.id}
                style={cardStyle}
                onClick={() => navigate(`/property/${p.id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)';
                }}
              >
                <div style={{
                  height: '130px',
                  background: `linear-gradient(135deg, ${(theme.primary || '#1976d2')}25, #e0e7ff)`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '42px',
                  marginBottom: '14px',
                  position: 'relative'
                }}>
                  🏡
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(p.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      cursor: 'pointer',
                      fontSize: '18px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  >
                    ❤️
                  </button>
                </div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: theme.primary || '#1976d2', marginBottom: '4px' }}>
                  ${p.price?.toLocaleString()}
                </div>
                <div style={{ fontWeight: 600, color: theme.text || '#111', marginBottom: '4px' }}>{p.address}</div>
                <div style={{ fontSize: '13px', color: theme.textSecondary || '#666', marginBottom: '10px' }}>
                  📍 {p.city}, {p.state}
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: theme.textSecondary || '#666' }}>
                  <span>🛏 {p.bedrooms}</span>
                  <span>🛁 {p.bathrooms}</span>
                  <span>📐 {p.sqft} sqft</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;