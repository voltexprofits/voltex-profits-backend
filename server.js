const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use(limiter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/voltex-profits', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Database connected successfully');
}).catch((err) => {
  console.log('⚠️ Database connection failed (this is OK for now):', err.message);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/trading', require('./routes/trading'));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Voltex Profits API is running!',
    version: '1.0.0',
    features: ['Steady Climb Strategy', 'Power Surge Strategy', '25x Leverage', 'Yield Wallet']
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Voltex Profits server running on http://localhost:${PORT}`);
  console.log('💰 Features: Martingale Trading, $15/month, 2-week free trial');
});

// Initialize trading bot
const TradingBot = require('./services/TradingBot');
const bot = new TradingBot();
bot.initialize();