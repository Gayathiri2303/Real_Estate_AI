import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import VoiceSearch from '../components/VoiceSearch';

const API_URL = 'https://realestate.gayathiriportfolio.xyz/api';

function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme } = useTheme();

  // Read filters from URL (important for Voice Search)
  useEffect(() => {
    const city = searchParams.get('city') || '';
    const state = searchParams.get('state') || '';
    const min_p = searchParams.get('min_price') || '';
    const max_p = searchParams.get('max_price') || '';
    const beds = searchParams.get('bedrooms') || '';
    const baths = searchParams.get('bathrooms') || '';

    setCityFilter(city);
    setStateFilter(state);
    setMinPrice(min_p);
    setMaxPrice(max_p);
    setBedrooms(beds);
    setBathrooms(baths);
  }, [searchParams]);

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [properties, search, cityFilter, stateFilter, minPrice, maxPrice, bedrooms, bathrooms]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/properties`);
      setProperties(res.data.properties || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...properties];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.address?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q) ||
        p.state?.toLowerCase().includes(q)
      );
    }

    if (cityFilter) {
      result = result.filter(p => p.city?.toLowerCase() === cityFilter.toLowerCase());
    }

    if (stateFilter) {
      result = result.filter(p => 
        p.state?.toLowerCase() === stateFilter.toLowerCase() ||
        p.state?.toUpperCase() === stateFilter.toUpperCase()
      );
    }

    if (minPrice) {
      result = result.filter(p => p.price >= parseInt(minPrice));
    }

    if (maxPrice) {
      result = result.filter(p => p.price <= parseInt(maxPrice));
    }

    if (bedrooms) {
      result = result.filter(p => p.bedrooms >= parseInt(bedrooms));
    }

    if (bathrooms) {
      result = result.filter(p => p.bathrooms >= parseFloat(bathrooms));
    }

    setFiltered(result);
  };

  const clearFilters = () => {
    setSearch('');
    setCityFilter('');
    setStateFilter('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setBathrooms('');
    setSearchParams({});
  };

  const cities = [...new Set(properties.map(p => p.city).filter(Boolean))].sort();
  const states = [...new Set(properties.map(p => p.state).filter(Boolean))].sort();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh', 
        background: theme.background 
      }}>
        <p style={{ color: theme.textSecondary }}>Loading properties...</p>
      </div>
    );
  }

  return (
    <div style={{ background: theme.background, minHeight: '100vh', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ 
          marginBottom: '28px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '12px' 
        }}>
          <div>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: 800, 
              color: theme.text, 
              margin: '0 0 6px' 
            }}>
              🏠 Properties
            </h1>
            <p style={{ color: theme.textSecondary, margin: 0 }}>
              {filtered.length} properties found
            </p>
          </div>
          <VoiceSearch />
        </div>

        {/* Filters */}
        <div style={{
          background: theme.card,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '28px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '14px',
          border: `1px solid ${theme.border}`,
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="Search address, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '12px 14px',
              border: `1px solid ${theme.border}`,
              borderRadius: '10px',
              fontSize: '14px',
              outline: 'none',
              background: theme.background,
              color: theme.text
            }}
          />

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            style={{
              padding: '12px 14px',
              border: `1px solid ${theme.border}`,
              borderRadius: '10px',
              fontSize: '14px',
              outline: 'none',
              background: theme.background,
              color: theme.text
            }}
          >
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            style={{
              padding: '12px 14px',
              border: `1px solid ${theme.border}`,
              borderRadius: '10px',
              fontSize: '14px',
              outline: 'none',
              background: theme.background,
              color: theme.text
            }}
          >
            <option value="">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{
              padding: '12px 14px',
              border: `1px solid ${theme.border}`,
              borderRadius: '10px',
              fontSize: '14px',
              outline: 'none',
              background: theme.background,
              color: theme.text
            }}
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{
              padding: '12px 14px',
              border: `1px solid ${theme.border}`,
              borderRadius: '10px',
              fontSize: '14px',
              outline: 'none',
              background: theme.background,
              color: theme.text
            }}
          />

          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            style={{
              padding: '12px 14px',
              border: `1px solid ${theme.border}`,
              borderRadius: '10px',
              fontSize: '14px',
              outline: 'none',
              background: theme.background,
              color: theme.text
            }}
          >
            <option value="">Any Beds</option>
            <option value="1">1+ Beds</option>
            <option value="2">2+ Beds</option>
            <option value="3">3+ Beds</option>
            <option value="4">4+ Beds</option>
            <option value="5">5+ Beds</option>
          </select>

          <select
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
            style={{
              padding: '12px 14px',
              border: `1px solid ${theme.border}`,
              borderRadius: '10px',
              fontSize: '14px',
              outline: 'none',
              background: theme.background,
              color: theme.text
            }}
          >
            <option value="">Any Baths</option>
            <option value="1">1+ Baths</option>
            <option value="2">2+ Baths</option>
            <option value="3">3+ Baths</option>
            <option value="4">4+ Baths</option>
          </select>

          {/* Clear Filters Button */}
          <button
            onClick={clearFilters}
            style={{
              padding: '12px 16px',
              background: theme.danger || '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Clear Filters
          </button>
        </div>

        {/* Property Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '22px'
        }}>
          {filtered.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/property/${p.id}`)}
              className="hover-card"
              style={{
                background: theme.card,
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                border: `1px solid ${theme.border}`,
                transition: 'all 0.25s ease'
              }}
            >
              <div style={{
                height: '160px',
                background: `linear-gradient(135deg, ${theme.primary}22, ${theme.secondary}33)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                position: 'relative'
              }}>
                🏡
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '14px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                  ${p.price?.toLocaleString()}
                </div>
              </div>

              <div style={{ padding: '18px' }}>
                <div style={{ 
                  fontWeight: 700, 
                  fontSize: '16px', 
                  color: theme.text, 
                  marginBottom: '4px' 
                }}>
                  {p.address}
                </div>
                <div style={{ 
                  fontSize: '13px', 
                  color: theme.textSecondary, 
                  marginBottom: '12px' 
                }}>
                  📍 {p.city}, {p.state}
                </div>
                <div style={{
                  display: 'flex',
                  gap: '14px',
                  fontSize: '13px',
                  color: theme.textSecondary,
                  fontWeight: 500
                }}>
                  <span>🛏 {p.bedrooms}</span>
                  <span>🛁 {p.bathrooms}</span>
                  <span>📐 {p.sqft} sqft</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            color: theme.textSecondary 
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
            <p>No properties match your filters</p>
            <button
              onClick={clearFilters}
              style={{
                marginTop: '16px',
                padding: '10px 24px',
                background: theme.primary,
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertiesPage;