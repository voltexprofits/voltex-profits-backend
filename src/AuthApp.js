
import React, { useState, useEffect } from 'react';
import Login from './Login';
import Signup from './Signup';
import SubscriptionGate from './SubscriptionGate';

function AuthApp() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'signup', 'dashboard'
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in when app loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setCurrentView('dashboard');
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleSignup = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('login');
  };

  const switchToLogin = () => {
    setCurrentView('login');
  };

  const switchToSignup = () => {
    setCurrentView('signup');
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
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
          }}>
            V
          </div>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Loading Voltex Profits...</p>
        </div>
      </div>
    );
  }

  // Render appropriate view based on authentication state
  if (currentView === 'dashboard' && user) {
    return <SubscriptionGate user={user} onLogout={handleLogout} />;
  }

  if (currentView === 'signup') {
    return (
      <Signup 
        onSignup={handleSignup}
        switchToLogin={switchToLogin}
      />
    );
  }

  return (
    <Login 
      onLogin={handleLogin}
      switchToSignup={switchToSignup}
    />
  );
}

export default AuthApp;