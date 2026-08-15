import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

const API_URL = 'https://realestate.gayathiriportfolio.xyz/api';

function RegisterPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (email.toLowerCase() === 'admin@gmail.com') {
      toast.error('This email is reserved for admin');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/register`, { name, email, password });
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${theme.primary}15 0%, ${theme.secondary}20 100%)`,
      padding: '20px'
    }}>
      <div style={{
        background: theme.card,
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
        width: '100%',
        maxWidth: '440px',
        overflow: 'hidden',
        border: `1px solid ${theme.border}`
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
          padding: '32px 28px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ fontSize: '42px', marginBottom: '8px' }}>✨</div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 700 }}>Create Account</h1>
          <p style={{ margin: '6px 0 0', opacity: 0.9, fontSize: '14px' }}>
            Join RealEstate AI today
          </p>
        </div>

        <form onSubmit={handleRegister} style={{ padding: '28px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: theme.textSecondary }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Doe"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: `1px solid ${theme.border}`,
                background: theme.background,
                color: theme.text,
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: theme.textSecondary }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: `1px solid ${theme.border}`,
                background: theme.background,
                color: theme.text,
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: theme.textSecondary }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: `1px solid ${theme.border}`,
                background: theme.background,
                color: theme.text,
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: theme.textSecondary }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: theme.primary, fontWeight: 600, textDecoration: 'none' }}>
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;