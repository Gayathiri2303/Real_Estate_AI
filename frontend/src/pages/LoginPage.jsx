import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

const API_URL = 'https://realestate.gayathiriportfolio.xyz/api';

function LoginPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [mode, setMode] = useState('user'); // 'user' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Admin shortcut
      if (mode === 'admin') {
        if (email !== 'admin@gmail.com') {
          toast.error('Only admin@gmail.com is allowed for Admin login');
          setLoading(false);
          return;
        }
      }

      const response = await axios.post(`${API_URL}/login`, { email, password });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      toast.success(`Welcome ${response.data.user.name || 'back'}!`);
      
      if (response.data.user.email === 'admin@gmail.com') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid email or password';
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
      background: `linear-gradient(135deg, ${theme.primary}15 0%, ${theme.secondary}20 50%, ${theme.background} 100%)`,
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
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
          padding: '32px 28px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ fontSize: '42px', marginBottom: '8px' }}>🏠</div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 700 }}>RealEstate AI</h1>
          <p style={{ margin: '6px 0 0', opacity: 0.9, fontSize: '14px' }}>
            Sign in to continue
          </p>
        </div>

        {/* Mode Switch */}
        <div style={{ display: 'flex', padding: '20px 20px 0' }}>
          <button
            onClick={() => { setMode('user'); setEmail(''); }}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '10px 0 0 10px',
              background: mode === 'user' ? theme.primary : theme.background,
              color: mode === 'user' ? 'white' : theme.textSecondary,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            👤 User Login
          </button>
          <button
            onClick={() => { setMode('admin'); setEmail('admin@gmail.com'); }}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '0 10px 10px 0',
              background: mode === 'admin' ? theme.primary : theme.background,
              color: mode === 'admin' ? 'white' : theme.textSecondary,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            👑 Admin Login
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ padding: '24px 28px 32px' }}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: theme.textSecondary }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={mode === 'admin'}
              placeholder={mode === 'admin' ? 'admin@gmail.com' : 'you@example.com'}
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
              opacity: loading ? 0.7 : 1,
              boxShadow: `0 4px 14px ${theme.primary}40`
            }}
          >
            {loading ? 'Signing in...' : (mode === 'admin' ? 'Login as Admin' : 'Login')}
          </button>

          {mode === 'user' && (
            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: theme.textSecondary }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: theme.primary, fontWeight: 600, textDecoration: 'none' }}>
                Sign up
              </Link>
            </p>
          )}

          {mode === 'admin' && (
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: theme.textSecondary }}>
              Admin access is restricted to admin@gmail.com only
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;