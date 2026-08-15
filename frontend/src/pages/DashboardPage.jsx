import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const API_URL = 'https://realestate.gayathiriportfolio.xyz/api';

function DashboardPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const favKey = `favorites_${user.id || user.email || 'guest'}`;
  const predKey = `predictions_${user.id || user.email || 'guest'}`;

  const [stats, setStats] = useState({ favorites: 0, properties: 0, avgPrice: 0, predictions: 0 });
  const [favoriteProps, setFavoriteProps] = useState([]);
  const [myPredictions, setMyPredictions] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const favIds = JSON.parse(localStorage.getItem(favKey) || '[]');
      const predList = JSON.parse(localStorage.getItem(predKey) || '[]');

      const res = await axios.get(`${API_URL}/properties`);
      const props = res.data.properties || [];
      const avg = props.length
        ? Math.round(props.reduce((s, p) => s + (p.price || 0), 0) / props.length)
        : 0;

      const favProps = props.filter(p => favIds.includes(p.id));

      setStats({
        favorites: favIds.length,
        properties: props.length,
        avgPrice: avg,
        predictions: predList.length
      });
      setFavoriteProps(favProps.slice(0, 4));
      setMyPredictions(predList.slice(0, 5));
      setRecent(props.slice(0, 4));
    } catch (err) {
      console.error(err);
    }
  };

  const cardStyle = {
    background: theme.card || 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
    border: `1px solid ${theme.border || '#eee'}`
  };

  return (
    <div style={{ background: theme.background || '#f8fafc', minHeight: '100vh', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <h1 style={{ margin: '0 0 6px', fontSize: '28px', color: theme.text || '#111' }}>
          📋 Dashboard
        </h1>
        <p style={{ margin: '0 0 28px', color: theme.textSecondary || '#666' }}>
          Welcome back, <strong>{user.name || 'User'}</strong>!
        </p>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '18px',
          marginBottom: '32px'
        }}>
          {[
            { label: 'Saved Favorites', value: stats.favorites, icon: '❤️', path: '/favorites', color: '#ef4444' },
            { label: 'Total Properties', value: stats.properties, icon: '🏠', path: '/properties', color: theme.primary || '#1976d2' },
            { label: 'Avg Market Price', value: `$${stats.avgPrice.toLocaleString()}`, icon: '💰', path: '/analytics', color: '#10b981' },
            { label: 'My Predictions', value: stats.predictions, icon: '🤖', path: '/predict', color: '#8b5cf6' },
          ].map((s, i) => (
            <div
              key={i}
              onClick={() => navigate(s.path)}
              style={{ ...cardStyle, textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div style={{ fontSize: '28px', marginBottom: '6px' }}>{s.icon}</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: theme.textSecondary || '#666' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ ...cardStyle, marginBottom: '28px' }}>
          <h3 style={{ margin: '0 0 16px', color: theme.text || '#111' }}>⚡ Quick Actions</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { label: 'Browse Homes', path: '/properties' },
              { label: 'Price Predictor', path: '/predict' },
              { label: 'My Favorites', path: '/favorites' },
              { label: 'Analytics', path: '/analytics' },
            ].map((a, i) => (
              <button
                key={i}
                onClick={() => navigate(a.path)}
                style={{
                  padding: '10px 20px',
                  background: i === 0 ? (theme.primary || '#1976d2') : (theme.background || '#f1f5f9'),
                  color: i === 0 ? 'white' : (theme.text || '#111'),
                  border: `1px solid ${theme.border || '#e2e8f0'}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* My Favorites Section */}
        <div style={{ ...cardStyle, marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ margin: 0, color: theme.text || '#111' }}>❤️ My Favorites</h3>
            <button
              onClick={() => navigate('/favorites')}
              style={{ background: 'none', border: 'none', color: theme.primary || '#1976d2', cursor: 'pointer', fontWeight: 600 }}
            >
              View All →
            </button>
          </div>

          {favoriteProps.length === 0 ? (
            <p style={{ color: theme.textSecondary || '#888', margin: 0 }}>
              No favorites yet. Go to Properties and click the heart icon!
            </p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '16px'
            }}>
              {favoriteProps.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/property/${p.id}`)}
                  style={{
                    border: `1px solid ${theme.border || '#e2e8f0'}`,
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, color: theme.primary || '#1976d2', marginBottom: '4px' }}>
                    ${p.price?.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '14px', color: theme.text }}>{p.address}</div>
                  <div style={{ fontSize: '12px', color: theme.textSecondary || '#666' }}>
                    {p.city}, {p.state} · {p.bedrooms} bed
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Predictions Section */}
        <div style={{ ...cardStyle, marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ margin: 0, color: theme.text || '#111' }}>🤖 My Recent Predictions</h3>
            <button
              onClick={() => navigate('/predict')}
              style={{ background: 'none', border: 'none', color: theme.primary || '#1976d2', cursor: 'pointer', fontWeight: 600 }}
            >
              New Prediction →
            </button>
          </div>

          {myPredictions.length === 0 ? (
            <p style={{ color: theme.textSecondary || '#888', margin: 0 }}>
              No predictions yet. Try the AI Price Predictor!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myPredictions.map((pred) => (
                <div
                  key={pred.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 16px',
                    background: theme.background || '#f8fafc',
                    borderRadius: '10px',
                    border: `1px solid ${theme.border || '#e2e8f0'}`
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: theme.text }}>
                      {pred.bedrooms} bed · {pred.bathrooms} bath · {pred.sqft} sqft
                    </div>
                    <div style={{ fontSize: '13px', color: theme.textSecondary || '#666' }}>
                      {pred.city} · {new Date(pred.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: theme.primary || '#1976d2', fontSize: '18px' }}>
                      ${pred.predicted_price?.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '12px', color: theme.textSecondary || '#666' }}>
                      {pred.confidence_score}% confidence
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Listed */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ margin: 0, color: theme.text || '#111' }}>🏡 Recently Listed</h3>
            <button
              onClick={() => navigate('/properties')}
              style={{ background: 'none', border: 'none', color: theme.primary || '#1976d2', cursor: 'pointer', fontWeight: 600 }}
            >
              View All →
            </button>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '16px'
          }}>
            {recent.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/property/${p.id}`)}
                style={{
                  border: `1px solid ${theme.border || '#e2e8f0'}`,
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 700, color: theme.primary || '#1976d2', marginBottom: '4px' }}>
                  ${p.price?.toLocaleString()}
                </div>
                <div style={{ fontSize: '14px', color: theme.text }}>{p.address}</div>
                <div style={{ fontSize: '12px', color: theme.textSecondary || '#666' }}>
                  {p.city}, {p.state} · {p.bedrooms} bed · {p.sqft} sqft
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;