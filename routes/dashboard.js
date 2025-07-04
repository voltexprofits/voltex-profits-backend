
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Trade = require('../models/Trade');
const auth = require('../middleware/auth');

// Get user dashboard data
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate today's P&L
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const todayTrades = await Trade.find({
      userId: req.user.id,
      timestamp: { $gte: startOfDay },
      status: 'filled'
    });

    const dailyPnL = todayTrades.reduce((total, trade) => {
      return total + (trade.profit - trade.loss);
    }, 0);

    // Get recent trades (last 10)
    const recentTrades = await Trade.find({
      userId: req.user.id
    })
    .sort({ timestamp: -1 })
    .limit(10);

    // Calculate success rate
    const totalTrades = user.stats.totalTrades;
    const successfulTrades = user.stats.successfulTrades;
    const successRate = totalTrades > 0 ? (successfulTrades / totalTrades) * 100 : 0;

    res.json({
      user: {
        username: user.username,
        email: user.email,
        subscription: user.subscription,
        trading: user.trading,
        yieldWallet: user.yieldWallet,
        stats: {
          ...user.stats,
          successRate: successRate.toFixed(1),
          dailyPnL: dailyPnL.toFixed(2)
        }
      },
      recentTrades: recentTrades.map(trade => ({
        id: trade._id,
        pair: trade.symbol,
        side: trade.side.toUpperCase(),
        amount: trade.quantity,
        price: trade.price,
        profit: (trade.profit - trade.loss).toFixed(2),
        time: getTimeAgo(trade.timestamp),
        status: trade.status
      }))
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update trading settings
router.put('/trading/settings', auth, async (req, res) => {
  try {
    const { tradingPair, strategy, isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        'trading.tradingPair': tradingPair,
        'trading.strategy': strategy,
        'trading.isActive': isActive
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If trading is being activated, add user to bot
    if (isActive && !user.trading.isActive) {
      const TradingBot = require('../services/TradingBot');
      const bot = new TradingBot();
      await bot.addUser(req.user.id);
    }

    // If trading is being deactivated, remove user from bot
    if (!isActive && user.trading.isActive) {
      const TradingBot = require('../services/TradingBot');
      const bot = new TradingBot();
      bot.removeUser(req.user.id);
    }

    res.json({
      message: 'Trading settings updated successfully',
      trading: user.trading
    });

  } catch (error) {
    console.error('Error updating trading settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trading history with pagination
router.get('/trades', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const trades = await Trade.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const totalTrades = await Trade.countDocuments({ userId: req.user.id });
    const totalPages = Math.ceil(totalTrades / limit);

    res.json({
      trades: trades.map(trade => ({
        id: trade._id,
        symbol: trade.symbol,
        side: trade.side,
        quantity: trade.quantity,
        entryPrice: trade.entryPrice,
        exitPrice: trade.exitPrice,
        profit: trade.profit,
        loss: trade.loss,
        status: trade.status,
        martingaleLevel: trade.martingaleLevel,
        strategy: trade.strategy,
        timestamp: trade.timestamp,
        pnl: (trade.profit - trade.loss).toFixed(2)
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalTrades,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get performance analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let startDate = new Date();
    switch (period) {
      case '24h':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    const trades = await Trade.find({
      userId: req.user.id,
      timestamp: { $gte: startDate },
      status: 'filled'
    }).sort({ timestamp: 1 });

    // Group trades by day
    const dailyData = {};
    trades.forEach(trade => {
      const date = trade.timestamp.toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          trades: 0,
          profit: 0,
          loss: 0,
          volume: 0
        };
      }
      
      dailyData[date].trades += 1;
      dailyData[date].profit += trade.profit;
      dailyData[date].loss += trade.loss;
      dailyData[date].volume += trade.quantity * trade.price;
    });

    const chartData = Object.values(dailyData).map(day => ({
      ...day,
      pnl: day.profit - day.loss,
      cumulative: 0 // Will be calculated below
    }));

    // Calculate cumulative P&L
    let cumulative = 0;
    chartData.forEach(day => {
      cumulative += day.pnl;
      day.cumulative = cumulative;
    });

    res.json({
      period,
      chartData,
      summary: {
        totalTrades: trades.length,
        totalProfit: trades.reduce((sum, t) => sum + t.profit, 0),
        totalLoss: trades.reduce((sum, t) => sum + t.loss, 0),
        winRate: trades.length > 0 ? 
          (trades.filter(t => t.profit > t.loss).length / trades.length) * 100 : 0,
        avgTradeSize: trades.length > 0 ? 
          trades.reduce((sum, t) => sum + (t.quantity * t.price), 0) / trades.length : 0
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Deposit to yield wallet
router.post('/yield-wallet/deposit', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid deposit amount' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: {
          'yieldWallet.balance': amount,
          'yieldWallet.totalDeposited': amount
        }
      },
      { new: true }
    );

    res.json({
      message: 'Deposit successful',
      yieldWallet: user.yieldWallet
    });

  } catch (error) {
    console.error('Error processing deposit:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

module.exports = router;