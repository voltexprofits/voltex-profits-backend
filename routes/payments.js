
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create Stripe customer and subscription
router.post('/subscribe', auth, async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let customerId = user.subscription.stripeCustomerId;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.username,
        metadata: {
          userId: user._id.toString()
        }
      });
      customerId = customer.id;
      
      // Update user with customer ID
      await User.findByIdAndUpdate(req.user.id, {
        'subscription.stripeCustomerId': customerId
      });
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Voltex Profits Premium',
            description: 'Monthly subscription for automated trading bot'
          },
          unit_amount: 1500, // $15.00 in cents
          recurring: {
            interval: 'month'
          }
        }
      }],
      expand: ['latest_invoice.payment_intent'],
      trial_period_days: 14 // 2-week free trial
    });

    // Update user subscription
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

    await User.findByIdAndUpdate(req.user.id, {
      'subscription.plan': 'premium',
      'subscription.subscriptionId': subscription.id,
      'subscription.endDate': subscriptionEndDate,
      'subscription.stripeCustomerId': customerId
    });

    res.json({
      message: 'Subscription created successfully',
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret
    });

  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ 
      message: 'Error creating subscription',
      error: error.message 
    });
  }
});

// Cancel subscription
router.post('/cancel-subscription', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.subscription.subscriptionId) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    // Cancel subscription at period end
    await stripe.subscriptions.update(user.subscription.subscriptionId, {
      cancel_at_period_end: true
    });

    res.json({ 
      message: 'Subscription will be cancelled at the end of the current billing period' 
    });

  } catch (error) {
    console.error('Cancellation error:', error);
    res.status(500).json({ 
      message: 'Error cancelling subscription',
      error: error.message 
    });
  }
});

// Get billing information
router.get('/billing', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || !user.subscription.stripeCustomerId) {
      return res.json({
        subscription: user?.subscription || {},
        paymentMethods: [],
        invoices: []
      });
    }

    // Get payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.subscription.stripeCustomerId,
      type: 'card',
    });

    // Get recent invoices
    const invoices = await stripe.invoices.list({
      customer: user.subscription.stripeCustomerId,
      limit: 10,
    });

    res.json({
      subscription: user.subscription,
      paymentMethods: paymentMethods.data,
      invoices: invoices.data.map(invoice => ({
        id: invoice.id,
        amount: invoice.amount_paid / 100,
        currency: invoice.currency,
        status: invoice.status,
        created: new Date(invoice.created * 1000),
        invoiceUrl: invoice.hosted_invoice_url
      }))
    });

  } catch (error) {
    console.error('Error fetching billing info:', error);
    res.status(500).json({ message: 'Error fetching billing information' });
  }
});

// Webhook to handle Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Handle successful payment
async function handlePaymentSucceeded(invoice) {
  try {
    const customerId = invoice.customer;
    
    const user = await User.findOne({ 
      'subscription.stripeCustomerId': customerId 
    });
    
    if (user) {
      // Update subscription end date
      const nextBillingDate = new Date(invoice.period_end * 1000);
      
      await User.findByIdAndUpdate(user._id, {
        'subscription.plan': 'premium',
        'subscription.endDate': nextBillingDate
      });
      
      console.log(`💰 Payment succeeded for user ${user.username}`);
    }
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

// Handle failed payment
async function handlePaymentFailed(invoice) {
  try {
    const customerId = invoice.customer;
    
    const user = await User.findOne({ 
      'subscription.stripeCustomerId': customerId 
    });
    
    if (user) {
      console.log(`❌ Payment failed for user ${user.username}`);
    }
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

// Handle subscription deletion
async function handleSubscriptionDeleted(subscription) {
  try {
    const user = await User.findOne({ 
      'subscription.subscriptionId': subscription.id 
    });
    
    if (user) {
      await User.findByIdAndUpdate(user._id, {
        'subscription.plan': 'free_trial',
        'subscription.subscriptionId': null,
        'subscription.endDate': new Date(), // Immediate expiry
        'trading.isActive': false // Stop trading
      });
      
      console.log(`❌ Subscription cancelled for user ${user.username}`);
    }
  } catch (error) {
    console.error('Error handling subscription deletion:', error);
  }
}
// Verify crypto payment
router.post('/verify-crypto', auth, async (req, res) => {
  try {
    const { transactionId, amount, address } = req.body;
    
    if (!transactionId || !amount || !address) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // For testing purposes, we'll accept any transaction ID
    // In production, you'd verify this with TronScan API or similar
    
    console.log(`Crypto payment verification:`, {
      userId: req.user.id,
      transactionId,
      amount,
      address
    });

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // For demo: accept any transaction ID that's at least 10 characters
    if (transactionId.length >= 10) {
      // Update user subscription
      const subscriptionEndDate = new Date();
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

      await User.findByIdAndUpdate(req.user.id, {
        'subscription.plan': 'premium',
        'subscription.endDate': subscriptionEndDate,
        'subscription.paymentMethod': 'crypto',
        'subscription.lastPayment': {
          transactionId,
          amount,
          currency: 'USDT',
          timestamp: new Date()
        }
      });

      res.json({ 
        message: 'Payment verified successfully',
        subscription: 'premium'
      });
    } else {
      res.status(400).json({ 
        message: 'Invalid transaction ID. Please check and try again.' 
      });
    }

  } catch (error) {
    console.error('Crypto payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
});

module.exports = router;