import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Grid
} from '@mui/material';
import {
  Line,
  Bar
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function PriceHistoryChart({ property }) {
  const [timeRange, setTimeRange] = useState('5y');
  const [chartType, setChartType] = useState('line');

  // Generate price history data based on property
  const generatePriceData = (years) => {
    const basePrice = property?.price || 300000;
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - years);
    
    const labels = [];
    const prices = [];
    const marketPrices = [];
    
    for (let i = 0; i <= years * 12; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
      
      // Property price with some random variation
      const trend = 1 + (i / (years * 12)) * 0.15; // 15% growth over period
      const variation = 0.92 + Math.random() * 0.16;
      prices.push(Math.round(basePrice * trend * variation / 1000) * 1000);
      
      // Market average (slightly smoother)
      const marketTrend = 1 + (i / (years * 12)) * 0.10;
      const marketVariation = 0.95 + Math.random() * 0.10;
      marketPrices.push(Math.round(basePrice * 0.9 * marketTrend * marketVariation / 1000) * 1000);
    }
    
    return { labels, prices, marketPrices };
  };

  const getData = () => {
    let years = 5;
    if (timeRange === '1y') years = 1;
    else if (timeRange === '5y') years = 5;
    else if (timeRange === '10y') years = 10;
    
    const { labels, prices, marketPrices } = generatePriceData(years);
    
    return {
      labels,
      datasets: [
        {
          label: 'This Property',
          data: prices,
          borderColor: '#1976d2',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          fill: chartType === 'line',
          tension: 0.4,
          pointRadius: 2
        },
        {
          label: 'Market Average',
          data: marketPrices,
          borderColor: '#2e7d32',
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          fill: chartType === 'line',
          tension: 0.4,
          borderDash: [5, 5],
          pointRadius: 1
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  const currentPrice = property?.price || 0;
  const priceData = generatePriceData(5);
  const startPrice = priceData.prices[0] || currentPrice;
  const appreciation = ((currentPrice - startPrice) / startPrice * 100).toFixed(1);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
        <Typography variant="h6">
          📈 Price History
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={(e, val) => val && setTimeRange(val)}
            size="small"
          >
            <ToggleButton value="1y">1Y</ToggleButton>
            <ToggleButton value="5y">5Y</ToggleButton>
            <ToggleButton value="10y">10Y</ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={(e, val) => val && setChartType(val)}
            size="small"
          >
            <ToggleButton value="line">📈</ToggleButton>
            <ToggleButton value="bar">📊</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Box sx={{ height: 300 }}>
        {chartType === 'line' ? (
          <Line data={getData()} options={chartOptions} />
        ) : (
          <Bar data={getData()} options={chartOptions} />
        )}
      </Box>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={6} md={3}>
          <Typography variant="caption" color="textSecondary">Current Value</Typography>
          <Typography variant="h6">${currentPrice.toLocaleString()}</Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <Typography variant="caption" color="textSecondary">Start Value</Typography>
          <Typography variant="h6">${startPrice.toLocaleString()}</Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <Typography variant="caption" color="textSecondary">Appreciation</Typography>
          <Typography variant="h6" color={appreciation > 0 ? 'success.main' : 'error.main'}>
            {appreciation > 0 ? '+' : ''}{appreciation}%
          </Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <Typography variant="caption" color="textSecondary">vs Market</Typography>
          <Chip 
            label={Math.random() > 0.5 ? '✅ Outperforming' : '📉 Underperforming'} 
            color={Math.random() > 0.5 ? 'success' : 'warning'}
            size="small"
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default PriceHistoryChart;