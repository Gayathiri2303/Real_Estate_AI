import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Slider,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert
} from '@mui/material';
import { useTheme } from '../context/ThemeContext';

function MortgageCalculator({ property }) {
  const { theme } = useTheme();
  const [homePrice, setHomePrice] = useState(property?.price || 300000);
  const [downPayment, setDownPayment] = useState(20);
  const [interestRate, setInterestRate] = useState(6.8);
  const [loanTerm, setLoanTerm] = useState(30);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  useEffect(() => {
    calculateMortgage();
  }, [homePrice, downPayment, interestRate, loanTerm]);

  const calculateMortgage = () => {
    const principal = homePrice * (1 - downPayment / 100);
    const monthlyRate = interestRate / 100 / 12;
    const months = loanTerm * 12;
    
    if (principal <= 0 || monthlyRate === 0 || months === 0) {
      setMonthlyPayment(0);
      setTotalInterest(0);
      setTotalPayment(0);
      setAmortizationSchedule([]);
      return;
    }

    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    
    setMonthlyPayment(payment);

    const schedule = [];
    let balance = principal;
    let totalInterestPaid = 0;

    for (let i = 1; i <= Math.min(months, 60); i++) {
      const interest = balance * monthlyRate;
      const principalPayment = payment - interest;
      balance -= principalPayment;
      totalInterestPaid += interest;
      
      schedule.push({
        month: i,
        payment: payment,
        principal: principalPayment,
        interest: interest,
        balance: Math.max(balance, 0)
      });
    }

    setAmortizationSchedule(schedule);
    setTotalInterest(totalInterestPaid);
    setTotalPayment(payment * months);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const principal = homePrice * (1 - downPayment / 100);
  const loanToValue = (principal / homePrice * 100).toFixed(1);

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        bgcolor: theme.card, 
        color: theme.text,
        border: `1px solid ${theme.border}`
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: theme.text }}>
        💰 Mortgage Calculator
      </Typography>

      <Grid container spacing={3}>
        {/* Input Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: theme.textSecondary }}>
              Home Price
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={homePrice}
              onChange={(e) => setHomePrice(Number(e.target.value))}
              InputProps={{ startAdornment: '$' }}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: theme.background,
                  color: theme.text,
                  '& fieldset': { borderColor: theme.border },
                  '&:hover fieldset': { borderColor: theme.primary },
                },
                input: { color: theme.text }
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: theme.textSecondary }}>
              Down Payment: {downPayment}%
            </Typography>
            <Slider
              value={downPayment}
              onChange={(e, val) => setDownPayment(val)}
              min={3}
              max={50}
              step={1}
              marks={[
                { value: 3, label: '3%' },
                { value: 20, label: '20%' },
                { value: 50, label: '50%' }
              ]}
              sx={{
                color: theme.primary,
                '& .MuiSlider-markLabel': { color: theme.textSecondary }
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: theme.textSecondary }}>
              Interest Rate: {interestRate}%
            </Typography>
            <Slider
              value={interestRate}
              onChange={(e, val) => setInterestRate(val)}
              min={1}
              max={12}
              step={0.1}
              marks={[
                { value: 1, label: '1%' },
                { value: 6.8, label: '6.8%' },
                { value: 12, label: '12%' }
              ]}
              sx={{
                color: theme.primary,
                '& .MuiSlider-markLabel': { color: theme.textSecondary }
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: theme.textSecondary }}>
              Loan Term: {loanTerm} years
            </Typography>
            <Slider
              value={loanTerm}
              onChange={(e, val) => setLoanTerm(val)}
              min={10}
              max={30}
              step={5}
              marks={[
                { value: 10, label: '10y' },
                { value: 20, label: '20y' },
                { value: 30, label: '30y' }
              ]}
              sx={{
                color: theme.primary,
                '& .MuiSlider-markLabel': { color: theme.textSecondary }
              }}
            />
          </Box>
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ p: 2, bgcolor: theme.background, borderColor: theme.border }}>
            <Typography variant="caption" sx={{ color: theme.textSecondary }}>
              Monthly Payment
            </Typography>
            <Typography variant="h4" sx={{ color: theme.primary }}>
              {formatCurrency(monthlyPayment)}
            </Typography>
          </Card>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Card variant="outlined" sx={{ p: 2, bgcolor: theme.background, borderColor: theme.border }}>
                <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                  Total Payment
                </Typography>
                <Typography variant="h6" sx={{ color: theme.text }}>
                  {formatCurrency(totalPayment)}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card variant="outlined" sx={{ p: 2, bgcolor: theme.background, borderColor: theme.border }}>
                <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                  Total Interest
                </Typography>
                <Typography variant="h6" sx={{ color: '#ef4444' }}>
                  {formatCurrency(totalInterest)}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card variant="outlined" sx={{ p: 2, bgcolor: theme.background, borderColor: theme.border }}>
                <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                  Loan Amount
                </Typography>
                <Typography variant="h6" sx={{ color: theme.text }}>
                  {formatCurrency(principal)}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card variant="outlined" sx={{ p: 2, bgcolor: theme.background, borderColor: theme.border }}>
                <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                  LTV Ratio
                </Typography>
                <Typography variant="h6" sx={{ color: theme.text }}>
                  {loanToValue}%
                </Typography>
              </Card>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 2, bgcolor: theme.background, color: theme.text }}>
            <Typography variant="caption">
              This is an estimate. Actual rates may vary.
            </Typography>
          </Alert>
        </Grid>

        {/* Amortization Schedule Preview */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2, borderColor: theme.border }} />
          <Typography variant="subtitle2" gutterBottom sx={{ color: theme.text }}>
            First 5 Years Amortization Schedule
          </Typography>
          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.primary }}>
                  <TableCell sx={{ color: 'white' }}>Month</TableCell>
                  <TableCell sx={{ color: 'white' }} align="right">Payment</TableCell>
                  <TableCell sx={{ color: 'white' }} align="right">Principal</TableCell>
                  <TableCell sx={{ color: 'white' }} align="right">Interest</TableCell>
                  <TableCell sx={{ color: 'white' }} align="right">Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {amortizationSchedule.map((row) => (
                  <TableRow key={row.month} hover>
                    <TableCell sx={{ color: theme.text }}>{row.month}</TableCell>
                    <TableCell align="right" sx={{ color: theme.text }}>{formatCurrency(row.payment)}</TableCell>
                    <TableCell align="right" sx={{ color: theme.text }}>{formatCurrency(row.principal)}</TableCell>
                    <TableCell align="right" sx={{ color: theme.text }}>{formatCurrency(row.interest)}</TableCell>
                    <TableCell align="right" sx={{ color: theme.text }}>{formatCurrency(row.balance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default MortgageCalculator;