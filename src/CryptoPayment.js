
import React, { useState, useEffect } from 'react';

function CryptoPayment({ user, onSuccess, onCancel }) {
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending', 'paid', 'expired'
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  const [paymentAddress] = useState('TN3r2edgeyXJLs54F6Re9KFiCU2KH3esw5'); // Your USDT TRC20 address
  const [paymentAmount] = useState('15.00'); // $15 in USDT
  const [transactionId, setTransactionId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setPaymentStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleVerifyPayment = async () => {
    if (!transactionId.trim()) {
      alert('Please enter your transaction ID');
      return;
    }

    setIsVerifying(true);
    
    try {
      // FIXED: Use environment variable with correct fallback URL
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://voltex-profits-backend.onrender.com';
      
      // Send transaction ID to backend for verification
      const response = await fetch(`${API_BASE_URL}/api/payments/verify-crypto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        mode: 'cors',
        body: JSON.stringify({
          transactionId: transactionId.trim(),
          amount: paymentAmount,
          address: paymentAddress,
          userId: user?.id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPaymentStatus('paid');
        // Update user data in localStorage
        const updatedUser = { ...user, subscription: data.subscription };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        alert(data.message || 'Payment verification failed. Please check your transaction ID.');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      alert('Error verifying payment. Please try again.');
    } finally {
      setIsVerifying(false);
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
      maxWidth: '500px'
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
      color: '#6b7280',
      marginBottom: '1rem'
    },
    timer: {
      backgroundColor: '#fef3c7',
      border: '1px solid #f59e0b',
      borderRadius: '8px',
      padding: '1rem',
      textAlign: 'center',
      marginBottom: '1.5rem'
    },
    timerText: {
      color: '#92400e',
      fontWeight: '600',
      fontSize: '1.125rem'
    },
    paymentBox: {
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    },
    paymentTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#166534',
      marginBottom: '1rem',
      textAlign: 'center'
    },
    paymentDetail: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.75rem',
      padding: '0.5rem',
      backgroundColor: 'white',
      borderRadius: '6px',
      border: '1px solid #d1fae5'
    },
    label: {
      fontWeight: '500',
      color: '#166534'
    },
    value: {
      fontFamily: 'monospace',
      fontSize: '0.875rem',
      color: '#15803d'
    },
    copyButton: {
      padding: '0.25rem 0.5rem',
      backgroundColor: '#16a34a',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '0.75rem',
      cursor: 'pointer',
      marginLeft: '0.5rem'
    },
    instructions: {
      backgroundColor: '#eff6ff',
      border: '1px solid #bfdbfe',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1.5rem'
    },
    instructionTitle: {
      fontWeight: '600',
      color: '#1e40af',
      marginBottom: '0.5rem'
    },
    instructionText: {
      fontSize: '0.875rem',
      color: '#1e40af',
      lineHeight: '1.5'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '0.875rem',
      marginBottom: '1rem'
    },
    buttonContainer: {
      display: 'flex',
      gap: '1rem'
    },
    button: {
      flex: 1,
      padding: '0.75rem',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '500',
      cursor: 'pointer',
      fontSize: '0.875rem'
    },
    primaryButton: {
      background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
      color: 'white'
    },
    secondaryButton: {
      backgroundColor: '#f3f4f6',
      color: '#374151'
    },
    disabledButton: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    successMessage: {
      backgroundColor: '#dcfce7',
      border: '1px solid #bbf7d0',
      borderRadius: '8px',
      padding: '1rem',
      textAlign: 'center',
      color: '#166534'
    },
    expiredMessage: {
      backgroundColor: '#fee2e2',
      border: '1px solid #fca5a5',
      borderRadius: '8px',
      padding: '1rem',
      textAlign: 'center',
      color: '#991b1b'
    }
  };

  if (paymentStatus === 'paid') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>V</div>
              <span style={styles.logoText}>Voltex Profits</span>
            </div>
            <h1 style={styles.title}>Payment Successful! 🎉</h1>
          </div>
          
          <div style={styles.successMessage}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h3>Welcome to Premium!</h3>
            <p>Your payment has been verified and your account has been upgraded.</p>
            <p>You now have access to all premium features including automated trading.</p>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'expired') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>V</div>
              <span style={styles.logoText}>Voltex Profits</span>
            </div>
            <h1 style={styles.title}>Payment Expired</h1>
          </div>
          
          <div style={styles.expiredMessage}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏰</div>
            <h3>Time's Up!</h3>
            <p>The payment window has expired. Please try again to generate a new payment request.</p>
          </div>

          <div style={styles.buttonContainer}>
            <button onClick={onCancel} style={{ ...styles.button, ...styles.primaryButton }}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>V</div>
            <span style={styles.logoText}>Voltex Profits</span>
          </div>
          <h1 style={styles.title}>Pay with USDT</h1>
          <p style={styles.subtitle}>
            Send USDT (TRC20) to activate your Premium subscription
          </p>
        </div>

        <div style={styles.timer}>
          <div style={styles.timerText}>
            ⏰ Payment expires in: {formatTime(timeLeft)}
          </div>
        </div>

        <div style={styles.paymentBox}>
          <div style={styles.paymentTitle}>💳 Payment Details</div>
          
          <div style={styles.paymentDetail}>
            <span style={styles.label}>Amount:</span>
            <div>
              <span style={styles.value}>{paymentAmount} USDT</span>
              <button 
                onClick={() => copyToClipboard(paymentAmount)}
                style={styles.copyButton}
              >
                Copy
              </button>
            </div>
          </div>

          <div style={styles.paymentDetail}>
            <span style={styles.label}>Network:</span>
            <span style={styles.value}>TRC20 (Tron)</span>
          </div>

          <div style={styles.paymentDetail}>
            <span style={styles.label}>Address:</span>
            <div>
              <span style={styles.value}>{paymentAddress}</span>
              <button 
                onClick={() => copyToClipboard(paymentAddress)}
                style={styles.copyButton}
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        <div style={styles.instructions}>
          <div style={styles.instructionTitle}>📋 Payment Instructions:</div>
          <div style={styles.instructionText}>
            1. Open your crypto wallet (TronLink, Trust Wallet, etc.)<br/>
            2. Send exactly <strong>{paymentAmount} USDT</strong> to the address above<br/>
            3. Make sure to use <strong>TRC20 network</strong> (Tron)<br/>
            4. Copy your transaction ID after sending<br/>
            5. Paste the transaction ID below and click verify
          </div>
        </div>

        <input
          type="text"
          placeholder="Enter your transaction ID (hash)"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          style={styles.input}
        />

        <div style={styles.buttonContainer}>
          <button
            onClick={onCancel}
            style={{ ...styles.button, ...styles.secondaryButton }}
          >
            Cancel
          </button>
          <button
            onClick={handleVerifyPayment}
            disabled={isVerifying || !transactionId.trim()}
            style={{
              ...styles.button,
              ...styles.primaryButton,
              ...(isVerifying || !transactionId.trim() ? styles.disabledButton : {})
            }}
          >
            {isVerifying ? 'Verifying...' : 'Verify Payment'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
          <p>⚠️ Only send USDT on TRC20 network. Other tokens or networks will not be credited.</p>
          <p>🔒 Your transaction is secured by blockchain technology.</p>
        </div>
      </div>
    </div>
  );
}

export default CryptoPayment;