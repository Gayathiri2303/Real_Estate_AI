import React from 'react';
import { Box, Skeleton, Grid } from '@mui/material';

const LoadingSkeleton = () => {
  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Grid xs={12} sm={6} md={4} key={item}>
            <Box sx={{ p: 1 }}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              <Skeleton variant="text" height={30} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LoadingSkeleton;