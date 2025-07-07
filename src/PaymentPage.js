
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_51RgOqBKK5X0LH7kww1t2yxNB0tAQhCoLxqTpdT1dnM3dfNPOE4BHnNX3W9WnZB1OTYykd6Ywyua1XuqPulFSMrXL00dVrCsNNe');

function PaymentForm({ user, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    // Create payment method
    const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: user?.username,
        email: user?.email,
      },
    });

    if (methodError) {
      setError(methodError.message);
      setIsLoading(false);
      return;
    }

    try {
      // Create subscription on backend
      const response = await fetch('http://localhost:5000/api/payments/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
      } else {
        setError(data.message || 'Payment failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
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
    priceBox: {
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '2rem',
      textAlign: 'center'
    },
    priceTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#166534',
      marginBottom: '0.5rem'
    },
    price: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#166534',
      marginBottom: '0.5rem'
    },
    priceSubtext: {
      fontSize: '0.875rem',
      color: '#15803d'
    },
    benefits: {
      backgroundColor: '#eff6ff',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1.5rem'
    },
    benefitTitle: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#1e40af',
      marginBottom: '0.75rem'
    },
    benefitList: {
      fontSize: '0.75rem',
      color: '#1e40af',
      lineHeight: '1.6'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    cardElementContainer: {
      padding: '1rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      backgroundColor: 'white'
    },
    error: {
      color: '#ef4444',
      fontSize: '0.875rem',
      textAlign: 'center'
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
          <h1 style={styles.title}>Upgrade to Premium</h1>
          <p style={styles.subtitle}>
            Start your 14-day free trial and unlock automated trading
          </p>
        </div>

        <div style={styles.priceBox}>
          <div style={styles.priceTitle}>Premium Plan</div>
          <div style={styles.price}>$15<span style={{ fontSize: '1rem' }}>/month</span></div>
          <div style={styles.priceSubtext}>
            + 25% profit sharing • 14-day free trial
          </div>
        </div>

        <div style={styles.benefits}>
          <div style={styles.benefitTitle}>🚀 What You Get:</div>
          <div style={styles.benefitList}>
            • <strong>Automated Trading:</strong> 24/7 bot with martingale strategies<br/>
            • <strong>25x Leverage:</strong> Maximize your trading potential<br/>
            • <strong>Multi-Exchange:</strong> Bybit, Binance, and Bitget support<br/>
            • <strong>Real-time Analytics:</strong> Live performance tracking<br/>
            • <strong>Risk Management:</strong> 0.2% risk per trade<br/>
            • <strong>Free Trial:</strong> 14 days to test everything
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.cardElementContainer}>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>

          {error && (
            <div style={styles.error}>{error}</div>
          )}

          <div style={styles.buttonContainer}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                ...styles.button,
                ...styles.secondaryButton
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!stripe || isLoading}
              style={{
                ...styles.button,
                ...styles.primaryButton,
                ...((!stripe || isLoading) ? styles.disabledButton : {})
              }}
            >
              {isLoading ? 'Processing...' : 'Start Free Trial'}
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
          <p>Your card will not be charged during the 14-day free trial.</p>
          <p>Cancel anytime. Secure payments powered by Stripe.</p>
        </div>
      </div>
    </div>
  );
}

function PaymentPage({ user, onSuccess, onCancel }) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm user={user} onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  );
}

export default PaymentPage;