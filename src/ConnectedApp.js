
import React, { useState, useEffect } from 'react';
import LiveTradingPage from './LiveTradingPage';
import WalletManagementPage from './WalletManagementPage';
import AnalyticsDashboardPage from './AnalyticsDashboardPage';
import TradingHistoryPage from './TradingHistoryPage';
import SettingsPage from './SettingsPage';
import TradingAcademyPage from './TradingAcademyPage';
import SupportCenterPage from './SupportCenterPage';

function ConnectedApp({ user, onLogout }) {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tradingStatus, setTradingStatus] = useState(false); // Add trading status state
  const [stats, setStats] = useState({
    balance: 3247.85,
    totalProfit: 1315.70,
    todayPnL: 89.34,
    successRate: 78.3,
    yieldWallet: 198.45,
    activeTrades: 7,
    totalTrades: 267,
    hypeBalance: 245.67,
    hypeProfit: 81.58,
    portfolioReturn: 42.8,
    weeklyReturn: 8.5
  });

  // Calculate trial info
  const getTrialInfo = () => {
    if (user?.subscription?.plan === 'free_trial') {
      const endDate = new Date(user.subscription.endDate);
      const now = new Date();
      const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      return { isTrial: true, daysLeft: Math.max(0, daysLeft) };
    }
    return { isTrial: false, daysLeft: 0 };
  };

  const trialInfo = getTrialInfo();

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '🏠', description: 'Overview & Stats' },
    { id: 'trading', name: 'Trading', icon: '📊', description: 'Live Controls', badge: 'HYPE' },
    { id: 'analytics', name: 'Analytics', icon: '📈', description: 'Performance Charts', badge: 'NEW' },
    { id: 'wallet', name: 'Wallet', icon: '💰', description: 'Balance & Transactions' },
    { id: 'history', name: 'History', icon: '📋', description: 'Trade Records' },
    { id: 'settings', name: 'Settings', icon: '⚙️', description: 'Account Preferences' },
    { id: 'academy', name: 'Academy', icon: '🎓', description: 'Learn Trading' },
    { id: 'support', name: 'Support', icon: '📞', description: 'Help & Contact' }
  ];

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, sans-serif'
    },
    sidebar: {
      width: sidebarOpen ? '280px' : '80px',
      backgroundColor: 'white',
      borderRight: '1px solid #e2e8f0',
      transition: 'width 0.3s ease',
      position: 'fixed',
      height: '100vh',
      zIndex: 1000,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    sidebarHeader: {
      padding: '1.5rem',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    logo: {
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
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#1e293b',
      display: sidebarOpen ? 'block' : 'none'
    },
    navigation: {
      padding: '1rem 0'
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1.5rem',
      margin: '0.25rem 1rem',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textDecoration: 'none',
      color: '#64748b',
      position: 'relative'
    },
    navItemActive: {
      backgroundColor: '#eff6ff',
      color: '#2563eb',
      borderLeft: '4px solid #2563eb'
    },
    navIcon: {
      fontSize: '1.25rem',
      minWidth: '24px'
    },
    navText: {
      display: sidebarOpen ? 'block' : 'none',
      fontWeight: '500'
    },
    navDescription: {
      display: sidebarOpen ? 'block' : 'none',
      fontSize: '0.75rem',
      color: '#94a3b8',
      marginTop: '0.25rem'
    },
    navBadge: {
      position: 'absolute',
      top: '0.5rem',
      right: '1rem',
      fontSize: '0.625rem',
      fontWeight: '600',
      padding: '0.125rem 0.375rem',
      borderRadius: '10px',
      display: sidebarOpen ? 'block' : 'none'
    },
    navBadgeHype: {
      backgroundColor: '#f59e0b',
      color: 'white'
    },
    navBadgeNew: {
      backgroundColor: '#10b981',
      color: 'white'
    },
    navBadgeAnalytics: {
      backgroundColor: '#8b5cf6',
      color: 'white'
    },
    mainContent: {
      flex: 1,
      marginLeft: sidebarOpen ? '280px' : '80px',
      transition: 'margin-left 0.3s ease'
    },
    header: {
      backgroundColor: 'white',
      padding: '1rem 2rem',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 999
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    menuButton: {
      padding: '0.5rem',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      borderRadius: '6px',
      fontSize: '1.25rem'
    },
    headerTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1e293b'
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    statusBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    statusActive: {
      backgroundColor: '#d1fae5',
      color: '#065f46'
    },
    statusStopped: {
      backgroundColor: '#fee2e2',
      color: '#dc2626'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#64748b',
      fontSize: '0.875rem'
    },
    logoutButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '0.875rem',
      cursor: 'pointer',
      fontWeight: '500'
    },
    content: {
      padding: '2rem',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    trialBanner: {
      backgroundColor: '#fef3c7',
      border: '1px solid #f59e0b',
      borderRadius: '12px',
      padding: '1rem 1.5rem',
      marginBottom: '2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    trialText: {
      color: '#92400e',
      fontWeight: '600'
    },
    upgradeButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#f59e0b',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    statCard: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    portfolioStatCard: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    hypeStatCard: {
      background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
      color: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    statHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem'
    },
    statTitle: {
      color: '#64748b',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    statTitleWhite: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    statIcon: {
      fontSize: '1.5rem'
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1e293b'
    },
    statValueWhite: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: 'white'
    },
    statChange: {
      fontSize: '0.875rem',
      marginTop: '0.5rem'
    },
    statChangePositive: {
      color: '#059669'
    },
    statChangeWhite: {
      color: 'rgba(255, 255, 255, 0.9)'
    },
    statChangeNegative: {
      color: '#dc2626'
    },
    quickActions: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      marginBottom: '2rem'
    },
    quickActionsTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '1rem'
    },
    actionButtons: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem'
    },
    actionButton: {
      padding: '1rem',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      backgroundColor: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'center'
    },
    actionIcon: {
      fontSize: '1.5rem',
      marginBottom: '0.5rem'
    },
    actionText: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#1e293b'
    },
    recentActivity: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    },
    activityTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '1rem'
    },
    activityItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 0',
      borderBottom: '1px solid #f1f5f9'
    },
    activityText: {
      fontSize: '0.875rem',
      color: '#64748b'
    },
    activityTime: {
      fontSize: '0.75rem',
      color: '#94a3b8'
    },
    comingSoonCard: {
      backgroundColor: 'white',
      padding: '4rem 2rem',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      textAlign: 'center',
      color: '#64748b'
    },
    comingSoonIcon: {
      fontSize: '3rem',
      marginBottom: '1rem'
    },
    comingSoonTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '0.5rem'
    },
    comingSoonText: {
      fontSize: '1rem',
      marginBottom: '1rem'
    },
    comingSoonDetails: {
      fontSize: '0.875rem',
      color: '#94a3b8'
    }
  };

  const getCurrentPageTitle = () => {
    const page = navigationItems.find(item => item.id === activePage);
    return page ? page.name : 'Dashboard';
  };

  const renderDashboard = () => (
    <div>
      {/* Trial Banner */}
      {trialInfo.isTrial && (
        <div style={styles.trialBanner}>
          <div style={styles.trialText}>
            🎁 Free Trial Active - {trialInfo.daysLeft} days remaining
          </div>
          <button style={styles.upgradeButton}>
            Upgrade to Premium
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {/* Portfolio Performance Card */}
        <div style={styles.portfolioStatCard}>
          <div style={styles.statHeader}>
            <span style={styles.statTitleWhite}>🏆 Portfolio Return</span>
            <span style={styles.statIcon}>📈</span>
          </div>
          <div style={styles.statValueWhite}>{stats.portfolioReturn.toFixed(1)}%</div>
          <div style={styles.statChangeWhite}>
            ↗ +{stats.weeklyReturn}% this week
          </div>
        </div>

        {/* HYPE Performance Card */}
        <div style={styles.hypeStatCard}>
          <div style={styles.statHeader}>
            <span style={styles.statTitleWhite}>🔥 HYPE Performance</span>
            <span style={styles.statIcon}>🚀</span>
          </div>
          <div style={styles.statValueWhite}>${stats.hypeBalance.toFixed(2)}</div>
          <div style={styles.statChangeWhite}>
            ↗ +${stats.hypeProfit.toFixed(2)} today (+67.8%)
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <span style={styles.statTitle}>Total Portfolio</span>
            <span style={styles.statIcon}>💰</span>
          </div>
          <div style={styles.statValue}>${stats.balance.toFixed(2)}</div>
          <div style={{...styles.statChange, ...styles.statChangePositive}}>
            ↗ +5.8% from yesterday
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <span style={styles.statTitle}>Total Profit</span>
            <span style={styles.statIcon}>📈</span>
          </div>
          <div style={{...styles.statValue, color: '#059669'}}>${stats.totalProfit.toFixed(2)}</div>
          <div style={{...styles.statChange, ...styles.statChangePositive}}>
            ↗ +${stats.todayPnL.toFixed(2)} today
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <span style={styles.statTitle}>Success Rate</span>
            <span style={styles.statIcon}>🎯</span>
          </div>
          <div style={styles.statValue}>{stats.successRate}%</div>
          <div style={{...styles.statChange, ...styles.statChangePositive}}>
            ↗ +2.8% this week
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <span style={styles.statTitle}>Yield Wallet</span>
            <span style={styles.statIcon}>🎯</span>
          </div>
          <div style={styles.statValue}>${stats.yieldWallet.toFixed(2)}</div>
          <div style={{...styles.statChange, ...styles.statChangePositive}}>
            ↗ +12.5% APY earnings
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <span style={styles.statTitle}>Active Trades</span>
            <span style={styles.statIcon}>⚡</span>
          </div>
          <div style={styles.statValue}>{stats.activeTrades}</div>
          <div style={styles.statChange}>
            {stats.totalTrades} total trades • 7 assets
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <h3 style={styles.quickActionsTitle}>🚀 Quick Actions</h3>
        <div style={styles.actionButtons}>
          <div style={styles.actionButton} onClick={() => setActivePage('trading')}>
            <div style={styles.actionIcon}>🔥</div>
            <div style={styles.actionText}>Trade HYPE/USDT</div>
          </div>
          <div style={styles.actionButton} onClick={() => setActivePage('analytics')}>
            <div style={styles.actionIcon}>📊</div>
            <div style={styles.actionText}>View Analytics</div>
          </div>
          <div style={styles.actionButton} onClick={() => setActivePage('wallet')}>
            <div style={styles.actionIcon}>💰</div>
            <div style={styles.actionText}>Manage Wallet</div>
          </div>
          <div style={styles.actionButton} onClick={() => setActivePage('settings')}>
            <div style={styles.actionIcon}>⚙️</div>
            <div style={styles.actionText}>Account Settings</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={styles.recentActivity}>
        <h3 style={styles.activityTitle}>📋 Recent Multi-Asset Activity</h3>
        <div style={styles.activityItem}>
          <span style={styles.activityText}>🟢 BTC/USDT trade completed - Profit: +$32.67</span>
          <span style={styles.activityTime}>2 minutes ago</span>
        </div>
        <div style={styles.activityItem}>
          <span style={styles.activityText}>🔥 HYPE/USDT position opened - Size: $500 USDT</span>
          <span style={styles.activityTime}>8 minutes ago</span>
        </div>
        <div style={styles.activityItem}>
          <span style={styles.activityText}>📈 ETH/USDT trade completed - Profit: +$24.56</span>
          <span style={styles.activityTime}>15 minutes ago</span>
        </div>
        <div style={styles.activityItem}>
          <span style={styles.activityText}>💰 Yield wallet updated - New balance: $198.45</span>
          <span style={styles.activityTime}>45 minutes ago</span>
        </div>
        <div style={styles.activityItem}>
          <span style={styles.activityText}>⚡ Multi-asset strategy activated - 7 pairs active</span>
          <span style={styles.activityTime}>1 hour ago</span>
        </div>
        <div style={styles.activityItem}>
          <span style={styles.activityText}>🟢 SOL/USDT trade completed - Profit: +$18.34</span>
          <span style={styles.activityTime}>2 hours ago</span>
        </div>
      </div>
    </div>
  );

  const renderPageContent = () => {
    switch (activePage) {
      case 'dashboard':
        return renderDashboard();
      
      case 'trading':
        return <LiveTradingPage user={user} onTradingStatusChange={setTradingStatus} />;
      
      case 'wallet':
        return <WalletManagementPage user={user} />;
      
      case 'analytics':
        return <AnalyticsDashboardPage user={user} />;
      
      case 'history':
        return <TradingHistoryPage user={user} />;
      
      case 'settings':
        return <SettingsPage user={user} />;
      
      case 'academy':
        return <TradingAcademyPage user={user} />;
      
      case 'support':
        return <SupportCenterPage user={user} />;
      
      case 'history':
        return (
          <div style={styles.comingSoonCard}>
            <div style={styles.comingSoonIcon}>📋</div>
            <h2 style={styles.comingSoonTitle}>Trading History</h2>
            <p style={styles.comingSoonText}>Complete trade records and detailed reports</p>
            <p style={styles.comingSoonDetails}>
              Multi-asset trade logs • Performance reports • Export functionality • Advanced filtering • Profit/loss analysis • All 7 trading pairs
            </p>
          </div>
        );
      
      case 'settings':
        return (
          <div style={styles.comingSoonCard}>
            <div style={styles.comingSoonIcon}>⚙️</div>
            <h2 style={styles.comingSoonTitle}>Account Settings</h2>
            <p style={styles.comingSoonText}>User preferences and trading configuration</p>
            <p style={styles.comingSoonDetails}>
              Profile management • Multi-asset trading preferences • API key settings • Notification controls • Security options • Asset allocation settings
            </p>
          </div>
        );
      
      case 'academy':
        return (
          <div style={styles.comingSoonCard}>
            <div style={styles.comingSoonIcon}>🎓</div>
            <h2 style={styles.comingSoonTitle}>Trading Academy</h2>
            <p style={styles.comingSoonText}>Educational content and tutorials</p>
            <p style={styles.comingSoonDetails}>
              Multi-asset strategy guides • Risk management tutorials • Market analysis lessons • Video courses • Trading tips • Portfolio diversification
            </p>
          </div>
        );
      
      case 'support':
        return (
          <div style={styles.comingSoonCard}>
            <div style={styles.comingSoonIcon}>📞</div>
            <h2 style={styles.comingSoonTitle}>Support Center</h2>
            <p style={styles.comingSoonText}>Help documentation and contact options</p>
            <p style={styles.comingSoonDetails}>
              FAQ section • Live chat support • Ticket system • Documentation • Video tutorials • Community forum • Multi-asset trading support
            </p>
          </div>
        );
      
      default:
        return renderDashboard();
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>V</div>
          <span style={styles.logoText}>Voltex Profits</span>
        </div>
        
        <nav style={styles.navigation}>
          {navigationItems.map(item => (
            <div
              key={item.id}
              style={{
                ...styles.navItem,
                ...(activePage === item.id ? styles.navItemActive : {})
              }}
              onClick={() => setActivePage(item.id)}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <div>
                <div style={styles.navText}>{item.name}</div>
                <div style={styles.navDescription}>{item.description}</div>
              </div>
              {item.badge && (
                <span style={{
                  ...styles.navBadge,
                  ...(item.badge === 'HYPE' ? styles.navBadgeHype : 
                     item.badge === 'NEW' && item.id === 'analytics' ? styles.navBadgeAnalytics : 
                     styles.navBadgeNew)
                }}>
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <button
              style={styles.menuButton}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <h1 style={styles.headerTitle}>{getCurrentPageTitle()}</h1>
          </div>
          
          <div style={styles.headerRight}>
            <span style={{
              ...styles.statusBadge,
              ...(tradingStatus ? styles.statusActive : styles.statusStopped)
            }}>
              {tradingStatus ? '🟢 Trading Active' : '🔴 Trading Stopped'}
            </span>
            <div style={styles.userInfo}>
              Welcome, {user?.username || 'User'}
            </div>
            <button style={styles.logoutButton} onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div style={styles.content}>
          {renderPageContent()}
        </div>
      </div>
    </div>
  );
}

export default ConnectedApp;