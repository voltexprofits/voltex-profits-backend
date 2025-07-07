
import React, { useState, useEffect } from 'react';
import ConnectedApp from './ConnectedApp';
import CryptoPayment from './CryptoPayment';

function SubscriptionGate({ user, onLogout }) {
  const [subscriptionStatus, setSubscriptionStatus] = useState('checking');
  const [showPayment, setShowPayment] = useState(false);
  const [isStartingTrial, setIsStartingTrial] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    checkSubscriptionStatus();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkSubscriptionStatus = () => {
    // FIXED: Check real subscription status instead of forcing expired
    if (!user?.subscription) {
      setSubscriptionStatus('expired');
      return;
    }

    const now = new Date();
    const endDate = new Date(user.subscription.endDate);
    const isActive = endDate > now;

    if (isActive) {
      setSubscriptionStatus('active');
    } else {
      setSubscriptionStatus('expired');
    }
  };

  const handleStartFreeTrial = async () => {
    setIsStartingTrial(true);
    setSuccessMessage('');
    
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://voltex-profits-backend.onrender.com';
      
      const response = await fetch(`${API_BASE_URL}/api/auth/start-trial`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId: user.id })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update user data with trial info
        const updatedUser = { ...user, subscription: data.subscription };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Show success message
        setSuccessMessage('🎉 Free trial activated! Welcome to Voltex Profits!');
        
        // Update subscription status immediately to show dashboard
        setSubscriptionStatus('active');
        
        // Optional: Remove success message after 3 seconds for clean UI
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
        
      } else {
        // Better error handling
        if (data.message.includes('already used')) {
          alert('You have already used your free trial. Please upgrade to premium.');
        } else if (data.message.includes('active subscription')) {
          alert('You already have an active subscription!');
        } else {
          alert(data.message || 'Failed to start trial. Please try again.');
        }
      }
    } catch (error) {
      console.error('Trial start error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsStartingTrial(false);
    }
  };

  const handleUpgradeClick = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setSubscriptionStatus('active');
    // Refresh user data
    window.location.reload();
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  // Calculate trial info for banner
  const getTrialInfo = () => {
    if (user?.subscription?.plan === 'free_trial') {
      const endDate = new Date(user.subscription.endDate);
      const now = new Date();
      const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      return { isTrial: true, daysLeft: Math.max(0, daysLeft) };
    }
    return { isTrial: false, daysLeft: 0 };
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: 'system-ui, sans-serif'
    },
    subscriptionBanner: {
      backgroundColor: '#fef3c7',
      borderBottom: '1px solid #f59e0b',
      padding: '1rem',
      textAlign: 'center'
    },
    bannerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    bannerText: {
      color: '#92400e',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    upgradeButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#f59e0b',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    expiredOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    expiredCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '2rem',
      maxWidth: '450px',
      margin: '1rem',
      textAlign: 'center',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    },
    expiredTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '1rem'
    },
    expiredText: {
      color: '#6b7280',
      marginBottom: '1.5rem',
      lineHeight: '1.6'
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    trialButton: {
      padding: '0.75rem 1.5rem',
      background: 'linear-gradient(45deg, #10b981, #34d399)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '0.875rem',
      transition: 'all 0.2s',
      minWidth: '160px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    },
    primaryButton: {
      padding: '0.75rem 1.5rem',
      background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '500',
      cursor: 'pointer',
      fontSize: '0.875rem'
    },
    secondaryButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '500',
      cursor: 'pointer',
      fontSize: '0.875rem'
    },
    trialInfo: {
      backgroundColor: '#dbeafe',
      border: '1px solid #93c5fd',
      borderRadius: '8px',
      padding: '1rem',
      margin: '1rem 0',
      fontSize: '0.875rem',
      color: '#1e40af'
    },
    freeTrialInfo: {
      backgroundColor: '#ecfdf5',
      border: '1px solid #86efac',
      borderRadius: '8px',
      padding: '1rem',
      margin: '1rem 0',
      fontSize: '0.875rem',
      color: '#065f46'
    },
    cryptoInfo: {
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      borderRadius: '8px',
      padding: '1rem',
      margin: '1rem 0',
      fontSize: '0.875rem',
      color: '#166534'
    },
    paymentMethods: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '0.75rem',
      margin: '1.5rem 0'
    },
    methodCard: {
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '1rem',
      textAlign: 'left'
    },
    methodTitle: {
      fontWeight: '600',
      color: '#111827',
      marginBottom: '0.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    methodDesc: {
      fontSize: '0.75rem',
      color: '#6b7280'
    },
    testNote: {
      backgroundColor: '#fef3c7',
      border: '1px solid #f59e0b',
      borderRadius: '8px',
      padding: '0.75rem',
      margin: '1rem 0',
      fontSize: '0.75rem',
      color: '#92400e',
      fontWeight: '500'
    },
    successMessage: {
      backgroundColor: '#dcfce7',
      border: '1px solid #86efac',
      borderRadius: '8px',
      padding: '1rem',
      margin: '1rem 0',
      fontSize: '0.875rem',
      color: '#065f46',
      fontWeight: '600',
      textAlign: 'center'
    },
    spinner: {
      width: '16px',
      height: '16px',
      border: '2px solid #ffffff40',
      borderTop: '2px solid #ffffff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  // Add CSS animation for spinner
  const spinnerKeyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  // Show crypto payment page
  if (showPayment) {
    return (
      <CryptoPayment
        user={user}
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancel}
      />
    );
  }

  // Check if subscription is expired
  if (subscriptionStatus === 'expired') {
    return (
      <div style={styles.container}>
        <style>{spinnerKeyframes}</style>
        <div style={styles.expiredOverlay}>
          <div style={styles.expiredCard}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
            <h2 style={styles.expiredTitle}>Premium Subscription Required</h2>
            <p style={styles.expiredText}>
              Unlock automated crypto trading with our advanced martingale strategies. 
              Pay securely with cryptocurrency.
            </p>
            
            <div style={styles.testNote}>
              🧪 TEST MODE: Crypto payment system active
            </div>

            {/* Success Message */}
            {successMessage && (
              <div style={styles.successMessage}>
                {successMessage}
              </div>
            )}

            {/* Free Trial Option */}
            <div style={styles.freeTrialInfo}>
              <strong>🎁 Try Risk-Free for 14 Days!</strong><br/>
              • Full access to all premium features<br/>
              • No payment required to start<br/>
              • Cancel anytime during trial<br/>
              • Automatic trading activation<br/>
              • Real-time profit tracking
            </div>
            
            <div style={styles.trialInfo}>
              <strong>Premium Plan: 15 USDT/month</strong><br/>
              • Automated 24/7 trading<br/>
              • Advanced martingale strategies<br/>
              • 25x leverage trading<br/>
              • Real-time analytics<br/>
              • Multi-exchange support<br/>
              • 14-day money-back guarantee
            </div>

            <div style={styles.cryptoInfo}>
              <strong>💎 Why Crypto Payment?</strong><br/>
              • Instant processing<br/>
              • Lower fees than traditional methods<br/>
              • Anonymous and secure<br/>
              • Perfect for crypto traders
            </div>

            <div style={styles.paymentMethods}>
              <div style={styles.methodCard}>
                <div style={styles.methodTitle}>
                  💰 USDT (TRC20)
                  <span style={{ fontSize: '0.75rem', color: '#16a34a', backgroundColor: '#dcfce7', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                    Recommended
                  </span>
                </div>
                <div style={styles.methodDesc}>
                  Fast, low-cost transactions on Tron network
                </div>
              </div>
            </div>

            {/* Updated Button Group with Free Trial */}
            <div style={styles.buttonGroup}>
              <button
                onClick={handleStartFreeTrial}
                disabled={isStartingTrial || successMessage}
                style={{
                  ...styles.trialButton,
                  opacity: (isStartingTrial || successMessage) ? 0.7 : 1,
                  cursor: (isStartingTrial || successMessage) ? 'not-allowed' : 'pointer'
                }}
              >
                {isStartingTrial ? (
                  <>
                    <div style={styles.spinner}></div>
                    Starting Trial...
                  </>
                ) : successMessage ? (
                  <>
                    ✅ Trial Activated!
                  </>
                ) : (
                  <>
                    🎁 Start 14-Day Free Trial
                  </>
                )}
              </button>
              
              {!successMessage && (
                <button
                  onClick={handleUpgradeClick}
                  style={styles.primaryButton}
                >
                  💳 Pay with USDT
                </button>
              )}
            </div>

            {!successMessage && (
              <div style={styles.buttonGroup}>
                <button
                  onClick={onLogout}
                  style={styles.secondaryButton}
                >
                  Logout
                </button>
              </div>
            )}
            
            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
              <p>🔒 Secure blockchain payments</p>
              <p>⚡ Instant activation after confirmation</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active subscription - show dashboard with trial banner if needed
  const trialInfo = getTrialInfo();
  const showUpgradeBanner = trialInfo.isTrial && trialInfo.daysLeft <= 3;

  return (
    <div style={styles.container}>
      {/* Upgrade Banner for Trial Users */}
      {showUpgradeBanner && (
        <div style={styles.subscriptionBanner}>
          <div style={styles.bannerContent}>
            <div style={styles.bannerText}>
              ⏰ Your free trial ends in {trialInfo.daysLeft} day{trialInfo.daysLeft !== 1 ? 's' : ''}. 
              Upgrade now to continue automated trading!
            </div>
            <button
              onClick={handleUpgradeClick}
              style={styles.upgradeButton}
              onMouseOver={(e) => e.target.style.backgroundColor = '#d97706'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f59e0b'}
            >
              Pay with USDT
            </button>
          </div>
        </div>
      )}

      {/* Main Dashboard */}
      <ConnectedApp user={user} onLogout={onLogout} />
    </div>
  );
}

export default SubscriptionGate;