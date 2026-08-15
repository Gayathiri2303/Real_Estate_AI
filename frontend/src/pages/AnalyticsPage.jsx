import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const API_URL = 'https://realestate.gayathiriportfolio.xyz/api';

function AnalyticsPage() {
  const { theme } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRealAnalytics();
  }, []);

  const loadRealAnalytics = async () => {
    try {
      const res = await axios.get(`${API_URL}/properties`);
      const props = res.data.properties || [];

      const total = props.length;
      const avgPrice = total ? Math.round(props.reduce((s, p) => s + p.price, 0) / total) : 0;
      const minPrice = total ? Math.min(...props.map(p => p.price)) : 0;
      const maxPrice = total ? Math.max(...props.map(p => p.price)) : 0;

      // Cities
      const cityCount = {};
      props.forEach(p => {
        if (p.city) cityCount[p.city] = (cityCount[p.city] || 0) + 1;
      });
      const topCities = Object.entries(cityCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, count]) => ({ name, count }));

      // Price distribution
      const priceRanges = [
        { label: 'Under $100k', count: props.filter(p => p.price < 100000).length },
        { label: '$100k – $150k', count: props.filter(p => p.price >= 100000 && p.price < 150000).length },
        { label: '$150k – $200k', count: props.filter(p => p.price >= 150000 && p.price < 200000).length },
        { label: '$200k – $250k', count: props.filter(p => p.price >= 200000 && p.price < 250000).length },
        { label: 'Over $250k', count: props.filter(p => p.price >= 250000).length },
      ];

      // Bedroom distribution
      const bedCount = {};
      props.forEach(p => {
        const b = p.bedrooms || 0;
        bedCount[b] = (bedCount[b] || 0) + 1;
      });

      setData({
        total,
        avgPrice,
        minPrice,
        maxPrice,
        topCities,
        priceRanges,
        uniqueCities: Object.keys(cityCount).length,
        bedCount
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    background: theme.card,
    borderRadius: '16px',
    padding: '22px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
    border: `1px solid ${theme.border}`
  };

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: theme.text }}>Loading real analytics...</div>;
  }

  if (!data) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Failed to load data</div>;
  }

  const maxCity = Math.max(...data.topCities.map(c => c.count), 1);
  const maxPriceRange = Math.max(...data.priceRanges.map(p => p.count), 1);

  return (
    <div style={{ background: theme.background, minHeight: '100vh', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 6px', fontSize: '28px', color: theme.text }}>📊 Market Analytics</h1>
        <p style={{ margin: '0 0 28px', color: theme.textSecondary }}>
          Live data from your {data.total} properties
        </p>

        {/* Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          {[
            { label: 'Total Properties', value: data.total, icon: '🏠', color: theme.primary },
            { label: 'Average Price', value: `$${data.avgPrice.toLocaleString()}`, icon: '💰', color: '#10b981' },
            { label: 'Lowest Price', value: `$${data.minPrice.toLocaleString()}`, icon: '📉', color: '#3b82f6' },
            { label: 'Highest Price', value: `$${data.maxPrice.toLocaleString()}`, icon: '📈', color: '#f59e0b' },
            { label: 'Cities Covered', value: data.uniqueCities, icon: '📍', color: '#8b5cf6' },
          ].map((s, i) => (
            <div key={i} style={{ ...cardStyle, textAlign: 'center' }}>
              <div style={{ fontSize: '26px', marginBottom: '4px' }}>{s.icon}</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: theme.textSecondary }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px' }}>
          {/* Top Cities */}
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 18px', color: theme.text }}>📍 Top Cities</h3>
            {data.topCities.map((city, i) => (
              <div key={i} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '3px' }}>
                  <span style={{ color: theme.text, fontWeight: 500 }}>{city.name}</span>
                  <span style={{ color: theme.textSecondary }}>{city.count}</span>
                </div>
                <div style={{ height: '7px', background: theme.background, borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${(city.count / maxCity) * 100}%`,
                    background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
                    borderRadius: '4px'
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Price Distribution */}
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 8px', color: theme.text }}>💵 Price Distribution</h3>
            <p style={{ margin: '0 0 16px', fontSize: '12px', color: theme.textSecondary }}>
              How many properties fall into each price range
            </p>
            {data.priceRanges.map((range, i) => (
              <div key={i} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '3px' }}>
                  <span style={{ color: theme.text, fontWeight: 500 }}>{range.label}</span>
                  <span style={{ color: theme.textSecondary }}>{range.count}</span>
                </div>
                <div style={{ height: '7px', background: theme.background, borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${(range.count / maxPriceRange) * 100}%`,
                    background: 'linear-gradient(90deg, #10b981, #34d399)',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;