import React, { useState, useRef } from 'react';
import {
  Paper, Typography, Box, Button, CircularProgress, Alert,
  Grid, Chip, LinearProgress, IconButton, Collapse
} from '@mui/material';
import {
  CloudUpload, Delete, ExpandMore, ExpandLess,
  PhotoLibrary, Clear
} from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

const API_URL = 'https://realestate.gayathiriportfolio.xyz/api';

function ImageUpload({ propertyId, onUploadSuccess }) {
  const { theme } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const fileInputRef = useRef(null);

  if (!propertyId) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: theme.card, color: theme.text }}>
        <Alert severity="warning">
          Property ID is missing. Cannot upload images.
        </Alert>
      </Paper>
    );
  }

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const validFiles = [];
    const invalidFiles = [];

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name} (too large)`);
        return;
      }
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        invalidFiles.push(`${file.name} (invalid format)`);
        return;
      }
      validFiles.push(file);
    });

    if (invalidFiles.length > 0) {
      toast.error(`Skipped: ${invalidFiles.join(', ')}`);
    }
    if (validFiles.length === 0) return;

    setSelectedFiles(prev => [...prev, ...validFiles]);
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);

    handleUpload(validFiles);
  };

  const handleUpload = async (files) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('property_id', String(propertyId));

      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await axios.post(`${API_URL}/upload-images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadedImages(prev => [...prev, ...(response.data.images || [])]);
      toast.success(`Successfully uploaded ${response.data.images?.length || files.length} image(s)!`);

      setSelectedFiles([]);
      setPreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = '';

      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error('Upload error:', err);
      const msg = err.response?.data?.detail || err.message || 'Failed to upload images';
      setError(msg);
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const clearAllFiles = () => {
    previews.forEach(url => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviews([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
          <PhotoLibrary sx={{ color: theme.primary }} />
          Upload Images
          <Chip
            label={`Property #${propertyId}`}
            size="small"
            sx={{ 
              ml: 1, 
              borderColor: theme.primary, 
              color: theme.primary,
              bgcolor: 'transparent'
            }}
            variant="outlined"
          />
        </Typography>
        <IconButton onClick={() => setExpanded(!expanded)} sx={{ color: theme.text }}>
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Typography variant="body2" sx={{ mb: 2, color: theme.textSecondary }}>
        Upload images for this property
      </Typography>

      <Collapse in={expanded}>
        <Box
          onDrop={(e) => {
            e.preventDefault();
            handleFileSelect({ target: { files: e.dataTransfer.files } });
          }}
          onDragOver={(e) => e.preventDefault()}
          sx={{
            border: `2px dashed ${theme.border}`,
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            bgcolor: theme.background,
            minHeight: 150,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {previews.length > 0 ? (
            <Box sx={{ width: '100%' }}>
              <Grid container spacing={1} sx={{ mb: 2 }}>
                {previews.map((preview, index) => (
                  <Grid item xs={3} sm={2} key={index}>
                    <Box sx={{ position: 'relative' }}>
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 4 }}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute', top: -8, right: -8,
                          bgcolor: 'rgba(0,0,0,0.7)', color: 'white',
                          width: 20, height: 20
                        }}
                        onClick={() => removeFile(index)}
                        size="small"
                      >
                        <Clear fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={clearAllFiles} 
                  startIcon={<Delete />} 
                  color="error"
                >
                  Clear All
                </Button>
                <Button 
                  variant="contained" 
                  size="small" 
                  onClick={() => fileInputRef.current?.click()} 
                  startIcon={<CloudUpload />}
                  sx={{ bgcolor: theme.primary }}
                >
                  Add More
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              <CloudUpload sx={{ fontSize: 48, color: theme.textSecondary, mb: 1 }} />
              <Typography variant="body1" sx={{ color: theme.text }}>
                Click or drag to upload images
              </Typography>
              <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                JPG, PNG, WebP (Max 5MB each)
              </Typography>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            multiple
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
            disabled={uploading}
          />
        </Box>

        {uploading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress />
            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: theme.textSecondary }}>
              Uploading images...
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {uploadedImages.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ color: theme.textSecondary }} gutterBottom>
              Recently Uploaded ({uploadedImages.length})
            </Typography>
            <Grid container spacing={1}>
              {uploadedImages.slice(-6).map((img, index) => (
                <Grid item xs={4} sm={2} key={index}>
                  <img
                    src={img.url?.startsWith('http') ? img.url : `${API_URL}${img.url}`}
                    alt={img.filename || 'uploaded'}
                    style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 4 }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Collapse>
    </Paper>
  );
}

export default ImageUpload;