
const express = require('express');
const router = express.Router();
const ExchangeService = require('../services/ExchangeService');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Global exchange service instance
const exchangeService = new ExchangeService();

// Connect to exchange
router.post('/connect', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || !user.trading.apiKey || !user.trading.apiSecret) {
      return res.status(400).json({ 
        message: 'API keys not configured. Please set them in Settings.' 
      });
    }

    const result = await exchangeService.connect(
      user.trading.apiKey,
      user.trading.apiSecret
    );

    res.json({
      success: true,
      balance: result.balance,
      message: 'Connected to exchange successfully'
    });

  } catch (error) {
    console.error('Exchange connection error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Start trading
router.post('/start', auth, async (req, res) => {
  try {
    const { pair, strategy } = req.body;
    
    if (!pair || !strategy) {
      return res.status(400).json({ 
        message: 'Trading pair and strategy are required' 
      });
    }

    // Valid strategies
    if (!['steady_climb', 'power_surge'].includes(strategy)) {
      return res.status(400).json({ 
        message: 'Invalid strategy. Use steady_climb or power_surge' 
      });
    }

    // Valid pairs
    const validPairs = ['HYPE/USDT', 'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'ADA/USDT', 'XRP/USDT'];
    if (!validPairs.includes(pair)) {
      return res.status(400).json({ 
        message: 'Invalid trading pair' 
      });
    }

    console.log(`🚀 Starting live trading: ${strategy} on ${pair}`);

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
    const balance = await exchangeService.getAccountBalance();
    const positions = await exchangeService.getActivePositions();

    res.json({
      success: true,
      isTrading: isTrading,
      balance: balance,
      activePositions: positions.length,
      positions: positions,
      userStrategy: user.trading.strategy,
      userPair: user.trading.tradingPair
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
    const balance = await exchangeService.getAccountBalance();
    
    res.json({
      success: true,
      balance: balance,
      currency: 'USDT'
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
    
    console.log(`🧪 Placing test order for ${pair}`);
    
    // Place tiny test order (0.01% of balance)
    const balance = await exchangeService.getAccountBalance();
    const testAmount = balance * 0.0001; // 0.01% for testing
    
    if (testAmount < 5) {
      return res.status(400).json({
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