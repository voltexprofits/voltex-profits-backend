
const express = require('express');
const router = express.Router();
const ExchangeService = require('../services/ExchangeService');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Global exchange service instance
const exchangeService = new ExchangeService();

// Connect to exchange - FIXED VERSION
router.post('/connect', auth, async (req, res) => {
  try {
    const { exchange, apiKey, secret, passphrase } = req.body;
    
    if (!exchange || !apiKey || !secret) {
      return res.status(400).json({ 
        success: false,
        message: 'Exchange, API key, and secret are required' 
      });
    }

    // Validate exchange
    const validExchanges = ['bybit', 'binance', 'bitget'];
    if (!validExchanges.includes(exchange)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid exchange. Supported: bybit, binance, bitget' 
      });
    }

    console.log(`🔗 Connecting to ${exchange}...`);

    // Test the API connection
    const result = await exchangeService.connect(apiKey, secret, exchange, passphrase);

    // If successful, save the API keys to user database
    const updateData = {
      'trading.apiKey': apiKey,
      'trading.apiSecret': secret,
      'trading.exchange': exchange,
      'trading.connected': true,
      'trading.lastConnected': new Date()
    };

    // Add passphrase for Bitget
    if (exchange === 'bitget' && passphrase) {
      updateData['trading.passphrase'] = passphrase;
    }

    await User.findByIdAndUpdate(req.user.id, updateData);

    res.json({
      success: true,
      balance: result.balance,
      exchange: exchange,
      message: `Connected to ${exchange} successfully`
    });

  } catch (error) {
    console.error('Exchange connection error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Start trading - UPDATED VERSION
router.post('/start', auth, async (req, res) => {
  try {
    const { pair, strategy } = req.body;
    const user = await User.findById(req.user.id);
    
    // Check if user has connected exchange
    if (!user.trading.connected || !user.trading.apiKey) {
      return res.status(400).json({ 
        success: false,
        message: 'Please connect your exchange API first in Settings' 
      });
    }
    
    if (!pair || !strategy) {
      return res.status(400).json({ 
        success: false,
        message: 'Trading pair and strategy are required' 
      });
    }

    // Valid strategies
    if (!['steady_climb', 'power_surge'].includes(strategy)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid strategy. Use steady_climb or power_surge' 
      });
    }

    // Valid pairs
    const validPairs = ['HYPE/USDT', 'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'ADA/USDT', 'XRP/USDT'];
    if (!validPairs.includes(pair)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid trading pair' 
      });
    }

    console.log(`🚀 Starting live trading: ${strategy} on ${pair}`);

    // Make sure exchange is connected with user's API keys
    await exchangeService.connect(
      user.trading.apiKey, 
      user.trading.apiSecret, 
      user.trading.exchange,
      user.trading.passphrase
    );

    // Start the Martingale strategy
    const result = await exchangeService.startMartingaleStrategy(pair, strategy);

    // Update user trading status
    await User.findByIdAndUpdate(req.user.id, {
      'trading.isActive': true,
      'trading.tradingPair': pair,
      'trading.strategy': strategy,
      'trading.lastTradeTime': new Date()
    });

    res.json({
      success: true,
      orderId: result.orderId,
      symbol: result.symbol,
      amount: result.amount,
      level: result.level,
      strategy: result.strategy,
      message: `${strategy.replace('_', ' ')} strategy started for ${pair}`
    });

  } catch (error) {
    console.error('Start trading error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Stop trading
router.post('/stop', auth, async (req, res) => {
  try {
    console.log('🛑 Stopping live trading...');

    await exchangeService.stopAllStrategies();

    // Update user trading status
    await User.findByIdAndUpdate(req.user.id, {
      'trading.isActive': false,
      'trading.lastTradeTime': new Date()
    });

    res.json({
      success: true,
      message: 'All trading strategies stopped and positions closed'
    });

  } catch (error) {
    console.error('Stop trading error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Get trading status
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const isTrading = exchangeService.isTrading();
    
    // Only get balance if user is connected
    let balance = 0;
    let positions = [];
    
    if (user.trading.connected && user.trading.apiKey) {
      try {
        await exchangeService.connect(
          user.trading.apiKey, 
          user.trading.apiSecret, 
          user.trading.exchange,
          user.trading.passphrase
        );
        balance = await exchangeService.getAccountBalance();
        positions = await exchangeService.getActivePositions();
      } catch (error) {
        console.log('Could not fetch live data:', error.message);
      }
    }

    res.json({
      success: true,
      isTrading: isTrading,
      balance: balance,
      activePositions: positions.length,
      positions: positions,
      userStrategy: user.trading.strategy,
      userPair: user.trading.tradingPair,
      connected: user.trading.connected,
      exchange: user.trading.exchange
    });

  } catch (error) {
    console.error('Status error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Get account balance
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.trading.connected || !user.trading.apiKey) {
      return res.status(400).json({ 
        success: false,
        message: 'Exchange not connected' 
      });
    }

    // Connect with user's API keys
    await exchangeService.connect(
      user.trading.apiKey, 
      user.trading.apiSecret, 
      user.trading.exchange,
      user.trading.passphrase
    );
    
    const balance = await exchangeService.getAccountBalance();
    
    res.json({
      success: true,
      balance: balance,
      currency: 'USDT',
      exchange: user.trading.exchange
    });

  } catch (error) {
    console.error('Balance error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Get active positions
router.get('/positions', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.trading.connected || !user.trading.apiKey) {
      return res.status(400).json({ 
        success: false,
        message: 'Exchange not connected' 
      });
    }

    // Connect with user's API keys
    await exchangeService.connect(
      user.trading.apiKey, 
      user.trading.apiSecret, 
      user.trading.exchange,
      user.trading.passphrase
    );
    
    const positions = await exchangeService.getActivePositions();
    
    res.json({
      success: true,
      positions: positions
    });

  } catch (error) {
    console.error('Positions error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Emergency stop
router.post('/emergency-stop', auth, async (req, res) => {
  try {
    console.log('🚨 EMERGENCY STOP requested by user:', req.user.id);
    
    await exchangeService.emergencyStop();

    // Update user
    await User.findByIdAndUpdate(req.user.id, {
      'trading.isActive': false,
      'trading.lastTradeTime': new Date()
    });

    res.json({
      success: true,
      message: 'Emergency stop completed - all positions closed'
    });

  } catch (error) {
    console.error('Emergency stop error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Test order (small amount for testing)
router.post('/test-order', auth, async (req, res) => {
  try {
    const { pair } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user.trading.connected || !user.trading.apiKey) {
      return res.status(400).json({
        success: false,
        message: 'Exchange not connected'
      });
    }
    
    console.log(`🧪 Placing test order for ${pair}`);
    
    // Connect with user's API keys
    await exchangeService.connect(
      user.trading.apiKey, 
      user.trading.apiSecret, 
      user.trading.exchange,
      user.trading.passphrase
    );
    
    // Place tiny test order (0.01% of balance)
    const balance = await exchangeService.getAccountBalance();
    const testAmount = balance * 0.0001; // 0.01% for testing
    
    if (testAmount < 5) {
      return res.status(400).json({
        success: false,
        message: 'Account balance too low for test order (minimum $5000 recommended)'
      });
    }

    const order = await exchangeService.exchange.createMarketOrder(
      pair,
      'buy',
      testAmount
    );

    res.json({
      success: true,
      orderId: order.id,
      amount: testAmount,
      message: 'Test order placed successfully'
    });

  } catch (error) {
    console.error('Test order error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

module.exports = router;