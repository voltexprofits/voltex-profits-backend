
const ccxt = require('ccxt');

class ExchangeService {
  constructor() {
    this.exchange = null;
    this.isConnected = false;
    this.tradingActive = false;
    this.activeStrategies = new Map();

    this.STRATEGIES = {
      steady_climb: {
        name: "Steady Climb",
        capitalBase: 0.001,
        leverage: 25,
        martingaleMultipliers: [0.25, 0.27, 0.36, 0.47, 0.63, 0.83, 1.08, 1.43, 1.88, 2.47, 3.25, 4.30, 5.68, 7.51, 9.93],
        maxLevels: 15,
        type: "conservative"
      },
      power_surge: {
        name: "Power Surge",
        capitalBase: 0.001,
        leverage: 25,
        martingaleMultipliers: [0.40, 0.54, 0.72, 0.94, 1.26, 1.66, 2.16, 2.86, 3.76, 4.94, 6.50, 8.60, 11.36, 15.02, 19.86],
        maxLevels: 15,
        type: "aggressive"
      }
    };
  }

  async connect(apiKey, apiSecret, exchangeName = 'bybit', passphrase = null) {
    try {
      console.log(`🔗 Connecting to ${exchangeName}...`);

      switch (exchangeName.toLowerCase()) {
        case 'bybit':
          this.exchange = new ccxt.bybit({
            apiKey,
            secret: apiSecret,
            enableRateLimit: true,
            options: {
              defaultType: 'future',
              unified: true
            },
            urls: {
              api: {
                public: 'https://api-testnet.bybit.com',
                private: 'https://api-testnet.bybit.com',
              }
            }
          });
          break;

        case 'binance':
          this.exchange = new ccxt.binance({
            apiKey,
            secret: apiSecret,
            enableRateLimit: true,
            options: {
              defaultType: 'future'
            }
          });
          break;

        case 'bitget':
          this.exchange = new ccxt.bitget({
            apiKey,
            secret: apiSecret,
            password: passphrase || '',
            enableRateLimit: true,
            options: {
              defaultType: 'swap'
            }
          });
          break;

        case 'okx':
          this.exchange = new ccxt.okx({
            apiKey,
            secret: apiSecret,
            password: passphrase || '',
            enableRateLimit: true,
            options: {
              defaultType: 'swap'
            }
          });
          break;

        default:
          throw new Error(`Unsupported exchange: ${exchangeName}`);
      }

      const balance = await this.exchange.fetchBalance();

      if (!balance) throw new Error('Failed to fetch account balance');

      this.isConnected = true;
      console.log(`✅ Connected to ${exchangeName}`);
      console.log('💰 USDT Balance:', balance.USDT?.total || 0);

      return {
        success: true,
        balance: balance.USDT?.total || 0,
        exchange: exchangeName
      };
    } catch (error) {
      console.error(`❌ Exchange connection error:`, error);
      this.isConnected = false;

      let message = error.message;
      if (message.includes('Invalid API') || message.includes('Invalid key')) {
        message = 'Invalid API credentials. Please check your API key and secret.';
      } else if (message.includes('IP') || message.includes('not in whitelist')) {
        message = 'IP address not whitelisted. Please add your server IP to the API whitelist.';
      } else if (message.includes('permission')) {
        message = 'Insufficient API permissions. Please enable trading and balance access.';
      }

      throw new Error(message);
    }
  }

  async getAccountBalance() {
    if (!this.isConnected || !this.exchange) {
      throw new Error('Exchange not connected');
    }

    try {
      const balance = await this.exchange.fetchBalance();
      return balance.USDT?.total || 0;
    } catch (error) {
      console.error('❌ Failed to get balance:', error);
      throw new Error('Failed to fetch account balance');
    }
  }

  calculatePositionSize(accountBalance, level, strategy) {
    const baseAmount = accountBalance * this.STRATEGIES[strategy].capitalBase;
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
      if (!this.isConnected) throw new Error('Not connected to exchange');

      const accountBalance = await this.getAccountBalance();
      const positionSize = this.calculatePositionSize(accountBalance, level, strategy);

      await this.setLeverage(symbol, this.STRATEGIES[strategy].leverage);

      const markets = await this.exchange.loadMarkets();
      const market = markets[symbol];
      const minOrderSize = market.limits.amount.min;

      if (positionSize < minOrderSize) {
        throw new Error(`Position size ${positionSize} too small. Min: ${minOrderSize}`);
      }

      console.log(`🚀 Placing ${strategy} order:\nSymbol: ${symbol}\nLevel: ${level}\nPosition Size: ${positionSize.toFixed(2)}`);

      const order = await this.exchange.createMarketOrder(
        symbol,
        side,
        positionSize,
        null,
        null,
        {
          leverage: this.STRATEGIES[strategy].leverage,
          marginMode: 'isolated',
          timeInForce: 'IOC'
        }
      );

      console.log('✅ Order placed successfully:', order.id);

      return {
        success: true,
        orderId: order.id,
        symbol,
        side,
        amount: positionSize,
        level,
        strategy,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('❌ Order placement failed:', error);
      throw new Error(`Order Failed: ${error.message}`);
    }
  }

  async closePosition(symbol) {
    try {
      const positions = await this.exchange.fetchPositions([symbol]);
      const position = positions.find(p => p.symbol === symbol && p.size > 0);

      if (!position) {
        console.log(`ℹ️ No open position for ${symbol}`);
        return { success: true, message: 'No position to close' };
      }

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
    if (!this.isConnected || !this.exchange) {
      throw new Error('Exchange not connected');
    }

    try {
      const positions = await this.exchange.fetchPositions();
      return positions.filter(position => position.contracts > 0);
    } catch (error) {
      console.error('❌ Failed to get positions:', error);
      return [];
    }
  }

  async startMartingaleStrategy(symbol, strategyType) {
    try {
      console.log(`🎯 Starting ${strategyType} strategy for ${symbol}`);

      const result = await this.placeMartingaleOrder(symbol, strategyType, 1, 'buy');

      this.activeStrategies.set(symbol, {
        strategy: strategyType,
        currentLevel: 1,
        orderId: result.orderId,
        startTime: new Date(),
        isActive: true
      });

      this.tradingActive = true;
      return result;
    } catch (error) {
      console.error('❌ Failed to start strategy:', error);
      throw error;
    }
  }

  async stopAllStrategies() {
    try {
      console.log('🛑 Stopping all trading strategies...');

      const positions = await this.getActivePositions();
      const closePromises = positions.map(pos => this.closePosition(pos.symbol));

      await Promise.all(closePromises);

      this.activeStrategies.clear();
      this.tradingActive = false;

      console.log('✅ All strategies stopped and positions closed');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to stop strategies:', error);
      throw error;
    }
  }

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

  getStrategyStatus(symbol) {
    return this.activeStrategies.get(symbol) || null;
  }

  isTrading() {
    return this.tradingActive && this.activeStrategies.size > 0;
  }

  getConnectedExchange() {
    return this.exchange ? this.exchange.id : null;
  }
}

module.exports = ExchangeService;
