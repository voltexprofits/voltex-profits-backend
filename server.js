
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(cors({
  origin: ['https://www.voltexprofits.com', 'https://voltexprofits.com', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/voltex-profits', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Database connected successfully');
}).catch((err) => {
  console.log('⚠️ Database connection failed:', err.message);
});

// Routes - Only include files that actually exist
try {
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded');
} catch (error) {
  console.log('⚠️ Auth routes not found - creating basic auth endpoint');
  app.post('/api/auth/login', (req, res) => {
    res.json({ success: false, message: 'Auth service not configured yet' });
  });
}

try {
  const tradingRoutes = require('./routes/trading');
  app.use('/api/trading', tradingRoutes);
  console.log('✅ Trading routes loaded');
} catch (error) {
  console.log('❌ Trading routes not found:', error.message);
}

// Optional routes - only load if they exist
try {
  const dashboardRoutes = require('./routes/dashboard');
  app.use('/api/dashboard', dashboardRoutes);
  console.log('✅ Dashboard routes loaded');
} catch (error) {
  console.log('⚠️ Dashboard routes not found - skipping');
}

try {
  const paymentRoutes = require('./routes/payments');
  app.use('/api/payments', paymentRoutes);
  console.log('✅ Payment routes loaded');
} catch (error) {
  console.log('⚠️ Payment routes not found - skipping');
}

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Voltex Profits API is running!',
    version: '1.0.0',
    features: ['Steady Climb Strategy', 'Power Surge Strategy', '25x Leverage', 'Live Trading'],
    exchanges: ['OKX', 'Bybit', 'Binance', 'Bitget'],
    status: 'LIVE TRADING READY',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint for frontend
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Backend API is working!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: ['/api/auth', '/api/trading', '/health', '/api/test']
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Voltex Profits server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('💰 Features: Live Martingale Trading with OKX/Bybit/Binance/Bitget');
  console.log('🔴 LIVE TRADING MODE - Ready for real money!');
});

// Note: TradingBot removed - using ExchangeService instead
console.log('🎯 Server initialized - Ready for live trading connections!');