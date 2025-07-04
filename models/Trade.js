
const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Trade details
  symbol: {
    type: String,
    required: true
  },
  side: {
    type: String,
    enum: ['buy', 'sell'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  
  // Order information
  orderId: {
    type: String,
    required: true
  },
  exchange: {
    type: String,
    enum: ['bybit', 'binance', 'bitget'],
    required: true
  },
  
  // Strategy information
  strategy: {
    type: String,
    enum: ['steady_climb', 'power_surge'],
    required: true
  },
  martingaleLevel: {
    type: Number,
    required: true,
    min: 0,
    max: 14
  },
  
  // Trade status
  status: {
    type: String,
    enum: ['pending', 'filled', 'cancelled', 'failed'],
    default: 'pending'
  },
  
  // Financial details
  entryPrice: {
    type: Number,
    required: true
  },
  exitPrice: {
    type: Number,
    default: null
  },
  profit: {
    type: Number,
    default: 0
  },
  loss: {
    type: Number,
    default: 0
  },
  fees: {
    type: Number,
    default: 0
  },
  
  // Leverage and margin
  leverage: {
    type: Number,
    default: 25
  },
  margin: {
    type: Number,
    required: true
  },
  
  // Timing
  timestamp: {
    type: Date,
    default: Date.now
  },
  filledAt: {
    type: Date,
    default: null
  },
  closedAt: {
    type: Date,
    default: null
  }
});

// Index for efficient queries
TradeSchema.index({ userId: 1, timestamp: -1 });
TradeSchema.index({ symbol: 1, timestamp: -1 });
TradeSchema.index({ strategy: 1, martingaleLevel: 1 });

// Calculate profit/loss when trade is closed
TradeSchema.methods.calculatePnL = function() {
  if (this.exitPrice && this.entryPrice) {
    const priceDifference = this.exitPrice - this.entryPrice;
    const grossProfit = (priceDifference * this.quantity) - this.fees;
    
    if (grossProfit > 0) {
      this.profit = grossProfit;
      this.loss = 0;
    } else {
      this.profit = 0;
      this.loss = Math.abs(grossProfit);
    }
  }
  return this.profit - this.loss;
};

module.exports = mongoose.model('Trade', TradeSchema);