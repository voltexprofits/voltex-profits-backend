
const ccxt = require('ccxt');

class ExchangeService {
  constructor() {
    this.exchange = null;
    this.isConnected = false;
    this.tradingActive = false;
    this.activeStrategies = new Map();

    // Your Martingale strategies
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
        message = 'IP address not whitelisted. Please remove IP restriction in your API settings.';
      } else if (message.includes('permission')) {
        message = 'Insufficient API permissions. Please enable Contract Trading and Read Position.';
      }

      throw new Error(message);
    }
  }

  // The rest of the file (getAccountBalance, placeOrder, etc.) remains unchanged
  // You can paste your existing methods below or keep them as-is
}

module.exports = ExchangeService;
