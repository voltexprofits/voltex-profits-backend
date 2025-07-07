
const ccxt = require('ccxt');

class ExchangeService {
  constructor() {
    this.exchange = null;
    this.isConnected = false;
    this.activeStrategies = new Map();
    
    // Your exact Martingale strategies
    this.STRATEGIES = {
      steady_climb: {
        name: "Steady Climb",
        capitalBase: 0.1, // 0.1% of balance
        leverage: 25,
        martingaleMultipliers: [0.25, 0.27, 0.36, 0.47, 0.63, 0.83, 1.08, 1.43, 1.88, 2.47, 3.25, 4.30, 5.68, 7.51, 9.93],
        maxLevels: 15
      },
      power_surge: {
        name: "Power Surge",
        capitalBase: 0.1, // 0.1% of balance
        leverage: 25,
        martingaleMultipliers: [0.40, 0.54, 0.72, 0.94, 1.26, 1.66, 2.16, 2.86, 3.76, 4.94, 6.50, 8.60, 11.36, 15.02, 19.86],
        maxLevels: 15
      }
    };
  }

  async connect(apiKey, apiSecret) {
    try {
      this.exchange = new ccxt.bybit({
        apiKey: apiKey,
        secret: apiSecret,
        sandbox: false, // LIVE TRADING
        options: {
          defaultType: 'future', // Futures trading with leverage
          unified: true // Use unified trading account
        }
      });

      // Test connection
      const balance = await this.exchange.fetchBalance();
      this.isConnected = true;
      
      console.log('✅ Connected to Bybit live account');
      console.log('💰 USDT Balance:', balance.USDT?.total || 0);
      
      return {
        success: true,
        balance: balance.USDT?.total || 0
      };
    } catch (error) {
      console.error('❌ Exchange connection failed:', error);
      this.isConnected = false;
      throw new Error(`API Connection Failed: ${error.message}`);
    }
  }

  async getAccountBalance() {
    try {
      const balance = await this.exchange.fetchBalance();
      return balance.USDT?.total || 0;
    } catch (error) {
      console.error('❌ Failed to get balance:', error);
      throw error;
    }
  }

  calculatePositionSize(accountBalance, level, strategy) {
    const baseAmount = accountBalance * (this.STRATEGIES[strategy].capitalBase / 100);
    const multiplier = this.STRATEGIES[strategy].martingaleMultipliers[level - 1];
    return baseAmount * multiplier;
  }

  async setLeverage(symbol, leverage) {
    try {
      await this.exchange.setLeverage(leverage, symbol);
      console.log(`✅ Set leverage to ${leverage}x for ${symbol}`);
    } catch (error) {
      console.error(`❌ Failed to set leverage for ${symbol}:`, error);
    }
  }

  async placeMartingaleOrder(symbol, strategy, level = 1, side = 'buy') {
    try {
      if (!this.isConnected) {
        throw new Error('Not connected to exchange');
      }

      // Get current balance
      const accountBalance = await this.getAccountBalance();
      
      // Calculate position size using your exact formula
      const positionSize = this.calculatePositionSize(accountBalance, level, strategy);
      
      // Set leverage first
      await this.setLeverage(symbol, this.STRATEGIES[strategy].leverage);
      
      // Get minimum order size for the symbol
      const markets = await this.exchange.loadMarkets();
      const market = markets[symbol];
      const minOrderSize = market.limits.amount.min;
      
      // Ensure position size meets minimum requirements
      if (positionSize < minOrderSize) {
        throw new Error(`Position size $${positionSize} too small. Min: $${minOrderSize}`);
      }

      console.log(`🚀 Placing ${strategy} order:`);
      console.log(`   Symbol: ${symbol}`);
      console.log(`   Level: ${level}`);
      console.log(`   Position Size: $${positionSize.toFixed(2)}`);
      console.log(`   Account Balance: $${accountBalance.toFixed(2)}`);

      // Place the market order
      const order = await this.exchange.createMarketOrder(
        symbol,
        side,
        positionSize,
        null, // price (null for market order)
        null, // amount in quote currency
        {
          leverage: this.STRATEGIES[strategy].leverage,
          marginMode: 'isolated', // Use isolated margin
          timeInForce: 'IOC' // Immediate or Cancel
        }
      );

      console.log('✅ Order placed successfully:', order.id);
      
      return {
        success: true,
        orderId: order.id,
        symbol: symbol,
        side: side,
        amount: positionSize,
        level: level,
        strategy: strategy,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('❌ Order placement failed:', error);
      throw new Error(`Order Failed: ${error.message}`);
    }
  }

  async closePosition(symbol) {
    try {
      // Get current position
      const positions = await this.exchange.fetchPositions([symbol]);
      const position = positions.find(p => p.symbol === symbol && p.size > 0);
      
      if (!position) {
        console.log(`ℹ️ No open position for ${symbol}`);
        return { success: true, message: 'No position to close' };
      }

      // Close the position with market order
      const side = position.side === 'long' ? 'sell' : 'buy';
      const order = await this.exchange.createMarketOrder(
        symbol,
        side,
        position.size,
        null,
        null,
        { reduceOnly: true }
      );

      console.log(`✅ Position closed for ${symbol}:`, order.id);
      
      return {
        success: true,
        orderId: order.id,
        closedSize: position.size,
        pnl: position.unrealizedPnl
      };

    } catch (error) {
      console.error('❌ Failed to close position:', error);
      throw error;
    }
  }

  async getActivePositions() {
    try {
      const positions = await this.exchange.fetchPositions();
      return positions.filter(p => p.size > 0);
    } catch (error) {
      console.error('❌ Failed to get positions:', error);
      return [];
    }
  }

  async startMartingaleStrategy(symbol, strategyType) {
    try {
      console.log(`🎯 Starting ${strategyType} strategy for ${symbol}`);
      
      // Place initial order (Level 1)
      const result = await this.placeMartingaleOrder(symbol, strategyType, 1, 'buy');
      
      // Store strategy state
      this.activeStrategies.set(symbol, {
        strategy: strategyType,
        currentLevel: 1,
        orderId: result.orderId,
        startTime: new Date(),
        isActive: true
      });

      return result;
    } catch (error) {
      console.error('❌ Failed to start strategy:', error);
      throw error;
    }
  }

  async stopAllStrategies() {
    try {
      console.log('🛑 Stopping all trading strategies...');
      
      // Close all open positions
      const positions = await this.getActivePositions();
      const closePromises = positions.map(pos => this.closePosition(pos.symbol));
      
      await Promise.all(closePromises);
      
      // Clear active strategies
      this.activeStrategies.clear();
      
      console.log('✅ All strategies stopped and positions closed');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to stop strategies:', error);
      throw error;
    }
  }

  // Risk management - Emergency stop
  async emergencyStop() {
    try {
      console.log('🚨 EMERGENCY STOP ACTIVATED');
      await this.stopAllStrategies();
      return { success: true, message: 'Emergency stop completed' };
    } catch (error) {
      console.error('❌ Emergency stop failed:', error);
      throw error;
    }
  }

  // Get strategy status
  getStrategyStatus(symbol) {
    return this.activeStrategies.get(symbol) || null;
  }

  // Check if trading is active
  isTrading() {
    return this.activeStrategies.size > 0;
  }
}

module.exports = ExchangeService;