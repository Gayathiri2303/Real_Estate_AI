import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Fix for default markers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map center updates
function MapController({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.setView([center.lat, center.lng], zoom || 10);
    }
  }, [center, zoom, map]);
  
  return null;
}

function PropertyMapLeaflet({ properties, center, zoom }) {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const navigate = useNavigate();

  // Default center (USA)
  const defaultCenter = [39.8283, -98.5795];
  
  // Use provided center or default
  const mapCenter = (center && center.lat) ? [center.lat, center.lng] : defaultCenter;
  const mapZoom = zoom || 4;

  const handlePropertyClick = (property) => {
    navigate(`/property/${property.id}`);
  };

  return (
    <Box sx={{ height: '100%', width: '100%', minHeight: '300px' }}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%', minHeight: '300px' }}
        zoomControl={true}
      >
        <MapController center={center} zoom={zoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.lat || 0, property.lng || 0]}
            eventHandlers={{
              click: () => handlePropertyClick(property)
            }}
          />
        ))}

        {selectedProperty && (
          <Popup
            position={[selectedProperty.lat || 0, selectedProperty.lng || 0]}
            onClose={() => setSelectedProperty(null)}
          >
            <Paper sx={{ p: 1, minWidth: 180 }}>
              <Typography variant="subtitle1" fontWeight="bold" fontSize="0.9rem">
                {selectedProperty.address || 'Unknown'}
              </Typography>
              <Typography variant="body2" color="textSecondary" fontSize="0.8rem">
                {selectedProperty.city}, {selectedProperty.state}
              </Typography>
              <Typography variant="h6" color="primary" fontSize="1rem">
                ${selectedProperty.price?.toLocaleString()}
              </Typography>
              <Typography variant="body2" fontSize="0.8rem">
                {selectedProperty.bedrooms} beds · {selectedProperty.bathrooms} baths · {selectedProperty.sqft} sqft
              </Typography>
              <Button 
                size="small" 
                variant="contained" 
                sx={{ mt: 1, fontSize: '0.7rem' }}
                onClick={() => handlePropertyClick(selectedProperty)}
              >
                View Details
              </Button>
            </Paper>
          </Popup>
        )}
      </MapContainer>
    </Box>
  );
}

export default PropertyMapLeaflet;