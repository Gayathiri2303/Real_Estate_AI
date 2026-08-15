import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

import MortgageCalculator from '../components/MortgageCalculator';
import VisionUpload from '../components/VisionUpload';
import ImageUpload from '../components/ImageUpload';
import PropertyMapLeaflet from '../components/PropertyMapLeaflet';

const API_URL = 'https://realestate.gayathiriportfolio.xyz/api';

function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [propertyImages, setPropertyImages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Slideshow
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);
  const [slideshowInterval, setSlideshowInterval] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // ============ LOAD FAVORITES ============
  const loadFavorites = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const favKey = `favorites_${user.id || user.email || 'guest'}`;
    const saved = localStorage.getItem(favKey);
    if (saved) {
      const favorites = JSON.parse(saved);
      setIsFavorite(favorites.includes(parseInt(id)));
    }
  };

  // ============ LOAD PROPERTY IMAGES ============
  const loadPropertyImages = async () => {
    try {
      const response = await axios.get(`${API_URL}/property-images/${id}`);
      const images = response.data.images || response.data || [];
      setPropertyImages(images);
    } catch (error) {
      console.error('Failed to load property images:', error);
      setPropertyImages([]);
    }
  };

  // ============ REFRESH IMAGES ============
  const refreshImages = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(`${API_URL}/property-images/${id}`);
      setPropertyImages(response.data.images || []);
      if (response.data.images?.length > 0) {
        toast.success(`${response.data.images.length} image(s) loaded`);
      }
    } catch (error) {
      console.error('Failed to refresh images:', error);
      toast.error('Failed to refresh images');
    } finally {
      setRefreshing(false);
    }
  };

  // ============ LOAD PROPERTY DETAILS ============
  const loadProperty = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/properties/${id}`);
      setProperty(response.data);

      const allRes = await axios.get(`${API_URL}/properties`);
      const allProperties = allRes.data.properties || [];
      const similar = allProperties
        .filter(p => p.id !== parseInt(id) && (p.city === response.data.city || p.state === response.data.state))
        .slice(0, 4);
      setSimilarProperties(similar);

      loadFavorites();
    } catch (err) {
      console.error('Failed to load property:', err);
      setError('Failed to load property details');
      toast.error('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  // ============ TOGGLE FAVORITE ============
  const toggleFavorite = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const favKey = `favorites_${user.id || user.email || 'guest'}`;

    const saved = localStorage.getItem(favKey);
    let favorites = saved ? JSON.parse(saved) : [];
    const propId = parseInt(id);

    if (favorites.includes(propId)) {
      favorites = favorites.filter(f => f !== propId);
      setIsFavorite(false);
      toast.success('Removed from favorites');
    } else {
      favorites.push(propId);
      setIsFavorite(true);
      toast.success('Added to favorites');
    }
    localStorage.setItem(favKey, JSON.stringify(favorites));
  };

  // ============ SHARE ============
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  // ============ SLIDESHOW ============
  const nextImage = () => {
    if (propertyImages.length === 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(prev => (prev + 1) % propertyImages.length);
      setIsTransitioning(false);
    }, 300);
  };

  const prevImage = () => {
    if (propertyImages.length === 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(prev => (prev - 1 + propertyImages.length) % propertyImages.length);
      setIsTransitioning(false);
    }, 300);
  };

  const toggleSlideshow = () => {
    if (isSlideshowActive) {
      clearInterval(slideshowInterval);
      setSlideshowInterval(null);
      setIsSlideshowActive(false);
      toast.info('Slideshow paused');
    } else {
      if (propertyImages.length > 1) {
        const interval = setInterval(nextImage, 3000);
        setSlideshowInterval(interval);
        setIsSlideshowActive(true);
        toast.info('Slideshow started');
      } else {
        toast.error('Need at least 2 images for slideshow');
      }
    }
  };

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape') {
        setIsFullscreen(false);
        if (isSlideshowActive) {
          clearInterval(slideshowInterval);
          setSlideshowInterval(null);
          setIsSlideshowActive(false);
        }
      }
      if (e.key === ' ') {
        e.preventDefault();
        toggleSlideshow();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [propertyImages.length, isSlideshowActive]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (slideshowInterval) clearInterval(slideshowInterval);
    };
  }, [slideshowInterval]);

  // Load data
  useEffect(() => {
    loadProperty();
    loadFavorites();
    loadPropertyImages();
  }, [id]);

  // ============ LOADING ============
  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: theme.background, minHeight: '60vh', color: theme.text }}>
        <h2 style={{ color: theme.text }}>Loading Property Details...</h2>
        <div style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: `4px solid ${theme.border}`,
          borderTop: `4px solid ${theme.primary}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginTop: '20px'
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ============ ERROR ============
  if (error || !property) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: theme.background, minHeight: '60vh' }}>
        <h2 style={{ color: theme.danger || '#c62828' }}>Error</h2>
        <p style={{ color: theme.text }}>{error || 'Property not found'}</p>
        <button
          onClick={() => navigate('/properties')}
          style={{
            marginTop: '16px',
            padding: '10px 24px',
            backgroundColor: theme.primary,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Back to Properties
        </button>
      </div>
    );
  }

  // ============ MAIN RENDER ============
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', background: theme.background, minHeight: '100vh' }}>

      {/* Back Button */}
      <button
        onClick={() => navigate('/properties')}
        style={{
          padding: '8px 16px',
          marginBottom: '20px',
          backgroundColor: theme.card,
          color: theme.text,
          border: `1px solid ${theme.border}`,
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        ← Back to Properties
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* LEFT COLUMN */}
        <div>
          <div style={{
            backgroundColor: theme.card,
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: `1px solid ${theme.border}`
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ margin: '0 0 4px 0', color: theme.text }}>{property.address || 'Unknown Address'}</h2>
                <p style={{ margin: 0, color: theme.textSecondary }}>
                  📍 {property.city}, {property.state}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={toggleFavorite} style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer' }}>
                  {isFavorite ? '❤️' : '🤍'}
                </button>
                <button onClick={handleShare} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>
                  📤
                </button>
              </div>
            </div>

            <hr style={{ margin: '16px 0', border: 'none', borderTop: `1px solid ${theme.border}` }} />

            {/* Price */}
            <h1 style={{ color: theme.primary, margin: '0 0 16px 0' }}>
              ${property.price?.toLocaleString()}
            </h1>

            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              marginBottom: '16px'
            }}>
              {[
                { icon: '🛏', value: property.bedrooms || 0, label: 'Bedrooms' },
                { icon: '🛁', value: property.bathrooms || 0, label: 'Bathrooms' },
                { icon: '📐', value: property.sqft || 0, label: 'Sqft' },
                { icon: '📅', value: property.year_built || 'N/A', label: 'Year Built' },
              ].map((item, i) => (
                <div key={i} style={{ 
                  textAlign: 'center', 
                  padding: '12px', 
                  border: `1px solid ${theme.border}`, 
                  borderRadius: '8px',
                  background: theme.background
                }}>
                  <div style={{ fontSize: '24px' }}>{item.icon}</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: theme.text }}>{item.value}</div>
                  <div style={{ fontSize: '12px', color: theme.textSecondary }}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* Details */}
            <h3 style={{ color: theme.text }}>Property Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <div style={{ fontSize: '12px', color: theme.textSecondary }}>Lot Size</div>
                <div style={{ color: theme.text }}>{property.sqft_lot || 'N/A'} sqft</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: theme.textSecondary }}>Floors</div>
                <div style={{ color: theme.text }}>{property.floors || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: theme.textSecondary }}>Condition</div>
                <div style={{ color: theme.text }}>{property.condition || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: theme.textSecondary }}>View Score</div>
                <div style={{ color: theme.text }}>{property.view || 0}</div>
              </div>
            </div>

            <p style={{ marginTop: '16px', color: theme.textSecondary, lineHeight: 1.6 }}>
              {property.description}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN - Map */}
        <div style={{
          backgroundColor: theme.card,
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          height: '450px',
          border: `1px solid ${theme.border}`
        }}>
          <h3 style={{ marginTop: 0, color: theme.text }}>📍 Location</h3>
          {property.lat && property.lng ? (
            <div style={{ height: 'calc(100% - 40px)', borderRadius: '8px', overflow: 'hidden' }}>
              <PropertyMapLeaflet
                properties={[property]}
                center={{ lat: property.lat, lng: property.lng }}
                zoom={14}
              />
            </div>
          ) : (
            <p style={{ color: theme.textSecondary }}>Location coordinates not available</p>
          )}
        </div>
      </div>

      {/* Image Gallery */}
      {propertyImages.length > 0 && (
        <div style={{
          marginTop: '24px',
          backgroundColor: theme.card,
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: `1px solid ${theme.border}`
        }}>
          <h3 style={{ color: theme.text }}>Property Images ({propertyImages.length})</h3>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
            {propertyImages.map((img, index) => (
              <img
                key={index}
                src={img.url?.startsWith('http') ? img.url : `${API_URL}${img.url}`}
                alt={`Property ${index + 1}`}
                onClick={() => { setCurrentImageIndex(index); setIsFullscreen(true); }}
                style={{
                  width: '160px',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: currentImageIndex === index ? `3px solid ${theme.primary}` : `1px solid ${theme.border}`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Image Upload + Vision Analysis */}
      <div style={{ marginTop: '24px' }}>
        <ImageUpload
          propertyId={parseInt(id)}
          onUploadSuccess={refreshImages}
        />
      </div>

      <div style={{ marginTop: '24px' }}>
        <VisionUpload
          propertyId={parseInt(id)}
          onUploadSuccess={refreshImages}
        />
      </div>

      {/* Mortgage Calculator */}
      <div style={{ marginTop: '24px' }}>
        <MortgageCalculator property={property} price={property.price} />
      </div>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <div style={{
          marginTop: '24px',
          backgroundColor: theme.card,
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: `1px solid ${theme.border}`
        }}>
          <h3 style={{ color: theme.text }}>🏠 Similar Properties ({similarProperties.length})</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '16px'
          }}>
            {similarProperties.map((prop) => (
              <div
                key={prop.id}
                onClick={() => navigate(`/property/${prop.id}`)}
                style={{
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                  background: theme.background
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ fontWeight: 600, color: theme.primary }}>
                  ${prop.price?.toLocaleString()}
                </div>
                <div style={{ fontSize: '14px', color: theme.text }}>{prop.address}</div>
                <div style={{ fontSize: '13px', color: theme.textSecondary }}>
                  {prop.city}, {prop.state}
                </div>
                <div style={{ fontSize: '13px', marginTop: '6px', color: theme.textSecondary }}>
                  {prop.bedrooms} bed • {prop.bathrooms} bath • {prop.sqft} sqft
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Image Viewer */}
      {isFullscreen && propertyImages.length > 0 && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.95)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <button
            onClick={toggleFullscreen}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>

          <img
            src={propertyImages[currentImageIndex]?.url?.startsWith('http') 
              ? propertyImages[currentImageIndex].url 
              : `${API_URL}${propertyImages[currentImageIndex]?.url}`}
            alt="Fullscreen"
            style={{ maxWidth: '95%', maxHeight: '95%', objectFit: 'contain' }}
          />
        </div>
      )}
    </div>
  );
}

export default PropertyDetailsPage;