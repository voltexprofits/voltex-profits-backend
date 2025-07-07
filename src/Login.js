

import React, { useState } from 'react';

function Login({ onLogin, switchToSignup }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // API call to backend
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://voltex-profits-backend.onrender.com';

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setErrors({ submit: data.message || 'Login failed' });
      }
    } catch (error) {
      console.error('Login error:', error);
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
      maxWidth: '400px'
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
      gap: '1.5rem'
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
    inputError: {
      borderColor: '#ef4444'
    },
    error: {
      fontSize: '0.75rem',
      color: '#ef4444',
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
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your trading dashboard</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{
                ...styles.input,
                ...(errors.email ? styles.inputError : {})
              }}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p style={styles.error}>{errors.email}</p>
            )}
          </div>

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
              placeholder="Enter your password"
            />
            {errors.password && (
              <p style={styles.error}>{errors.password}</p>
            )}
          </div>

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
                <span>Signing In...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <div style={styles.footer}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Don't have an account?{' '}
              <span style={styles.link} onClick={switchToSignup}>
                Sign up
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;