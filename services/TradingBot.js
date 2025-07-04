
const ccxt = require('ccxt');
const cron = require('node-cron');
const User = require('../models/User');
const Trade = require('../models/Trade');

class TradingBot {
  constructor() {
    // Your Martingale strategies
    this.strategies = {
      steady_climb: [0.25, 0.27, 0.36, 0.47, 0.63, 0.83, 1.08, 1.43, 1.88, 2.47, 3.25, 4.30, 5.68, 7.51, 9.93],
      power_surge: [0.40, 0.54, 0.72, 0.94, 1.26, 1.66, 2.16, 2.86, 3.76, 4.94, 6.50, 8.60, 11.36, 15.02, 19.86]
    };
    
    this.baseRiskPercent = 0.2; // 0.2% of account balance
    this.leverage = 25;
    this.exchanges = {};
    this.activeUsers = new Map();
  }

  // Initialize the bot
  async initialize() {
    console.log('🚀 Voltex Profits Trading Bot initializing...');
    
    try {
      // Load active users
      await this.loadActiveUsers();
      
      // Start trading loop (every 5 minutes)
      cron.schedule('*/5 * * * *', () => {
        this.runTradingLoop();
      });

      // Daily profit sharing calculation (every day at midnight)
      cron.schedule('0 0 * * *', () => {
        this.calculateDailyProfitSharing();
      });

      console.log('✅ Voltex Profits Trading Bot initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing trading bot:', error);
    }
  }

  // Load all active users
  async loadActiveUsers() {
    try {
      const users = await User.find({ 
        'trading.isActive': true,
        'subscription.endDate': { $gt: new Date() }
      });

      for (const user of users) {
        await this.setupUserExchange(user);
      }

      console.log(`📊 Loaded ${users.length} active users`);
    } catch (error) {
      console.error('Error loading active users:', error);
    }
  }

  // Setup exchange connection for user
  async setupUserExchange(user) {
    try {
      const { exchange, apiKey, apiSecret, testnet } = user.trading;
      
      let exchangeClass;
      switch (exchange) {
        case 'bybit':
          exchangeClass = ccxt.bybit;
          break;
        case 'binance':
          exchangeClass = ccxt.binance;
          break;
        case 'bitget':
          exchangeClass = ccxt.bitget;
          break;
        default:
          throw new Error(`Unsupported exchange: ${exchange}`);
      }

      const exchangeInstance = new exchangeClass({
        apiKey: apiKey,
        secret: apiSecret,
        sandbox: testnet,
        options: {
          defaultType: 'future'
        }
      });

      this.exchanges[user._id] = exchangeInstance;
      this.activeUsers.set(user._id.toString(), user);
      
      console.log(`✅ Setup exchange for ${user.username} on ${exchange}`);
    } catch (error) {
      console.error(`❌ Error setting up exchange for ${user.username}:`, error);
    }
  }

  // Main trading loop
  async runTradingLoop() {
    console.log('🔄 Running trading loop...');
    
    for (const [userId, user] of this.activeUsers) {
      try {
        await this.processUserTrades(userId, user);
      } catch (error) {
        console.error(`❌ Error processing trades for ${user.username}:`, error);
      }
    }
  }

  // Process trades for a specific user
  async processUserTrades(userId, user) {
    const exchange = this.exchanges[userId];
    if (!exchange) return;

    try {
      // Get account balance
      const balance = await this.getAccountBalance(exchange);
      
      // Update user balance in database
      await User.findByIdAndUpdate(userId, {
        'trading.accountBalance': balance
      });

      // Calculate trade size based on current martingale level
      const tradeSize = this.calculateTradeSize(balance, user.stats.currentMartingaleLevel, user.trading.strategy);
      
      // Check if we have enough balance for minimum trade
      if (tradeSize < 5) { // Minimum $5 with 25x leverage
        console.log(`⚠️ User ${user.username} has insufficient balance for trading`);
        return;
      }

      // Execute trade
      await this.executeTrade(exchange, userId, tradeSize, user);

    } catch (error) {
      console.error(`❌ Error in processUserTrades for ${user.username}:`, error);
    }
  }

  // Calculate trade size based on martingale level
  calculateTradeSize(balance, martingaleLevel, strategy) {
    const baseAmount = (balance * this.baseRiskPercent) / 100;
    const multiplier = this.strategies[strategy][martingaleLevel] || 1;
    return baseAmount * multiplier;
  }

  // Get account balance from exchange
  async getAccountBalance(exchange) {
    try {
      const balance = await exchange.fetchBalance();
      return balance.USDT ? balance.USDT.free : 0;
    } catch (error) {
      console.error('❌ Error fetching balance:', error);
      return 0;
    }
  }

  // Execute a trade
  async executeTrade(exchange, userId, tradeSize, user) {
    try {
      const symbol = user.trading.tradingPair || 'BTC/USDT';
      const side = 'buy';
      const type = 'market';
      
      // Calculate quantity with leverage
      const quantity = tradeSize * this.leverage;
      
      console.log(`🔄 Executing trade for ${user.username}: ${side} ${quantity} ${symbol}`);
      
      // For testing, we'll simulate the trade
      // In production, uncomment this line:
      // const order = await exchange.createOrder(symbol, type, side, quantity);
      
      // Simulated order for testing
      const order = {
        id: `test_${Date.now()}`,
        price: 43250, // Simulated price
        filled: quantity
      };
      
      // Save trade to database
      await this.saveTrade(userId, {
        symbol,
        side,
        quantity,
        price: order.price,
        orderId: order.id,
        martingaleLevel: user.stats.currentMartingaleLevel,
        strategy: user.trading.strategy,
        exchange: user.trading.exchange,
        entryPrice: order.price,
        margin: tradeSize,
        timestamp: new Date()
      });

      console.log(`✅ Trade executed for ${user.username}: ${side} ${quantity} ${symbol}`);
      
    } catch (error) {
      console.error('❌ Error executing trade:', error);
    }
  }

  // Save trade to database
  async saveTrade(userId, tradeData) {
    try {
      const trade = new Trade({
        userId,
        ...tradeData
      });
      
      await trade.save();
      
      // Update user stats
      await User.findByIdAndUpdate(userId, {
        $inc: { 'stats.totalTrades': 1 }
      });
      
      console.log(`💾 Trade saved for user ${userId}`);
      
    } catch (error) {
      console.error('❌ Error saving trade:', error);
    }
  }

  // Calculate daily profit sharing (25% to platform)
  async calculateDailyProfitSharing() {
    console.log('💰 Calculating daily profit sharing...');
    
    for (const [userId, user] of this.activeUsers) {
      try {
        // Get today's profits
        const dailyProfit = await this.calculateDailyProfit(userId);
        
        if (dailyProfit > 0) {
          const profitShare = dailyProfit * 0.25; // 25% profit sharing
          
          // Update user's yield wallet
          await User.findByIdAndUpdate(userId, {
            $inc: { 
              'yieldWallet.balance': -profitShare,
              'stats.dailyProfitSharing': profitShare
            }
          });
          
          console.log(`💰 Profit sharing for ${user.username}: $${profitShare.toFixed(2)}`);
        }
      } catch (error) {
        console.error(`❌ Error calculating profit sharing for ${user.username}:`, error);
      }
    }
  }

  // Calculate daily profit for a user
  async calculateDailyProfit(userId) {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      
      const trades = await Trade.find({
        userId,
        timestamp: { $gte: startOfDay },
        status: 'filled'
      });
      
      return trades.reduce((total, trade) => total + (trade.profit || 0), 0);
    } catch (error) {
      console.error('❌ Error calculating daily profit:', error);
      return 0;
    }
  }

  // Add a new user to active trading
  async addUser(userId) {
    try {
      const user = await User.findById(userId);
      if (user && user.trading.isActive) {
        await this.setupUserExchange(user);
        console.log(`✅ Added user ${user.username} to active trading`);
      }
    } catch (error) {
      console.error('❌ Error adding user to trading:', error);
    }
  }

  // Remove user from active trading
  removeUser(userId) {
    this.activeUsers.delete(userId);
    delete this.exchanges[userId];
    console.log(`❌ Removed user from active trading`);
  }
}

module.exports = TradingBot;