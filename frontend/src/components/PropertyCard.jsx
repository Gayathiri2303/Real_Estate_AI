import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const PropertyCard = ({ property, index, favorites, toggleFavorite }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 8,
          }
        }}
        onClick={() => navigate(`/property/${property.id}`)}
      >
        <Box
          sx={{
            height: 200,
            background: `linear-gradient(135deg, ${['#1976d2', '#42a5f5', '#64b5f6', '#90caf9'][index % 4]}, ${['#1565c0', '#1e88e5', '#42a5f5', '#64b5f6'][index % 4]})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <Typography variant="h1" sx={{ fontSize: 64, opacity: 0.3, color: 'white' }}>
            🏠
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              cursor: 'pointer'
            }}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(property.id);
            }}
          >
            {favorites.includes(property.id) ? (
              <FavoriteIcon sx={{ color: '#e53935' }} />
            ) : (
              <FavoriteBorderIcon sx={{ color: 'white' }} />
            )}
          </Box>
          <Chip
            label={`$${property.price?.toLocaleString()}`}
            sx={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              bgcolor: 'rgba(0,0,0,0.6)',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" noWrap>
            {property.address}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {property.city}, {property.state}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            <Chip label={`${property.bedrooms} beds`} size="small" />
            <Chip label={`${property.bathrooms} baths`} size="small" />
            <Chip label={`${property.sqft} sqft`} size="small" />
          </Box>
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 2, width: '100%' }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/property/${property.id}`);
            }}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PropertyCard;