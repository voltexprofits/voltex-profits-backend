
import React, { useState, useEffect } from 'react';

function AnalyticsDashboardPage({ user }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7D');
  const [selectedAsset, setSelectedAsset] = useState('ALL');
  const [selectedMetric, setSelectedMetric] = useState('profit');

  // Comprehensive analytics data for all assets
  const [analyticsData] = useState({
    overview: {
      totalReturn: 42.8,
      weeklyReturn: 8.5,
      monthlyReturn: 24.3,
      sharpeRatio: 2.14,
      maxDrawdown: -5.2,
      winRate: 78.3,
      avgWin: 45.60,
      avgLoss: -18.20,
      totalTrades: 267,
      profitableTrades: 209,
      totalVolume: 125847.32
    },
    assetPerformance: [
      { 
        symbol: 'BTC/USDT', 
        profit: 298.45, 
        return: 34.2, 
        winRate: 76.8, 
        trades: 45, 
        volume: 35420.18,
        allocation: 28,
        color: '#F7931A',
        trend: 'up',
        change24h: 3.2
      },
      { 
        symbol: 'ETH/USDT', 
        profit: 267.89, 
        return: 31.8, 
        winRate: 74.5, 
        trades: 38, 
        volume: 28750.45,
        allocation: 25,
        color: '#627EEA',
        trend: 'up',
        change24h: 2.8
      },
      { 
        symbol: 'HYPE/USDT', 
        profit: 245.67, 
        return: 67.8, 
        winRate: 82.1, 
        trades: 42, 
        volume: 18934.67,
        allocation: 18,
        color: '#FF6B6B',
        trend: 'up',
        change24h: 8.7
      },
      { 
        symbol: 'BNB/USDT', 
        profit: 189.23, 
        return: 22.4, 
        winRate: 71.2, 
        trades: 34, 
        volume: 16845.78,
        allocation: 15,
        color: '#F3BA2F',
        trend: 'up',
        change24h: 1.9
      },
      { 
        symbol: 'SOL/USDT', 
        profit: 156.78, 
        return: 28.9, 
        winRate: 78.3, 
        trades: 29, 
        volume: 12456.89,
        allocation: 10,
        color: '#9945FF',
        trend: 'up',
        change24h: 4.1
      },
      { 
        symbol: 'ADA/USDT', 
        profit: 89.45, 
        return: 18.7, 
        winRate: 69.8, 
        trades: 28, 
        volume: 8967.45,
        allocation: 8,
        color: '#0033AD',
        trend: 'down',
        change24h: -0.8
      },
      { 
        symbol: 'XRP/USDT', 
        profit: 67.23, 
        return: 15.2, 
        winRate: 72.1, 
        trades: 25, 
        volume: 7834.67,
        allocation: 6,
        color: '#23292F',
        trend: 'up',
        change24h: 1.3
      }
    ],
    dailyPnL: [
      { date: '07-01', total: 23.45, btc: 8.67, eth: 6.78, hype: 4.23, bnb: 2.34, sol: 1.43, others: 0.0 },
      { date: '07-02', total: 34.67, btc: 12.34, eth: 9.45, hype: 7.89, bnb: 3.67, sol: 1.32, others: 0.0 },
      { date: '07-03', total: -12.34, btc: -4.56, eth: -3.45, hype: -2.34, bnb: -1.23, sol: -0.76, others: 0.0 },
      { date: '07-04', total: 45.89, btc: 16.78, eth: 12.45, hype: 9.67, bnb: 4.32, sol: 2.67, others: 0.0 },
      { date: '07-05', total: 28.56, btc: 10.23, eth: 8.34, hype: 5.78, bnb: 2.89, sol: 1.32, others: 0.0 },
      { date: '07-06', total: 56.78, btc: 20.45, eth: 15.67, hype: 12.34, bnb: 5.67, sol: 2.65, others: 0.0 },
      { date: '07-07', total: 89.34, btc: 32.67, eth: 24.56, hype: 18.45, bnb: 8.23, sol: 5.43, others: 0.0 }
    ],
    strategyComparison: [
      { 
        name: 'Steady Climb', 
        trades: 134, 
        winRate: 76.8, 
        profit: 687.45, 
        avgReturn: 5.13,
        bestAsset: 'BTC/USDT',
        riskLevel: 'Low'
      },
      { 
        name: 'Power Surge', 
        trades: 133, 
        winRate: 79.7, 
        profit: 628.25, 
        avgReturn: 4.72,
        bestAsset: 'HYPE/USDT',
        riskLevel: 'Medium'
      }
    ],
    marketComparison: {
      ourPerformance: 42.8,
      btcPerformance: 28.4,
      ethPerformance: 22.1,
      marketAverage: 18.7,
      topPerformer: 'HYPE/USDT',
      worstPerformer: 'ADA/USDT'
    },
    timeframes: ['1D', '7D', '1M', '3M', '1Y', 'ALL'],
    assetFilters: ['ALL', 'BTC/USDT', 'ETH/USDT', 'HYPE/USDT', 'BNB/USDT', 'SOL/USDT', 'ADA/USDT', 'XRP/USDT']
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Multi-asset chart component
  const MultiAssetChart = ({ data, height = 200 }) => {
    const maxProfit = Math.max(...data.map(d => d.total));
    const minProfit = Math.min(...data.map(d => d.total));
    const range = maxProfit - minProfit || 1;

    const assets = ['btc', 'eth', 'hype', 'bnb', 'sol'];
    const colors = ['#F7931A', '#627EEA', '#FF6B6B', '#F3BA2F', '#9945FF'];

    return (
      <div style={{ height, position: 'relative', padding: '20px 0' }}>
        <svg width="100%" height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
            <line
              key={ratio}
              x1="10%"
              y1={`${(1 - ratio) * 100}%`}
              x2="90%"
              y2={`${(1 - ratio) * 100}%`}
              stroke="#f1f5f9"
              strokeWidth="1"
            />
          ))}
          
          {/* Total profit line */}
          <polyline
            fill="none"
            stroke="#1e293b"
            strokeWidth="4"
            points={data.map((d, i) => {
              const x = 10 + (80 / (data.length - 1)) * i;
              const y = 100 - ((d.total - minProfit) / range) * 100;
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Individual asset lines */}
          {assets.map((asset, assetIndex) => (
            <polyline
              key={asset}
              fill="none"
              stroke={colors[assetIndex]}
              strokeWidth="2"
              opacity="0.7"
              points={data.map((d, i) => {
                const x = 10 + (80 / (data.length - 1)) * i;
                const y = 100 - ((d[asset] - minProfit) / range) * 100;
                return `${x},${y}`;
              }).join(' ')}
            />
          ))}
          
          {/* Data points for total */}
          {data.map((d, i) => {
            const x = 10 + (80 / (data.length - 1)) * i;
            const y = 100 - ((d.total - minProfit) / range) * 100;
            return (
              <circle
                key={i}
                cx={`${x}%`}
                cy={`${y}%`}
                r="5"
                fill={d.total >= 0 ? "#10b981" : "#ef4444"}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        
        {/* X-axis labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: height - 20, fontSize: '12px', color: '#64748b' }}>
          {data.map((d, i) => (
            <span key={i}>{d.date}</span>
          ))}
        </div>
      </div>
    );
  };

  // Portfolio donut chart
  const PortfolioChart = ({ data, size = 200 }) => {
    let currentAngle = 0;
    const radius = size / 2 - 20;
    const centerX = size / 2;
    const centerY = size / 2;

    return (
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size}>
          {data.map((segment, index) => {
            const angle = (segment.allocation / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
            const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
            const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
            const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArc = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            currentAngle += angle;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={segment.color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
          
          {/* Center circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius * 0.6}
            fill="white"
            stroke="#f1f5f9"
            strokeWidth="2"
          />
        </svg>
        
        {/* Center text */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>
            {data.length}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Assets</div>
        </div>
      </div>
    );
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
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
    controls: {
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    selector: {
      display: 'flex',
      gap: '8px',
      background: '#f8fafc',
      padding: '4px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0'
    },
    selectorButton: {
      padding: '8px 12px',
      background: 'none',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      whiteSpace: 'nowrap'
    },
    selectorButtonActive: {
      background: '#667eea',
      color: 'white'
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    metricCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    performanceCard: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    metricLabel: {
      fontSize: '14px',
      color: '#6B7280',
      marginBottom: '8px',
      fontWeight: '500'
    },
    metricLabelWhite: {
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: '8px',
      fontWeight: '500'
    },
    metricValue: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: '4px'
    },
    metricValueWhite: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '4px'
    },
    metricChange: {
      fontSize: '12px',
      fontWeight: '500'
    },
    metricChangePositive: {
      color: '#10b981'
    },
    metricChangeNegative: {
      color: '#ef4444'
    },
    metricChangeWhite: {
      color: 'rgba(255, 255, 255, 0.9)'
    },
    chartsContainer: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '20px',
      marginBottom: '30px'
    },
    chartCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    chartTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: '20px'
    },
    assetGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '16px',
      marginBottom: '30px'
    },
    assetCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer'
    },
    assetCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)'
    },
    assetHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    assetSymbol: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1e293b'
    },
    assetTrend: {
      fontSize: '20px'
    },
    assetStats: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px'
    },
    assetStat: {
      textAlign: 'center'
    },
    assetStatLabel: {
      fontSize: '12px',
      color: '#64748b',
      marginBottom: '4px'
    },
    assetStatValue: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#1e293b'
    },
    legendContainer: {
      marginTop: '20px'
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 0',
      borderBottom: '1px solid #f1f5f9'
    },
    legendColor: {
      width: '12px',
      height: '12px',
      borderRadius: '2px',
      marginRight: '8px'
    },
    legendLabel: {
      fontSize: '14px',
      color: '#64748b',
      flex: 1
    },
    legendValue: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#1e293b'
    },
    strategyContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px'
    },
    strategyCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    strategyHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    strategyName: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#1e293b'
    },
    strategyStats: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '12px'
    },
    strategyStat: {
      textAlign: 'center'
    },
    strategyStatLabel: {
      fontSize: '12px',
      color: '#64748b',
      marginBottom: '4px'
    },
    strategyStatValue: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#1e293b'
    },
    chartLegend: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      marginTop: '16px',
      fontSize: '12px'
    },
    legendItem2: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    legendDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.title}>📈 Multi-Asset Analytics</div>
          <div style={styles.subtitle}>
            Comprehensive performance analysis across all trading pairs
          </div>
        </div>
        
        <div style={styles.controls}>
          {/* Asset Filter */}
          <div style={styles.selector}>
            {analyticsData.assetFilters.slice(0, 4).map(asset => (
              <button
                key={asset}
                style={{
                  ...styles.selectorButton,
                  ...(selectedAsset === asset ? styles.selectorButtonActive : {})
                }}
                onClick={() => setSelectedAsset(asset)}
              >
                {asset}
              </button>
            ))}
          </div>
          
          {/* Timeframe Selector */}
          <div style={styles.selector}>
            {analyticsData.timeframes.map(timeframe => (
              <button
                key={timeframe}
                style={{
                  ...styles.selectorButton,
                  ...(selectedTimeframe === timeframe ? styles.selectorButtonActive : {})
                }}
                onClick={() => setSelectedTimeframe(timeframe)}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={styles.metricsGrid}>
        {/* Overall Performance */}
        <div style={styles.performanceCard}>
          <div style={styles.metricLabelWhite}>🏆 Total Portfolio Return</div>
          <div style={styles.metricValueWhite}>
            {formatPercentage(analyticsData.overview.totalReturn)}
          </div>
          <div style={styles.metricChangeWhite}>
            {formatCurrency(analyticsData.assetPerformance.reduce((sum, asset) => sum + asset.profit, 0))} total profit
          </div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>Overall Win Rate</div>
          <div style={styles.metricValue}>
            {analyticsData.overview.winRate}%
          </div>
          <div style={{...styles.metricChange, ...styles.metricChangePositive}}>
            {analyticsData.overview.profitableTrades}/{analyticsData.overview.totalTrades} trades
          </div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>Best Performer</div>
          <div style={styles.metricValue}>
            {analyticsData.marketComparison.topPerformer}
          </div>
          <div style={{...styles.metricChange, ...styles.metricChangePositive}}>
            {formatPercentage(analyticsData.assetPerformance.find(a => a.symbol === analyticsData.marketComparison.topPerformer)?.return || 0)} return
          </div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>Sharpe Ratio</div>
          <div style={styles.metricValue}>
            {analyticsData.overview.sharpeRatio}
          </div>
          <div style={{...styles.metricChange, ...styles.metricChangePositive}}>
            Excellent risk-adjusted return
          </div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>Total Volume</div>
          <div style={styles.metricValue}>
            {formatCurrency(analyticsData.overview.totalVolume)}
          </div>
          <div style={{...styles.metricChange, ...styles.metricChangePositive}}>
            Across {analyticsData.assetPerformance.length} assets
          </div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>Max Drawdown</div>
          <div style={styles.metricValue}>
            {formatPercentage(analyticsData.overview.maxDrawdown)}
          </div>
          <div style={{...styles.metricChange, ...styles.metricChangePositive}}>
            Low risk exposure
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={styles.chartsContainer}>
        {/* Multi-Asset Performance Chart */}
        <div style={styles.chartCard}>
          <div style={styles.chartTitle}>💰 Multi-Asset P&L Performance</div>
          <MultiAssetChart data={analyticsData.dailyPnL} />
          
          {/* Chart Legend */}
          <div style={styles.chartLegend}>
            <div style={styles.legendItem2}>
              <div style={{...styles.legendDot, background: '#1e293b'}} />
              <span>Total P&L</span>
            </div>
            <div style={styles.legendItem2}>
              <div style={{...styles.legendDot, background: '#F7931A'}} />
              <span>BTC</span>
            </div>
            <div style={styles.legendItem2}>
              <div style={{...styles.legendDot, background: '#627EEA'}} />
              <span>ETH</span>
            </div>
            <div style={styles.legendItem2}>
              <div style={{...styles.legendDot, background: '#FF6B6B'}} />
              <span>HYPE</span>
            </div>
            <div style={styles.legendItem2}>
              <div style={{...styles.legendDot, background: '#F3BA2F'}} />
              <span>BNB</span>
            </div>
            <div style={styles.legendItem2}>
              <div style={{...styles.legendDot, background: '#9945FF'}} />
              <span>SOL</span>
            </div>
          </div>
          
          <div style={{ marginTop: '16px', fontSize: '14px', color: '#64748b' }}>
            Total profit this week: <span style={{ color: '#10b981', fontWeight: 'bold' }}>
              {formatCurrency(analyticsData.dailyPnL.reduce((sum, d) => sum + d.total, 0))}
            </span>
          </div>
        </div>

        {/* Portfolio Allocation */}
        <div style={styles.chartCard}>
          <div style={styles.chartTitle}>🎯 Portfolio Allocation</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PortfolioChart data={analyticsData.assetPerformance} />
          </div>
          
          <div style={styles.legendContainer}>
            {analyticsData.assetPerformance.map((asset, index) => (
              <div key={index} style={styles.legendItem}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ ...styles.legendColor, background: asset.color }} />
                  <span style={styles.legendLabel}>{asset.symbol}</span>
                </div>
                <div style={styles.legendValue}>
                  {asset.allocation}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Individual Asset Performance */}
      <div style={styles.chartCard}>
        <div style={styles.chartTitle}>📊 Individual Asset Performance</div>
        <div style={styles.assetGrid}>
          {analyticsData.assetPerformance.map((asset, index) => (
            <div key={index} style={styles.assetCard}>
              <div style={styles.assetHeader}>
                <div>
                  <div style={styles.assetSymbol}>{asset.symbol}</div>
                  <div style={{ fontSize: '12px', color: asset.color, fontWeight: '500' }}>
                    {formatPercentage(asset.change24h)} 24h
                  </div>
                </div>
                <div style={styles.assetTrend}>
                  {asset.trend === 'up' ? '📈' : '📉'}
                </div>
              </div>
              
              <div style={styles.assetStats}>
                <div style={styles.assetStat}>
                  <div style={styles.assetStatLabel}>Profit</div>
                  <div style={{...styles.assetStatValue, color: '#10b981'}}>
                    {formatCurrency(asset.profit)}
                  </div>
                </div>
                <div style={styles.assetStat}>
                  <div style={styles.assetStatLabel}>Return</div>
                  <div style={styles.assetStatValue}>{formatPercentage(asset.return)}</div>
                </div>
                <div style={styles.assetStat}>
                  <div style={styles.assetStatLabel}>Win Rate</div>
                  <div style={styles.assetStatValue}>{asset.winRate}%</div>
                </div>
                <div style={styles.assetStat}>
                  <div style={styles.assetStatLabel}>Trades</div>
                  <div style={styles.assetStatValue}>{asset.trades}</div>
                </div>
                <div style={styles.assetStat}>
                  <div style={styles.assetStatLabel}>Volume</div>
                  <div style={styles.assetStatValue}>{formatCurrency(asset.volume)}</div>
                </div>
                <div style={styles.assetStat}>
                  <div style={styles.assetStatLabel}>Allocation</div>
                  <div style={styles.assetStatValue}>{asset.allocation}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategy Comparison */}
      <div style={styles.chartCard}>
        <div style={styles.chartTitle}>⚡ Strategy Performance Analysis</div>
        <div style={styles.strategyContainer}>
          {analyticsData.strategyComparison.map((strategy, index) => (
            <div key={index} style={styles.strategyCard}>
              <div style={styles.strategyHeader}>
                <div style={styles.strategyName}>
                  {strategy.name === 'Steady Climb' ? '📊' : '🚀'} {strategy.name}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
                  {formatCurrency(strategy.profit)}
                </div>
              </div>
              
              <div style={styles.strategyStats}>
                <div style={styles.strategyStat}>
                  <div style={styles.strategyStatLabel}>Win Rate</div>
                  <div style={styles.strategyStatValue}>{strategy.winRate}%</div>
                </div>
                <div style={styles.strategyStat}>
                  <div style={styles.strategyStatLabel}>Trades</div>
                  <div style={styles.strategyStatValue}>{strategy.trades}</div>
                </div>
                <div style={styles.strategyStat}>
                  <div style={styles.strategyStatLabel}>Avg Return</div>
                  <div style={styles.strategyStatValue}>{strategy.avgReturn}%</div>
                </div>
                <div style={styles.strategyStat}>
                  <div style={styles.strategyStatLabel}>Best Asset</div>
                  <div style={{...styles.strategyStatValue, fontSize: '12px', color: '#667eea'}}>
                    {strategy.bestAsset}
                  </div>
                </div>
                <div style={styles.strategyStat}>
                  <div style={styles.strategyStatLabel}>Risk Level</div>
                  <div style={{
                    ...styles.strategyStatValue, 
                    fontSize: '12px',
                    color: strategy.riskLevel === 'Low' ? '#10b981' : '#f59e0b'
                  }}>
                    {strategy.riskLevel}
                  </div>
                </div>
                <div style={styles.strategyStat}>
                  <div style={styles.strategyStatLabel}>Status</div>
                  <div style={{ ...styles.strategyStatValue, fontSize: '12px', color: '#10b981' }}>
                    Active
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Comparison */}
      <div style={styles.chartCard}>
        <div style={styles.chartTitle}>🌍 Market Comparison</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '20px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '12px',
            color: 'white'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
              {formatPercentage(analyticsData.marketComparison.ourPerformance)}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Our Performance</div>
          </div>
          
          <div style={{
            textAlign: 'center',
            padding: '20px',
            background: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#F7931A' }}>
              {formatPercentage(analyticsData.marketComparison.btcPerformance)}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>BTC Performance</div>
          </div>
          
          <div style={{
            textAlign: 'center',
            padding: '20px',
            background: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#627EEA' }}>
              {formatPercentage(analyticsData.marketComparison.ethPerformance)}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>ETH Performance</div>
          </div>
          
          <div style={{
            textAlign: 'center',
            padding: '20px',
            background: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#64748b' }}>
              {formatPercentage(analyticsData.marketComparison.marketAverage)}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Market Average</div>
          </div>
        </div>
        
        <div style={{ 
          marginTop: '20px', 
          padding: '16px', 
          background: '#f0fdf4', 
          borderRadius: '8px',
          border: '1px solid #bbf7d0'
        }}>
          <div style={{ fontSize: '14px', color: '#15803d', fontWeight: '500' }}>
            🎯 <strong>Performance Summary:</strong> Your portfolio is outperforming the market by{' '}
            <span style={{ fontWeight: 'bold' }}>
              {formatPercentage(analyticsData.marketComparison.ourPerformance - analyticsData.marketComparison.marketAverage)}
            </span>
            {' '}with {analyticsData.marketComparison.topPerformer} leading the gains and{' '}
            {analyticsData.assetPerformance.length} active trading pairs.
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboardPage;