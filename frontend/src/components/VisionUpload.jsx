import React, { useState } from 'react';
import {
  Paper, Typography, Box, Button, CircularProgress, Alert,
  Grid, Card, CardContent, Chip, Divider, LinearProgress,
  IconButton, Collapse, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import {
  CloudUpload, CheckCircle, Info, ExpandMore, ExpandLess,
  Star, ThumbUp, Warning, Build, Lightbulb, Image as ImageIcon, Close
} from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

const API_URL = 'https://realestate.gayathiriportfolio.xyz/api';

function VisionUpload({ propertyId, onUploadSuccess }) {
  const { theme } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a JPG, PNG, or WebP image');
      return;
    }

    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    handleUpload(file);
  };

  const handleUpload = async (file) => {
    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('property_id', propertyId.toString());

      const response = await axios.post(`${API_URL}/vision/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResult(response.data);
      toast.success('✅ Image analyzed successfully!');
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to analyze image';
      setError(errorMessage);
      toast.error('❌ ' + errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    const fileInput = document.getElementById('vision-upload-input');
    if (fileInput) fileInput.value = '';
  };

  const getConditionColor = (condition) => {
    const colors = {
      'Excellent': '#4caf50',
      'Good': '#8bc34a',
      'Fair': '#ff9800',
      'Needs Renovation': '#f44336'
    };
    return colors[condition] || theme.textSecondary;
  };

  const getConditionIcon = (condition) => {
    const icons = {
      'Excellent': <ThumbUp sx={{ color: '#4caf50' }} />,
      'Good': <Star sx={{ color: '#8bc34a' }} />,
      'Fair': <Warning sx={{ color: '#ff9800' }} />,
      'Needs Renovation': <Build sx={{ color: '#f44336' }} />
    };
    return icons[condition] || <Info sx={{ color: theme.textSecondary }} />;
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 3, 
        bgcolor: theme.card, 
        color: theme.text,
        border: `1px solid ${theme.border}`
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.text }}>
          <ImageIcon sx={{ color: theme.primary }} />
          📸 AI Property Image Analysis
          <Chip 
            label={`Property #${propertyId}`} 
            size="small" 
            variant="outlined"
            sx={{ ml: 1, borderColor: theme.primary, color: theme.primary }}
          />
        </Typography>
        <IconButton onClick={() => setExpanded(!expanded)} sx={{ color: theme.text }}>
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Typography variant="body2" sx={{ mb: 2, color: theme.textSecondary }}>
        Upload a photo for AI-powered condition analysis
      </Typography>

      <Collapse in={expanded}>
        <Box
          sx={{
            border: `2px dashed ${theme.border}`,
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            bgcolor: theme.background,
            '&:hover': {
              borderColor: theme.primary,
            },
            position: 'relative'
          }}
        >
          {preview && (
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
              <img 
                src={preview} 
                alt="Preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '300px', 
                  borderRadius: '8px',
                  objectFit: 'contain'
                }} 
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' }
                }}
                onClick={clearFile}
                size="small"
              >
                <Close />
              </IconButton>
            </Box>
          )}

          {!preview && !uploading && (
            <>
              <CloudUpload sx={{ fontSize: 48, color: theme.textSecondary, mb: 1 }} />
              <Typography variant="body1" gutterBottom sx={{ color: theme.text }}>
                Click to upload a property photo
              </Typography>
              <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                Supports JPG, PNG, WebP (Max 5MB)
              </Typography>
            </>
          )}

          {uploading && (
            <Box sx={{ py: 3 }}>
              <CircularProgress size={40} sx={{ mb: 2, color: theme.primary }} />
              <Typography variant="body2" sx={{ color: theme.text }}>
                Analyzing image with AI...
              </Typography>
              <LinearProgress sx={{ mt: 2, maxWidth: 300, mx: 'auto' }} />
            </Box>
          )}

          <input
            id="vision-upload-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer',
            }}
            disabled={uploading}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {result && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 3, borderColor: theme.border }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%', bgcolor: theme.background, borderColor: theme.border }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ color: theme.textSecondary }} gutterBottom>
                      Property Condition
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      {getConditionIcon(result.analysis?.condition)}
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          color: getConditionColor(result.analysis?.condition),
                          fontWeight: 'bold'
                        }}
                      >
                        {result.analysis?.condition || 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Typography variant="subtitle2" sx={{ color: theme.textSecondary }} gutterBottom>
                      Quality Score
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={result.analysis?.quality_score || 0}
                          sx={{ 
                            height: 10, 
                            borderRadius: 5,
                            backgroundColor: theme.border,
                          }}
                        />
                      </Box>
                      <Typography variant="h6" sx={{ color: theme.text }}>
                        {result.analysis?.quality_score || 0}%
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mt: 2 }}>
                      <Chip 
                        label={`Estimated Repairs: ${result.analysis?.estimated_repairs || 'N/A'}`}
                        size="small"
                        color={result.analysis?.estimated_repairs === 'None' ? 'success' : 'warning'}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%', bgcolor: theme.background, borderColor: theme.border }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ color: theme.textSecondary }} gutterBottom>
                      Key Features Detected
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {result.analysis?.features?.map((feature, index) => (
                        <Chip
                          key={index}
                          label={feature}
                          size="small"
                          variant="outlined"
                          icon={<CheckCircle sx={{ fontSize: 16 }} />}
                          sx={{ borderColor: theme.border, color: theme.text }}
                        />
                      ))}
                    </Box>
                    
                    <Typography variant="subtitle2" sx={{ color: theme.textSecondary }} gutterBottom>
                      Recommendations
                    </Typography>
                    <List dense disablePadding>
                      {result.analysis?.recommendations?.map((rec, index) => (
                        <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <Lightbulb sx={{ fontSize: 18, color: '#ff9800' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={rec}
                            primaryTypographyProps={{ variant: 'body2', color: theme.text }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined" sx={{ bgcolor: theme.background, borderColor: theme.border }}>
                  <CardContent>
                    <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                      File: {result.filename} | 
                      Size: {result.image_size?.width}x{result.image_size?.height}px |
                      Format: {result.format} |
                      Analyzed: {new Date(result.timestamp).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Collapse>
    </Paper>
  );
}

export default VisionUpload;