
import React, { useState } from 'react';

function Signup({ onSignup, switchToLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    exchange: 'bybit',
    apiKey: '',
    apiSecret: '',
    strategy: 'steady_climb',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const exchanges = [
    { value: 'bybit', name: 'Bybit' },
    { value: 'binance', name: 'Binance' },
    { value: 'bitget', name: 'Bitget' }
  ];

  const strategies = [
    { value: 'steady_climb', name: 'Steady Climb - Conservative' },
    { value: 'power_surge', name: 'Power Surge - Aggressive' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.apiKey.trim()) {
      newErrors.apiKey = 'API Key is required';
    }

    if (!formData.apiSecret.trim()) {
      newErrors.apiSecret = 'API Secret is required';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://voltex-profits-backend.onrender.com';

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          exchange: formData.exchange,
          apiKey: formData.apiKey,
          apiSecret: formData.apiSecret,
          strategy: formData.strategy
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onSignup(data.user);
      } else {
        setErrors({ submit: data.message || 'Registration failed' });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      padding: '2rem',
      width: '100%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginBottom: '1rem'
    },
    logoIcon: {
      width: '40px',
      height: '40px',
      background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '1.25rem'
    },
    logoText: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#111827'
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#6b7280'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '0.875rem',
      outline: 'none'
    },
    select: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '0.875rem',
      outline: 'none',
      backgroundColor: 'white'
    },
    inputError: {
      borderColor: '#ef4444'
    },
    error: {
      fontSize: '0.75rem',
      color: '#ef4444',
      marginTop: '0.25rem'
    },
    checkbox: {
      display: 'flex',
      alignItems: 'start',
      gap: '0.75rem'
    },
    checkboxInput: {
      marginTop: '0.25rem'
    },
    button: {
      width: '100%',
      background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '0.75rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    footer: {
      textAlign: 'center',
      marginTop: '1.5rem'
    },
    link: {
      color: '#3b82f6',
      textDecoration: 'none',
      fontWeight: '500',
      cursor: 'pointer'
    },
    benefits: {
      backgroundColor: '#f0fdf4',
      padding: '1rem',
      borderRadius: '8px',
      marginTop: '1rem'
    },
    benefitTitle: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#166534',
      marginBottom: '0.5rem'
    },
    benefitList: {
      fontSize: '0.75rem',
      color: '#15803d',
      lineHeight: '1.4'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>V</div>
            <span style={styles.logoText}>Voltex Profits</span>
          </div>
          <h1 style={styles.title}>Get Started</h1>
          <p style={styles.subtitle}>Create your account and start automated trading</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                style={{
                  ...styles.input,
                  ...(errors.username ? styles.inputError : {})
                }}
                placeholder="Enter username"
              />
              {errors.username && <p style={styles.error}>{errors.username}</p>}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={{
                  ...styles.input,
                  ...(errors.email ? styles.inputError : {})
                }}
                placeholder="Enter email"
              />
              {errors.email && <p style={styles.error}>{errors.email}</p>}
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                style={{
                  ...styles.input,
                  ...(errors.password ? styles.inputError : {})
                }}
                placeholder="Min 8 characters"
              />
              {errors.password && <p style={styles.error}>{errors.password}</p>}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                style={{
                  ...styles.input,
                  ...(errors.confirmPassword ? styles.inputError : {})
                }}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && <p style={styles.error}>{errors.confirmPassword}</p>}
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Exchange</label>
              <select
                name="exchange"
                value={formData.exchange}
                onChange={handleInputChange}
                style={styles.select}
              >
                {exchanges.map(exchange => (
                  <option key={exchange.value} value={exchange.value}>
                    {exchange.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Strategy</label>
              <select
                name="strategy"
                value={formData.strategy}
                onChange={handleInputChange}
                style={styles.select}
              >
                {strategies.map(strategy => (
                  <option key={strategy.value} value={strategy.value}>
                    {strategy.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>API Key</label>
            <input
              type="text"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleInputChange}
              style={{
                ...styles.input,
                ...(errors.apiKey ? styles.inputError : {})
              }}
              placeholder="Enter your API key"
            />
            {errors.apiKey && <p style={styles.error}>{errors.apiKey}</p>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>API Secret</label>
            <input
              type="password"
              name="apiSecret"
              value={formData.apiSecret}
              onChange={handleInputChange}
              style={{
                ...styles.input,
                ...(errors.apiSecret ? styles.inputError : {})
              }}
              placeholder="Enter your API secret"
            />
            {errors.apiSecret && <p style={styles.error}>{errors.apiSecret}</p>}
          </div>

          <div style={styles.checkbox}>
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              style={styles.checkboxInput}
            />
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              I agree to the{' '}
              <span style={styles.link}>Terms of Service</span>
              {' '}and{' '}
              <span style={styles.link}>Privacy Policy</span>
            </span>
          </div>
          {errors.agreeToTerms && <p style={styles.error}>{errors.agreeToTerms}</p>}

          {errors.submit && (
            <p style={styles.error}>{errors.submit}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.button,
              ...(isLoading ? styles.buttonDisabled : {})
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <span>Creating Account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </button>

          <div style={styles.footer}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Already have an account?{' '}
              <span style={styles.link} onClick={switchToLogin}>
                Sign in
              </span>
            </p>
          </div>
        </form>

        <div style={styles.benefits}>
          <div style={styles.benefitTitle}>🎁 What You Get:</div>
          <div style={styles.benefitList}>
            • 14-day free trial • Only $15/month after trial<br/>
            • 25x leverage trading • Advanced martingale strategies<br/>
            • 24/7 automated trading • Real-time analytics
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;