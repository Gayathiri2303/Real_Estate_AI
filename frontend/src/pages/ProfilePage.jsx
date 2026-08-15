import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function ProfilePage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const favKey = `favorites_${user.id || user.email || 'guest'}`;
  const predKey = `predictions_${user.id || user.email || 'guest'}`;

  const [predictions, setPredictions] = useState([]);
  const [favCount, setFavCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user.email === 'admin@gmail.com') {
      navigate('/admin');
      return;
    }
    loadData();
  }, []);

  const loadData = () => {
    try {
      const localPreds = JSON.parse(localStorage.getItem(predKey) || '[]');
      setPredictions(localPreds);

      const favIds = JSON.parse(localStorage.getItem(favKey) || '[]');
      setFavCount(favIds.length);
    } catch (err) {
      setPredictions([]);
      setFavCount(0);
    } finally {
      setLoading(false);
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
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <h1 style={{ margin: '0 0 28px', color: theme.text || '#111', fontSize: '28px' }}>
          👤 My Profile
        </h1>

        {/* User Card */}
        <div style={{ ...cardStyle, marginBottom: '28px', display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.primary || '#2563eb'}, #7c3aed)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            color: 'white',
            fontWeight: 700
          }}>
            {(user.name || user.email || 'U')[0].toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: '0 0 4px', color: theme.text || '#111' }}>{user.name || 'User'}</h2>
            <p style={{ margin: 0, color: theme.textSecondary || '#666' }}>{user.email}</p>
            <p style={{ margin: '6px 0 0', fontSize: '13px', color: theme.textSecondary || '#666' }}>
              Member since {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div style={{ ...cardStyle, textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: theme.primary || '#2563eb' }}>
              {predictions.length}
            </div>
            <div style={{ fontSize: '13px', color: theme.textSecondary || '#666' }}>My Predictions</div>
          </div>
          <div style={{ ...cardStyle, textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#10b981' }}>{favCount}</div>
            <div style={{ fontSize: '13px', color: theme.textSecondary || '#666' }}>My Favorites</div>
          </div>
        </div>

        {/* Prediction History */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 20px', color: theme.text || '#111' }}>📈 My Prediction History</h3>
          
          {loading ? (
            <p style={{ color: theme.textSecondary || '#666' }}>Loading...</p>
          ) : predictions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔮</div>
              <p style={{ color: theme.textSecondary || '#666', marginBottom: '16px' }}>
                You haven't made any predictions yet
              </p>
              <button
                onClick={() => navigate('/predict')}
                style={{
                  padding: '10px 24px',
                  background: theme.primary || '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Make a Prediction
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${theme.border || '#eee'}` }}>
                    <th style={{ padding: '10px', textAlign: 'left', color: theme.textSecondary || '#666' }}>City</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: theme.textSecondary || '#666' }}>Beds</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: theme.textSecondary || '#666' }}>Baths</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: theme.textSecondary || '#666' }}>SqFt</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: theme.textSecondary || '#666' }}>Predicted Price</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: theme.textSecondary || '#666' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((p, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${theme.border || '#eee'}` }}>
                      <td style={{ padding: '12px', color: theme.text || '#111' }}>{p.city || '-'}</td>
                      <td style={{ padding: '12px', color: theme.text || '#111' }}>{p.bedrooms || '-'}</td>
                      <td style={{ padding: '12px', color: theme.text || '#111' }}>{p.bathrooms || '-'}</td>
                      <td style={{ padding: '12px', color: theme.text || '#111' }}>{p.sqft || '-'}</td>
                      <td style={{ padding: '12px', fontWeight: 600, color: theme.primary || '#2563eb' }}>
                        ${(p.predicted_price || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', color: theme.textSecondary || '#666' }}>
                        {p.created_at ? new Date(p.created_at).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;