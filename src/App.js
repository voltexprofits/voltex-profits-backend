

import React, { useState } from 'react';

function App({ user, onLogout }) {
  const [isTrading, setIsTrading] = useState(false);
  const [selectedPair, setSelectedPair] = useState('BTC/USDT');
  const [selectedStrategy, setSelectedStrategy] = useState('steady_climb');
  
  const userData = {
    balance: 1250.75,
    totalProfit: 342.50,
    successRate: 73.5,
    yieldWallet: 85.63,
    currentLevel: 3,
    dailyPnL: 15.32
  };

  const cryptoPairs = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'ADA/USDT'];
  const strategies = [
    { value: 'steady_climb', name: 'Steady Climb - Conservative' },
    { value: 'power_surge', name: 'Power Surge - Aggressive' }
  ];

  const toggleTrading = () => setIsTrading(!isTrading);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: 'system-ui, sans-serif'
    },
    nav: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem 2rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    navContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    logoIcon: {
      width: '32px',
      height: '32px',
      background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold'
    },
    logoText: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#111827'
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    username: {
      color: '#6b7280',
      fontSize: '0.875rem'
    },
    logoutButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '0.75rem',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background-color 0.2s'
    },
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem'
    },
    header: {
      marginBottom: '2rem'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#6b7280'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    statCard: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #f3f4f6'
    },
    statHeader: {
      fontSize: '0.875rem',
      color: '#6b7280',
      marginBottom: '0.5rem',
      fontWeight: '500'
    },
    statValue: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#111827'
    },
    profitValue: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#16a34a'
    },
    tradingPanel: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #f3f4f6',
      marginBottom: '2rem'
    },
    panelTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '1.5rem'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    select: {
      width: '100%',
      padding: '0.5rem 0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      backgroundColor: 'white',
      fontSize: '0.875rem'
    },
    statusPanel: {
      backgroundColor: '#f9fafb',
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid #e5e7eb'
    },
    statusRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    statusIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    statusDot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: isTrading ? '#22c55e' : '#ef4444'
    },
    statusText: {
      fontWeight: '500',
      color: '#111827'
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '500',
      cursor: 'pointer',
      fontSize: '0.875rem',
      backgroundColor: isTrading ? '#ef4444' : '#22c55e',
      color: 'white'
    },
    tradingInfo: {
      marginTop: '0.75rem',
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    welcomeCard: {
      backgroundColor: '#dbeafe',
      border: '1px solid #93c5fd',
      borderRadius: '12px',
      padding: '1rem',
      marginBottom: '2rem'
    },
    welcomeText: {
      color: '#1e40af',
      fontSize: '0.875rem',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>V</div>
            <span style={styles.logoText}>Voltex Profits</span>
          </div>
          <div style={styles.userSection}>
            <span style={styles.username}>
              Welcome, {user?.username || 'Demo User'}
            </span>
            <button 
              onClick={onLogout}
              style={styles.logoutButton}
              onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={styles.main}>
        {/* Welcome Message */}
        {user && (
          <div style={styles.welcomeCard}>
            <p style={styles.welcomeText}>
              🎉 Welcome to Voltex Profits, {user.username}! Your account is set up with {user.trading?.exchange || 'your exchange'} and you're ready to start automated trading.
            </p>
          </div>
        )}

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Trading Dashboard</h1>
          <p style={styles.subtitle}>Monitor and control your automated trading strategies</p>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statHeader}>Account Balance</div>
            <div style={styles.statValue}>${userData.balance.toFixed(2)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statHeader}>Total Profit</div>
            <div style={styles.profitValue}>${userData.totalProfit.toFixed(2)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statHeader}>Success Rate</div>
            <div style={styles.statValue}>{userData.successRate}%</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statHeader}>Yield Wallet</div>
            <div style={{ ...styles.statValue, color: '#ea580c' }}>${userData.yieldWallet.toFixed(2)}</div>
          </div>
        </div>

        {/* Trading Controls */}
        <div style={styles.tradingPanel}>
          <h2 style={styles.panelTitle}>Trading Controls</h2>
          
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Trading Pair</label>
              <select 
                style={styles.select}
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
              >
                {cryptoPairs.map(pair => (
                  <option key={pair} value={pair}>{pair}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={styles.label}>Strategy</label>
              <select 
                style={styles.select}
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value)}
              >
                {strategies.map(strategy => (
                  <option key={strategy.value} value={strategy.value}>
                    {strategy.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.statusPanel}>
            <div style={styles.statusRow}>
              <div style={styles.statusIndicator}>
                <div style={styles.statusDot}></div>
                <span style={styles.statusText}>
                  Status: {isTrading ? 'Active Trading' : 'Stopped'}
                </span>
              </div>
              <button style={styles.button} onClick={toggleTrading}>
                <span>{isTrading ? '⏸️' : '▶️'}</span>
                <span>{isTrading ? 'Pause Trading' : 'Start Trading'}</span>
              </button>
            </div>
            
            {isTrading && (
              <div style={styles.tradingInfo}>
                <p>Current Position Level: <strong>{userData.currentLevel}</strong></p>
                <p>Next Trade Size: <strong>$12.50</strong> (0.2% risk)</p>
                <p>Selected Strategy: <strong>{selectedStrategy === 'steady_climb' ? 'Steady Climb (Conservative)' : 'Power Surge (Aggressive)'}</strong></p>
                <p>Exchange: <strong>{user?.trading?.exchange || 'Not set'}</strong></p>
              </div>
            )}
          </div>
        </div>

        {/* Info Panel */}
        <div style={styles.tradingPanel}>
          <h2 style={styles.panelTitle}>Voltex Profits Features</h2>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div>
              <h3 style={{ color: '#16a34a', marginBottom: '0.5rem' }}>✅ Steady Climb Strategy</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Conservative approach with optimized risk management</p>
            </div>
            <div>
              <h3 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>🚀 Power Surge Strategy</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Aggressive strategy for higher potential returns</p>
            </div>
            <div>
              <h3 style={{ color: '#3b82f6', marginBottom: '0.5rem' }}>💰 Pricing</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>$15/month + 25% profit sharing</p>
            </div>
            <div>
              <h3 style={{ color: '#8b5cf6', marginBottom: '0.5rem' }}>⚡ Trading</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>25x leverage, 0.2% risk per trade</p>
            </div>
          </div>
        </div>

        {/* Additional Features Panel */}
        <div style={styles.tradingPanel}>
          <h2 style={styles.panelTitle}>Platform Benefits</h2>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div>
              <h3 style={{ color: '#059669', marginBottom: '0.5rem' }}>🎯 Automated Trading</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Set it and forget it - our bot trades 24/7 using proven strategies</p>
            </div>
            <div>
              <h3 style={{ color: '#7c3aed', marginBottom: '0.5rem' }}>📊 Real-time Analytics</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Monitor your performance with detailed charts and statistics</p>
            </div>
            <div>
              <h3 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>🔒 Secure & Reliable</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Bank-level security with encrypted API connections</p>
            </div>
            <div>
              <h3 style={{ color: '#ea580c', marginBottom: '0.5rem' }}>🎁 Free Trial</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Start with a 2-week free trial to test our strategies</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;