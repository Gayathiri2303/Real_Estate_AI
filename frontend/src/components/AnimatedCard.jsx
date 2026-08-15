import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@mui/material';

const AnimatedCard = ({ children, delay = 0, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
    >
      <Card elevation={2} {...props}>
        {children}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;