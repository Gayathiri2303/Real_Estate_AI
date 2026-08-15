import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const API_URL = 'https://realestate.gayathiriportfolio.xyz/api';

function Home() {
  const { theme } = useTheme();
  const [marketData, setMarketData] = useState({
    total_properties: 0,
    average_price: 0,
    top_cities: [],
    price_ranges: {}
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/market/overview`);
      setMarketData(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '70vh',
        background: theme.background 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏠</div>
          <p style={{ color: theme.textSecondary, fontSize: '16px' }}>Loading market insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: theme.background, minHeight: '100vh' }}>
      
      {/* Hero Section */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.primary} 0%, #3b82f6 50%, #6366f1 100%)`,
        padding: '70px 24px 80px',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h1 style={{ 
            fontSize: '42px', 
            fontWeight: 800, 
            margin: '0 0 16px',
            letterSpacing: '-0.5px',
            lineHeight: 1.2
          }}>
            AI-Powered Real Estate Insights
          </h1>
          <p style={{ 
            fontSize: '18px', 
            opacity: 0.9, 
            marginBottom: '32px',
            maxWidth: '560px',
            margin: '0 auto 32px'
          }}>
            Discover properties, predict prices, and analyze the market with intelligent tools built for modern buyers.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/properties')}
              style={{
                padding: '14px 28px',
                background: 'white',
                color: theme.primary,
                border: 'none',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
              }}
            >
              Browse Properties
            </button>
            <button
              onClick={() => navigate('/predict')}
              style={{
                padding: '14px 28px',
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.4)',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)'
              }}
            >
              Try AI Predictor
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ maxWidth: '1100px', margin: '-40px auto 0', padding: '0 20px', position: 'relative', zIndex: 3 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          {[
            { label: 'Total Properties', value: marketData.total_properties?.toLocaleString() || '0', icon: '🏠', color: theme.primary },
            { label: 'Average Price', value: `$${(marketData.average_price || 0).toLocaleString()}`, icon: '💰', color: '#059669' },
            { label: 'Top Cities', value: marketData.top_cities?.length || 0, icon: '📍', color: '#7c3aed' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: theme.card,
              borderRadius: '16px',
              padding: '28px 24px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              textAlign: 'center',
              border: `1px solid ${theme.border}`
            }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{stat.icon}</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: stat.color, marginBottom: '4px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '14px', color: theme.textSecondary, fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Cities */}
      <div style={{ maxWidth: '1100px', margin: '48px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', color: theme.text }}>
          🔥 Top Cities
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '14px'
        }}>
          {(marketData.top_cities || []).map((city, i) => (
            <div key={i} style={{
              background: theme.card,
              borderRadius: '14px',
              padding: '18px 16px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
              border: `1px solid ${theme.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: 600, color: theme.text }}>{city.city}</span>
              <span style={{
                background: `${theme.primary}18`,
                color: theme.primary,
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 600
              }}>
                {city.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Price Distribution */}
      <div style={{ maxWidth: '1100px', margin: '0 auto 60px', padding: '0 20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', color: theme.text }}>
          📊 Price Distribution
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '12px'
        }}>
          {Object.entries(marketData.price_ranges || {}).map(([range, count]) => (
            <div key={range} style={{
              background: theme.card,
              borderRadius: '12px',
              padding: '16px 12px',
              textAlign: 'center',
              border: `1px solid ${theme.border}`
            }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: theme.primary }}>{count}</div>
              <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '4px' }}>{range}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.background === '#0f172a' ? '#0f172a' : '#0f172a'}, #1e293b)`,
        padding: '60px 24px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
          Ready to find your next home?
        </h2>
        <p style={{ opacity: 0.8, marginBottom: '28px', fontSize: '16px' }}>
          Explore hundreds of properties or get an instant AI price prediction.
        </p>
        <button
          onClick={() => navigate('/properties')}
          style={{
            padding: '14px 32px',
            background: `linear-gradient(135deg, ${theme.primary}, #2563eb)`,
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)'
          }}
        >
          Explore Properties →
        </button>
      </div>
    </div>
  );
}

export default Home;