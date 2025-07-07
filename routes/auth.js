

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, exchange, apiKey, apiSecret, strategy = 'steady_climb' } = req.body;

    // Validation
    if (!username || !email || !password || !exchange || !apiKey || !apiSecret) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email or username' 
      });
    }

    // Validate exchange
    const supportedExchanges = ['bybit', 'binance', 'bitget'];
    if (!supportedExchanges.includes(exchange)) {
      return res.status(400).json({ 
        message: 'Unsupported exchange. Please choose: bybit, binance, or bitget' 
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password, // Will be hashed by pre-save middleware
      trading: {
        exchange,
        apiKey,
        apiSecret,
        strategy,
        testnet: true, // Start with testnet
        isActive: false
      }
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        subscription: user.subscription,
        trading: {
          exchange: user.trading.exchange,
          strategy: user.trading.strategy,
          isActive: user.trading.isActive
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Check subscription status
    const now = new Date();
    const isSubscriptionActive = user.subscription.endDate > now;

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        subscription: {
          ...user.subscription,
          isActive: isSubscriptionActive
        },
        trading: {
          exchange: user.trading.exchange,
          strategy: user.trading.strategy,
          isActive: user.trading.isActive
        },
        yieldWallet: user.yieldWallet,
        stats: user.stats
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -trading.apiSecret');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check subscription status
    const now = new Date();
    const isSubscriptionActive = user.subscription.endDate > now;

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        subscription: {
          ...user.subscription.toObject(),
          isActive: isSubscriptionActive
        },
        trading: user.trading,
        yieldWallet: user.yieldWallet,
        stats: user.stats,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update trading configuration
router.put('/trading-config', auth, async (req, res) => {
  try {
    const { exchange, apiKey, apiSecret, strategy, testnet, tradingPair } = req.body;
    
    const updates = {};
    if (exchange) updates['trading.exchange'] = exchange;
    if (apiKey) updates['trading.apiKey'] = apiKey;
    if (apiSecret) updates['trading.apiSecret'] = apiSecret;
    if (strategy) updates['trading.strategy'] = strategy;
    if (tradingPair) updates['trading.tradingPair'] = tradingPair;
    if (typeof testnet === 'boolean') updates['trading.testnet'] = testnet;

    // Validate exchange
    if (exchange) {
      const supportedExchanges = ['bybit', 'binance', 'bitget'];
      if (!supportedExchanges.includes(exchange)) {
        return res.status(400).json({ 
          message: 'Unsupported exchange. Please choose: bybit, binance, or bitget' 
        });
      }
    }

    // Validate strategy
    if (strategy) {
      const supportedStrategies = ['steady_climb', 'power_surge'];
      if (!supportedStrategies.includes(strategy)) {
        return res.status(400).json({ 
          message: 'Invalid strategy. Please choose: steady_climb or power_surge' 
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select('-password -trading.apiSecret');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If trading is active, restart with new config
    if (user.trading.isActive) {
      const TradingBot = require('../services/TradingBot');
      const bot = new TradingBot();
      bot.removeUser(req.user.id);
      await bot.addUser(req.user.id);
    }

    res.json({
      message: 'Trading configuration updated successfully',
      trading: user.trading
    });

  } catch (error) {
    console.error('Trading config update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify JWT token
router.get('/verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -trading.apiSecret');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check subscription status
    const now = new Date();
    const isSubscriptionActive = user.subscription.endDate > now;

    res.json({
      valid: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        subscription: {
          ...user.subscription.toObject(),
          isActive: isSubscriptionActive
        }
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Test endpoint to modify subscription (development only)
router.post('/test-subscription', auth, async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: 'Not available in production' });
  }

  try {
    const { action } = req.body; // 'expire', 'trial-ending', 'activate'
    
    let updates = {};
    const now = new Date();
    
    switch (action) {
      case 'expire':
        updates = {
          'subscription.plan': 'free_trial',
          'subscription.endDate': new Date(now.getTime() - 24 * 60 * 60 * 1000) // Yesterday
        };
        break;
      case 'trial-ending':
        updates = {
          'subscription.plan': 'free_trial',
          'subscription.endDate': new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
        };
        break;
      case 'activate':
        updates = {
          'subscription.plan': 'premium',
          'subscription.endDate': new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        };
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    res.json({ message: 'Subscription updated', subscription: user.subscription });

  } catch (error) {
    res.status(500).json({ message: 'Error updating subscription' });
  }
});
// Test endpoint to modify subscription (development only)
router.post('/test-subscription', auth, async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: 'Not available in production' });
  }

  try {
    const { action } = req.body; // 'expire', 'trial-ending', 'activate'
    
    let updates = {};
    const now = new Date();
    
    switch (action) {
      case 'expire':
        updates = {
          'subscription.plan': 'free_trial',
          'subscription.endDate': new Date(now.getTime() - 24 * 60 * 60 * 1000) // Yesterday
        };
        break;
      case 'trial-ending':
        updates = {
          'subscription.plan': 'free_trial',
          'subscription.endDate': new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
        };
        break;
      case 'activate':
        updates = {
          'subscription.plan': 'premium',
          'subscription.endDate': new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        };
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    res.json({ message: 'Subscription updated', subscription: user.subscription });

  } catch (error) {
    res.status(500).json({ message: 'Error updating subscription' });
  }
});
// Start free trial (NEW ENDPOINT - this fixes your 404 error!)
router.post('/start-trial', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user already has an active subscription
    const now = new Date();
    if (user.subscription.endDate > now) {
      return res.status(400).json({ 
        message: 'You already have an active subscription' 
      });
    }

    // Check if user has already used a free trial
    if (user.subscription.plan === 'free_trial' && user.subscription.trialUsed) {
      return res.status(400).json({ 
        message: 'You have already used your free trial' 
      });
    }

    // Start 14-day free trial
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 14); // 14 days from now

    const updates = {
      'subscription.plan': 'free_trial',
      'subscription.startDate': now,
      'subscription.endDate': trialEndDate,
      'subscription.trialUsed': true
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, 
      updates, 
      { new: true }
    ).select('-password -trading.apiSecret');

    res.json({
      message: 'Free trial activated successfully!',
      subscription: {
        plan: updatedUser.subscription.plan,
        startDate: updatedUser.subscription.startDate,
        endDate: updatedUser.subscription.endDate,
        isActive: true,
        daysLeft: 14
      },
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        subscription: updatedUser.subscription
      }
    });

  } catch (error) {
    console.error('Free trial activation error:', error);
    res.status(500).json({ message: 'Server error during trial activation' });
  }
});

module.exports = router;