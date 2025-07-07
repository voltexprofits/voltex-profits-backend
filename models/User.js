
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  
  // Subscription details
  subscription: {
    plan: {
      type: String,
      enum: ['free_trial', 'premium'],
      default: 'free_trial'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 2 weeks
    },
    trialUsed: {
      type: Boolean,
      default: false
    },
    stripeCustomerId: String,
    subscriptionId: String
  },

  // Trading configuration - UPDATED SECTION
  trading: {
    exchange: {
      type: String,
      enum: ['bybit', 'binance', 'bitget'],
      required: false // Changed to false since users start without API keys
    },
    strategy: {
      type: String,
      enum: ['steady_climb', 'power_surge'],
      default: 'steady_climb'
    },
    tradingPair: {
      type: String,
      default: 'BTC/USDT'
    },
    accountBalance: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: false
    },
    apiKey: {
      type: String,
      required: false // Changed to false since users start without API keys
    },
    apiSecret: {
      type: String,
      required: false // Changed to false since users start without API keys
    },
    passphrase: {  // NEW: For Bitget exchange
      type: String,
      required: false
    },
    connected: {   // NEW: Track if API is connected
      type: Boolean,
      default: false
    },
    lastConnected: { // NEW: When API was last connected
      type: Date
    },
    lastTradeTime: {  // NEW: When last trade was executed
      type: Date
    },
    testnet: {
      type: Boolean,
      default: true
    }
  },

  // Yield Wallet (profit sharing)
  yieldWallet: {
    balance: {
      type: Number,
      default: 0
    },
    totalDeposited: {
      type: Number,
      default: 0
    },
    totalWithdrawn: {
      type: Number,
      default: 0
    }
  },

  // Trading statistics
  stats: {
    totalTrades: {
      type: Number,
      default: 0
    },
    successfulTrades: {
      type: Number,
      default: 0
    },
    totalProfit: {
      type: Number,
      default: 0
    },
    totalLoss: {
      type: Number,
      default: 0
    },
    currentMartingaleLevel: {
      type: Number,
      default: 0
    },
    dailyProfitSharing: {
      type: Number,
      default: 0
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update timestamp
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', UserSchema);