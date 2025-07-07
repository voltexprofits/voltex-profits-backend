
import React, { useState, useEffect } from 'react';

function LiveTradingPage({ user, onTradingStatusChange }) {
  const [isTrading, setIsTrading] = useState(false);
  const [selectedPair, setSelectedPair] = useState('HYPE/USDT');
  const [selectedStrategy, setSelectedStrategy] = useState('steady_climb');
  const [accountBalance] = useState(12450.75); // Simulated exchange balance

  // YOUR EXACT LOCKED MARTINGALE STRATEGIES
  const STRATEGIES = {
    steady_climb: {
      name: "Steady Climb",
      description: "Conservative martingale with capital preservation focus",
      icon: "🛡️",
      capitalBase: 0.1, // 0.1% of account balance
      leverage: 25,
      martingaleMultipliers: [0.25, 0.27, 0.36, 0.47, 0.63, 0.83, 1.08, 1.43, 1.88, 2.47, 3.25, 4.30, 5.68, 7.51, 9.93],
      maxLevels: 15,
      expectedMonthly: "8-15%",
      riskLevel: "Conservative",
      color: "#10b981",
      totalMaxRisk: 17.5 // % of capital base
    },
    
    power_surge: {
      name: "Power Surge", 
      description: "Aggressive martingale with rapid recovery system",
      icon: "🚀",
      capitalBase: 0.1, // 0.1% of account balance
      leverage: 25,
      martingaleMultipliers: [0.40, 0.54, 0.72, 0.94, 1.26, 1.66, 2.16, 2.86, 3.76, 4.94, 6.50, 8.60, 11.36, 15.02, 19.86],
      maxLevels: 15,
      expectedMonthly: "20-35%",
      riskLevel: "Aggressive", 
      color: "#f59e0b",
      totalMaxRisk: 30.0 // % of capital base
    }
  };

  const tradingPairs = [
    { symbol: 'HYPE/USDT', price: 12.45, change: 8.75, volume: '45.2M', color: '#FF6B6B' },
    { symbol: 'BTC/USDT', price: 69850.00, change: 3.2, volume: '890.5M', color: '#F7931A' },
    { symbol: 'ETH/USDT', price: 3924.60, change: 2.8, volume: '654.8M', color: '#627EEA' },
    { symbol: 'BNB/USDT', price: 634.80, change: 1.9, volume: '298.4M', color: '#F3BA2F' },
    { symbol: 'SOL/USDT', price: 148.90, change: 4.1, volume: '456.7M', color: '#9945FF' },
    { symbol: 'ADA/USDT', price: 0.4389, change: -0.8, volume: '234.5M', color: '#0033AD' },
    { symbol: 'XRP/USDT', price: 0.6445, change: 1.3, volume: '567.2M', color: '#23292F' }
  ];

  const [activePositions] = useState([
    {
      id: 1,
      pair: 'HYPE/USDT',
      strategy: 'Power Surge',
      level: 1,
      entryPrice: 12.30,
      currentPrice: 12.45,
      size: '$49.84',
      pnl: 81.58,
      pnlPercent: 9.8,
      duration: '2h 15m'
    },
    {
      id: 2,
      pair: 'BTC/USDT', 
      strategy: 'Steady Climb',
      level: 2,
      entryPrice: 68450.00,
      currentPrice: 69850.00,
      size: '$33.61',
      pnl: 45.23,
      pnlPercent: 2.1,
      duration: '4h 32m'
    }
  ]);

  // Calculate position sizes for display
  const calculatePositionSize = (level, strategy) => {
    const baseAmount = accountBalance * (STRATEGIES[strategy].capitalBase / 100);
    const multiplier = STRATEGIES[strategy].martingaleMultipliers[level - 1];
    return baseAmount * multiplier;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleToggleTrading = async () => {
    const newTradingStatus = !isTrading;
    
    try {
      if (newTradingStatus) {
        // Starting trading - call backend API
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://voltex-profits-backend.onrender.com'}/api/trading/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            pair: selectedPair,
            strategy: selectedStrategy
          })
        });

        const result = await response.json();

        if (result.success) {
          setIsTrading(true);
          if (onTradingStatusChange) {
            onTradingStatusChange(true);
          }
          alert(`🚀 LIVE TRADING STARTED!\n\nStrategy: ${STRATEGIES[selectedStrategy].name}\nPair: ${selectedPair}\nOrder ID: ${result.orderId}\nPosition Size: ${result.amount.toFixed(2)}\nLevel: ${result.level}\n\n⚠️ REAL MONEY IS NOW BEING TRADED!`);
        } else {
          throw new Error(result.message);
        }
      } else {
        // Stopping trading - call backend API
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://voltex-profits-backend.onrender.com'}/api/trading/stop`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const result = await response.json();

        if (result.success) {
          setIsTrading(false);
          if (onTradingStatusChange) {
            onTradingStatusChange(false);
          }
          alert('🛑 TRADING STOPPED!\n\nAll positions have been closed safely.\nReal trading has been terminated.');
        } else {
          throw new Error(result.message);
        }
      }
    } catch (error) {
      console.error('Trading toggle error:', error);
      alert(`❌ Trading ${newTradingStatus ? 'start' : 'stop'} failed:\n\n${error.message}\n\nPlease check your API configuration in Settings.`);
    }
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '30px'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#6B7280',
      fontSize: '16px'
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 350px',
      gap: '24px',
      marginBottom: '30px'
    },
    tradingControls: {
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      padding: '24px'
    },
    controlSection: {
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '6px'
    },
    select: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      background: 'white'
    },
    lockedInput: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      fontSize: '14px',
      background: '#f9fafb',
      color: '#6b7280',
      cursor: 'not-allowed'
    },
    lockedLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      color: '#64748b',
      marginTop: '4px'
    },
    strategyCard: {
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '16px',
      transition: 'all 0.2s',
      cursor: 'pointer'
    },
    strategyCardActive: {
      borderColor: '#3b82f6',
      background: '#eff6ff'
    },
    strategyHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px'
    },
    strategyIcon: {
      fontSize: '24px'
    },
    strategyName: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#1e293b'
    },
    strategyDescription: {
      fontSize: '12px',
      color: '#64748b',
      marginBottom: '12px'
    },
    strategyStats: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px',
      fontSize: '11px'
    },
    strategyStat: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    statLabel: {
      color: '#64748b'
    },
    statValue: {
      fontWeight: '500',
      color: '#1e293b'
    },
    tradingButton: {
      width: '100%',
      padding: '16px',
      fontSize: '18px',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginBottom: '16px'
    },
    startButton: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white'
    },
    stopButton: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white'
    },
    sidebar: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    accountInfo: {
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      padding: '20px'
    },
    balanceAmount: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '4px'
    },
    balanceLabel: {
      fontSize: '14px',
      color: '#64748b'
    },
    capitalBase: {
      background: '#f0fdf4',
      border: '1px solid #bbf7d0',
      borderRadius: '8px',
      padding: '12px',
      marginTop: '12px'
    },
    capitalBaseAmount: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#15803d'
    },
    capitalBaseLabel: {
      fontSize: '12px',
      color: '#15803d',
      marginTop: '2px'
    },
    marketData: {
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      padding: '20px'
    },
    pairList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      maxHeight: '300px',
      overflowY: 'auto'
    },
    pairItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 12px',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background 0.2s'
    },
    pairItemActive: {
      background: '#eff6ff',
      borderLeft: '3px solid #3b82f6'
    },
    pairSymbol: {
      fontWeight: '500',
      color: '#1e293b'
    },
    pairPrice: {
      fontSize: '12px',
      color: '#64748b'
    },
    pairChange: {
      fontSize: '12px',
      fontWeight: '500'
    },
    changePositive: {
      color: '#10b981'
    },
    changeNegative: {
      color: '#ef4444'
    },
    positionsContainer: {
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      padding: '24px'
    },
    positionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '16px'
    },
    positionCard: {
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px'
    },
    positionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px'
    },
    positionPair: {
      fontWeight: 'bold',
      color: '#1e293b'
    },
    positionLevel: {
      fontSize: '12px',
      padding: '2px 6px',
      background: '#f1f5f9',
      borderRadius: '4px',
      color: '#64748b'
    },
    positionStats: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px',
      fontSize: '12px'
    },
    positionStat: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    positionPnL: {
      fontSize: '16px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: '8px'
    },
    pnlPositive: {
      color: '#10b981'
    },
    pnlNegative: {
      color: '#ef4444'
    },
    martingaleDisplay: {
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px',
      marginTop: '16px'
    },
    martingaleTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    martingaleLevels: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '6px',
      fontSize: '10px'
    },
    martingaleLevel: {
      padding: '4px 6px',
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '4px',
      textAlign: 'center',
      color: '#64748b'
    },
    warningBox: {
      background: '#fef3c7',
      border: '1px solid #f59e0b',
      borderRadius: '8px',
      padding: '12px',
      marginTop: '16px'
    },
    warningText: {
      fontSize: '12px',
      color: '#92400e',
      fontWeight: '500'
    }
  };

  const currentStrategy = STRATEGIES[selectedStrategy];
  const selectedPairData = tradingPairs.find(p => p.symbol === selectedPair);
  const capitalBaseAmount = accountBalance * (currentStrategy.capitalBase / 100);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>📊 Live Trading Controls</div>
        <div style={styles.subtitle}>
          Professional trading with locked Martingale strategies - HYPE/USDT and 6+ pairs
        </div>
      </div>

      {/* Main Trading Interface */}
      <div style={styles.mainGrid}>
        {/* Trading Controls */}
        <div style={styles.tradingControls}>
          {/* Strategy Selection */}
          <div style={styles.controlSection}>
            <div style={styles.sectionTitle}>
              🎯 Strategy Selection
            </div>
            
            {Object.entries(STRATEGIES).map(([key, strategy]) => (
              <div
                key={key}
                style={{
                  ...styles.strategyCard,
                  ...(selectedStrategy === key ? styles.strategyCardActive : {}),
                  borderColor: strategy.color
                }}
                onClick={() => setSelectedStrategy(key)}
              >
                <div style={styles.strategyHeader}>
                  <span style={styles.strategyIcon}>{strategy.icon}</span>
                  <span style={styles.strategyName}>{strategy.name}</span>
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    background: strategy.color,
                    color: 'white',
                    borderRadius: '8px'
                  }}>
                    🔒 LOCKED
                  </span>
                </div>
                <div style={styles.strategyDescription}>{strategy.description}</div>
                <div style={styles.strategyStats}>
                  <div style={styles.strategyStat}>
                    <span style={styles.statLabel}>Capital Base:</span>
                    <span style={styles.statValue}>0.1% ({formatCurrency(capitalBaseAmount)})</span>
                  </div>
                  <div style={styles.strategyStat}>
                    <span style={styles.statLabel}>Risk Level:</span>
                    <span style={styles.statValue}>{strategy.riskLevel}</span>
                  </div>
                  <div style={styles.strategyStat}>
                    <span style={styles.statLabel}>Expected:</span>
                    <span style={styles.statValue}>{strategy.expectedMonthly}</span>
                  </div>
                  <div style={styles.strategyStat}>
                    <span style={styles.statLabel}>System:</span>
                    <span style={styles.statValue}>Proprietary 🔒</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pair Selection */}
          <div style={styles.controlSection}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Trading Pair</label>
              <select
                style={styles.select}
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
              >
                {tradingPairs.map(pair => (
                  <option key={pair.symbol} value={pair.symbol}>
                    {pair.symbol} - ${pair.price} ({pair.change > 0 ? '+' : ''}{pair.change}%)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Locked Parameters Display */}
          <div style={styles.controlSection}>
            <div style={styles.sectionTitle}>
              🔒 Locked Parameters
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Capital Base (per Martingale cycle)</label>
              <input
                style={styles.lockedInput}
                value={`0.1% of balance = ${formatCurrency(capitalBaseAmount)}`}
                disabled
              />
              <div style={styles.lockedLabel}>
                🔒 Professionally optimized - cannot be modified
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Leverage</label>
              <input
                style={styles.lockedInput}
                value="25x (Futures Trading)"
                disabled
              />
              <div style={styles.lockedLabel}>
                🔒 Battle-tested setting for optimal performance
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Max Martingale Levels</label>
              <input
                style={styles.lockedInput}
                value={`${currentStrategy.maxLevels} levels`}
                disabled
              />
              <div style={styles.lockedLabel}>
                🔒 Risk-controlled progression system
              </div>
            </div>
          </div>

          {/* Strategy Security Notice */}
          <div style={styles.martingaleDisplay}>
            <div style={styles.martingaleTitle}>
              🔒 Proprietary Strategy Protection
            </div>
            <div style={{
              textAlign: 'center',
              padding: '20px',
              color: '#64748b',
              fontSize: '14px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🛡️</div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                Strategy Details Protected
              </div>
              <div style={{ fontSize: '12px' }}>
                Martingale progression is proprietary and optimized for maximum performance
              </div>
            </div>
          </div>

          {/* Warning Box */}
          <div style={styles.warningBox}>
            <div style={styles.warningText}>
              ⚠️ All parameters have been optimized through extensive backtesting and live trading. 
              Modifications could reduce profitability and increase risk.
            </div>
          </div>

          {/* Trading Button */}
          <button
            style={{
              ...styles.tradingButton,
              ...(isTrading ? styles.stopButton : styles.startButton)
            }}
            onClick={handleToggleTrading}
          >
            {isTrading ? '🛑 Stop Trading' : `🚀 Start ${currentStrategy.name}`}
          </button>
        </div>

        {/* Sidebar */}
        <div style={styles.sidebar}>
          {/* Account Information */}
          <div style={styles.accountInfo}>
            <div style={styles.sectionTitle}>💼 Account Status</div>
            <div style={styles.balanceAmount}>{formatCurrency(accountBalance)}</div>
            <div style={styles.balanceLabel}>Exchange Balance</div>
            
            <div style={styles.capitalBase}>
              <div style={styles.capitalBaseAmount}>{formatCurrency(capitalBaseAmount)}</div>
              <div style={styles.capitalBaseLabel}>Capital Base (0.1%)</div>
            </div>
          </div>

          {/* Market Data */}
          <div style={styles.marketData}>
            <div style={styles.sectionTitle}>📈 Market Data</div>
            <div style={styles.pairList}>
              {tradingPairs.map(pair => (
                <div
                  key={pair.symbol}
                  style={{
                    ...styles.pairItem,
                    ...(selectedPair === pair.symbol ? styles.pairItemActive : {})
                  }}
                  onClick={() => setSelectedPair(pair.symbol)}
                >
                  <div>
                    <div style={styles.pairSymbol}>{pair.symbol}</div>
                    <div style={styles.pairPrice}>${pair.price}</div>
                  </div>
                  <div style={{
                    ...styles.pairChange,
                    ...(pair.change >= 0 ? styles.changePositive : styles.changeNegative)
                  }}>
                    {pair.change >= 0 ? '+' : ''}{pair.change}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Positions */}
      <div style={styles.positionsContainer}>
        <div style={styles.sectionTitle}>⚡ Active Positions</div>
        <div style={styles.positionsGrid}>
          {activePositions.map(position => (
            <div key={position.id} style={styles.positionCard}>
              <div style={styles.positionHeader}>
                <span style={styles.positionPair}>{position.pair}</span>
                <span style={styles.positionLevel}>Level {position.level}</span>
              </div>
              <div style={styles.positionStats}>
                <div style={styles.positionStat}>
                  <span style={styles.statLabel}>Strategy:</span>
                  <span style={styles.statValue}>{position.strategy}</span>
                </div>
                <div style={styles.positionStat}>
                  <span style={styles.statLabel}>Size:</span>
                  <span style={styles.statValue}>{position.size}</span>
                </div>
                <div style={styles.positionStat}>
                  <span style={styles.statLabel}>Entry:</span>
                  <span style={styles.statValue}>${position.entryPrice}</span>
                </div>
                <div style={styles.positionStat}>
                  <span style={styles.statLabel}>Current:</span>
                  <span style={styles.statValue}>${position.currentPrice}</span>
                </div>
                <div style={styles.positionStat}>
                  <span style={styles.statLabel}>Duration:</span>
                  <span style={styles.statValue}>{position.duration}</span>
                </div>
              </div>
              <div style={{
                ...styles.positionPnL,
                ...(position.pnl >= 0 ? styles.pnlPositive : styles.pnlNegative)
              }}>
                {formatCurrency(position.pnl)} ({position.pnl >= 0 ? '+' : ''}{position.pnlPercent}%)
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LiveTradingPage;