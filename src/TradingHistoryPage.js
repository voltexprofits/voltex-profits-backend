
import React, { useState, useEffect } from 'react';

function TradingHistoryPage({ user }) {
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7D');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [tradesPerPage] = useState(20);

  // Comprehensive trading history data
  const [tradingHistory] = useState({
    summary: {
      totalTrades: 267,
      winningTrades: 209,
      losingTrades: 58,
      winRate: 78.3,
      totalProfit: 1315.70,
      totalVolume: 125847.32,
      avgTradeSize: 471.28,
      avgProfit: 6.29,
      bestTrade: 81.58,
      worstTrade: -23.45
    },
    trades: [
      {
        id: 'TXN-2024-001',
        pair: 'HYPE/USDT',
        type: 'LONG',
        strategy: 'Power Surge',
        entryPrice: 12.45,
        exitPrice: 13.67,
        quantity: 40.2,
        entryTime: new Date('2024-07-07T14:30:00'),
        exitTime: new Date('2024-07-07T16:45:00'),
        duration: '2h 15m',
        profit: 81.58,
        profitPercent: 9.8,
        status: 'COMPLETED',
        fees: 2.45,
        volume: 500.49,
        martingaleLevel: 0,
        riskLevel: 'Medium'
      },
      {
        id: 'TXN-2024-002',
        pair: 'BTC/USDT',
        type: 'LONG',
        strategy: 'Steady Climb',
        entryPrice: 68450.00,
        exitPrice: 69890.00,
        quantity: 0.0072,
        entryTime: new Date('2024-07-07T12:15:00'),
        exitTime: new Date('2024-07-07T15:30:00'),
        duration: '3h 15m',
        profit: 67.42,
        profitPercent: 2.1,
        status: 'COMPLETED',
        fees: 1.86,
        volume: 492.84,
        martingaleLevel: 0,
        riskLevel: 'Low'
      },
      {
        id: 'TXN-2024-003',
        pair: 'ETH/USDT',
        type: 'LONG',
        strategy: 'Power Surge',
        entryPrice: 3845.60,
        exitPrice: 3923.40,
        quantity: 0.128,
        entryTime: new Date('2024-07-07T10:20:00'),
        exitTime: new Date('2024-07-07T13:45:00'),
        duration: '3h 25m',
        profit: 56.78,
        profitPercent: 2.0,
        status: 'COMPLETED',
        fees: 1.52,
        volume: 492.24,
        martingaleLevel: 0,
        riskLevel: 'Medium'
      },
      {
        id: 'TXN-2024-004',
        pair: 'BNB/USDT',
        type: 'LONG',
        strategy: 'Steady Climb',
        entryPrice: 612.40,
        exitPrice: 634.80,
        quantity: 0.78,
        entryTime: new Date('2024-07-07T09:10:00'),
        exitTime: new Date('2024-07-07T12:30:00'),
        duration: '3h 20m',
        profit: 34.56,
        profitPercent: 3.7,
        status: 'COMPLETED',
        fees: 0.95,
        volume: 477.67,
        martingaleLevel: 0,
        riskLevel: 'Low'
      },
      {
        id: 'TXN-2024-005',
        pair: 'SOL/USDT',
        type: 'LONG',
        strategy: 'Power Surge',
        entryPrice: 142.30,
        exitPrice: 148.90,
        quantity: 3.45,
        entryTime: new Date('2024-07-07T08:45:00'),
        exitTime: new Date('2024-07-07T11:20:00'),
        duration: '2h 35m',
        profit: 28.67,
        profitPercent: 4.6,
        status: 'COMPLETED',
        fees: 1.21,
        volume: 490.94,
        martingaleLevel: 0,
        riskLevel: 'Medium'
      },
      {
        id: 'TXN-2024-006',
        pair: 'ADA/USDT',
        type: 'LONG',
        strategy: 'Steady Climb',
        entryPrice: 0.4567,
        exitPrice: 0.4389,
        quantity: 1089.5,
        entryTime: new Date('2024-07-06T16:30:00'),
        exitTime: new Date('2024-07-06T18:45:00'),
        duration: '2h 15m',
        profit: -19.42,
        profitPercent: -3.9,
        status: 'COMPLETED',
        fees: 1.24,
        volume: 497.41,
        martingaleLevel: 1,
        riskLevel: 'Low'
      },
      {
        id: 'TXN-2024-007',
        pair: 'XRP/USDT',
        type: 'LONG',
        strategy: 'Power Surge',
        entryPrice: 0.6234,
        exitPrice: 0.6445,
        quantity: 781.2,
        entryTime: new Date('2024-07-06T14:20:00'),
        exitTime: new Date('2024-07-06T17:10:00'),
        duration: '2h 50m',
        profit: 16.49,
        profitPercent: 3.4,
        status: 'COMPLETED',
        fees: 0.87,
        volume: 487.01,
        martingaleLevel: 0,
        riskLevel: 'Medium'
      },
      {
        id: 'TXN-2024-008',
        pair: 'HYPE/USDT',
        type: 'LONG',
        strategy: 'Steady Climb',
        entryPrice: 11.89,
        exitPrice: 12.67,
        quantity: 38.9,
        entryTime: new Date('2024-07-06T11:15:00'),
        exitTime: new Date('2024-07-06T14:30:00'),
        duration: '3h 15m',
        profit: 45.23,
        profitPercent: 6.6,
        status: 'COMPLETED',
        fees: 1.89,
        volume: 462.72,
        martingaleLevel: 0,
        riskLevel: 'Medium'
      }
    ],
    filters: {
      assets: ['ALL', 'BTC/USDT', 'ETH/USDT', 'HYPE/USDT', 'BNB/USDT', 'SOL/USDT', 'ADA/USDT', 'XRP/USDT'],
      timeframes: ['1D', '7D', '1M', '3M', '1Y', 'ALL'],
      statuses: ['ALL', 'COMPLETED', 'ACTIVE', 'CANCELLED'],
      strategies: ['ALL', 'Steady Climb', 'Power Surge']
    }
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

  const formatDateTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  };

  const getAssetColor = (pair) => {
    const colors = {
      'BTC/USDT': '#F7931A',
      'ETH/USDT': '#627EEA',
      'HYPE/USDT': '#FF6B6B',
      'BNB/USDT': '#F3BA2F',
      'SOL/USDT': '#9945FF',
      'ADA/USDT': '#0033AD',
      'XRP/USDT': '#23292F'
    };
    return colors[pair] || '#64748b';
  };

  const getStrategyIcon = (strategy) => {
    return strategy === 'Steady Climb' ? '📊' : '🚀';
  };

  const getRiskColor = (level) => {
    const colors = {
      'Low': '#10b981',
      'Medium': '#f59e0b',
      'High': '#ef4444'
    };
    return colors[level] || '#64748b';
  };

  // Filter and sort trades
  const filteredTrades = tradingHistory.trades
    .filter(trade => {
      if (selectedFilter !== 'ALL' && trade.pair !== selectedFilter) return false;
      if (selectedStatus !== 'ALL' && trade.status !== selectedStatus) return false;
      if (searchTerm && !trade.id.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !trade.pair.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'date') {
        aValue = a.exitTime || a.entryTime;
        bValue = b.exitTime || b.entryTime;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination
  const indexOfLastTrade = currentPage * tradesPerPage;
  const indexOfFirstTrade = indexOfLastTrade - tradesPerPage;
  const currentTrades = filteredTrades.slice(indexOfFirstTrade, indexOfLastTrade);
  const totalPages = Math.ceil(filteredTrades.length / tradesPerPage);

  const handleExport = () => {
    alert('Export functionality - CSV/Excel export of trading history would be implemented here.');
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
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '30px'
    },
    summaryCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      textAlign: 'center'
    },
    summaryCardPrimary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    },
    summaryLabel: {
      fontSize: '14px',
      color: '#64748b',
      marginBottom: '8px',
      fontWeight: '500'
    },
    summaryLabelWhite: {
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: '8px',
      fontWeight: '500'
    },
    summaryValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1e293b'
    },
    summaryValueWhite: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white'
    },
    summaryChange: {
      fontSize: '12px',
      marginTop: '4px',
      color: '#64748b'
    },
    summaryChangeWhite: {
      fontSize: '12px',
      marginTop: '4px',
      color: 'rgba(255, 255, 255, 0.9)'
    },
    controlsContainer: {
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e2e8f0',
      marginBottom: '20px'
    },
    controlsRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      alignItems: 'center',
      marginBottom: '16px'
    },
    controlGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    controlLabel: {
      fontSize: '12px',
      fontWeight: '500',
      color: '#64748b'
    },
    select: {
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      background: 'white',
      minWidth: '120px'
    },
    searchInput: {
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      minWidth: '200px'
    },
    exportButton: {
      padding: '8px 16px',
      background: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    tableContainer: {
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      marginBottom: '20px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      background: '#f8fafc',
      borderBottom: '1px solid #e2e8f0'
    },
    tableHeaderCell: {
      padding: '16px 12px',
      textAlign: 'left',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      cursor: 'pointer',
      userSelect: 'none'
    },
    tableRow: {
      borderBottom: '1px solid #f1f5f9',
      transition: 'background-color 0.2s'
    },
    tableRowHover: {
      backgroundColor: '#f8fafc'
    },
    tableCell: {
      padding: '16px 12px',
      fontSize: '14px',
      color: '#374151'
    },
    tradeId: {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#64748b',
      fontWeight: '500'
    },
    assetBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
      color: 'white'
    },
    strategyBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
      background: '#f1f5f9',
      color: '#64748b'
    },
    profitPositive: {
      color: '#10b981',
      fontWeight: '600'
    },
    profitNegative: {
      color: '#ef4444',
      fontWeight: '600'
    },
    statusBadge: {
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500'
    },
    statusCompleted: {
      background: '#d1fae5',
      color: '#065f46'
    },
    statusActive: {
      background: '#dbeafe',
      color: '#1e40af'
    },
    riskBadge: {
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: '500',
      color: 'white'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      marginTop: '20px'
    },
    pageButton: {
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      background: 'white',
      cursor: 'pointer',
      fontSize: '14px'
    },
    pageButtonActive: {
      background: '#667eea',
      color: 'white',
      border: '1px solid #667eea'
    },
    pageInfo: {
      fontSize: '14px',
      color: '#64748b',
      margin: '0 16px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.title}>📋 Trading History</div>
          <div style={styles.subtitle}>
            Complete record of all trades across {tradingHistory.filters.assets.length - 1} trading pairs
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        <div style={{ ...styles.summaryCard, ...styles.summaryCardPrimary }}>
          <div style={styles.summaryLabelWhite}>Total Trades</div>
          <div style={styles.summaryValueWhite}>{tradingHistory.summary.totalTrades}</div>
          <div style={styles.summaryChangeWhite}>All assets combined</div>
        </div>

        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Win Rate</div>
          <div style={{ ...styles.summaryValue, color: '#10b981' }}>
            {tradingHistory.summary.winRate}%
          </div>
          <div style={styles.summaryChange}>
            {tradingHistory.summary.winningTrades} wins, {tradingHistory.summary.losingTrades} losses
          </div>
        </div>

        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Total Profit</div>
          <div style={{ ...styles.summaryValue, color: '#10b981' }}>
            {formatCurrency(tradingHistory.summary.totalProfit)}
          </div>
          <div style={styles.summaryChange}>
            Avg: {formatCurrency(tradingHistory.summary.avgProfit)} per trade
          </div>
        </div>

        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Best Trade</div>
          <div style={{ ...styles.summaryValue, color: '#10b981' }}>
            {formatCurrency(tradingHistory.summary.bestTrade)}
          </div>
          <div style={styles.summaryChange}>
            HYPE/USDT Power Surge
          </div>
        </div>

        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Total Volume</div>
          <div style={styles.summaryValue}>
            {formatCurrency(tradingHistory.summary.totalVolume)}
          </div>
          <div style={styles.summaryChange}>
            Avg size: {formatCurrency(tradingHistory.summary.avgTradeSize)}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={styles.controlsContainer}>
        <div style={styles.controlsRow}>
          <div style={styles.controlGroup}>
            <label style={styles.controlLabel}>Asset Filter</label>
            <select 
              style={styles.select}
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              {tradingHistory.filters.assets.map(asset => (
                <option key={asset} value={asset}>{asset}</option>
              ))}
            </select>
          </div>

          <div style={styles.controlGroup}>
            <label style={styles.controlLabel}>Timeframe</label>
            <select 
              style={styles.select}
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
            >
              {tradingHistory.filters.timeframes.map(timeframe => (
                <option key={timeframe} value={timeframe}>{timeframe}</option>
              ))}
            </select>
          </div>

          <div style={styles.controlGroup}>
            <label style={styles.controlLabel}>Status</label>
            <select 
              style={styles.select}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {tradingHistory.filters.statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div style={styles.controlGroup}>
            <label style={styles.controlLabel}>Search</label>
            <input
              style={styles.searchInput}
              type="text"
              placeholder="Search by Trade ID or Asset..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button style={styles.exportButton} onClick={handleExport}>
            📊 Export CSV
          </button>
        </div>
      </div>

      {/* Trading History Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={styles.tableHeaderCell} onClick={() => setSortBy('id')}>
                Trade ID {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th style={styles.tableHeaderCell} onClick={() => setSortBy('pair')}>
                Asset {sortBy === 'pair' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th style={styles.tableHeaderCell} onClick={() => setSortBy('strategy')}>
                Strategy
              </th>
              <th style={styles.tableHeaderCell} onClick={() => setSortBy('entryPrice')}>
                Entry/Exit Price
              </th>
              <th style={styles.tableHeaderCell} onClick={() => setSortBy('quantity')}>
                Quantity
              </th>
              <th style={styles.tableHeaderCell} onClick={() => setSortBy('duration')}>
                Duration
              </th>
              <th style={styles.tableHeaderCell} onClick={() => setSortBy('profit')}>
                P&L {sortBy === 'profit' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th style={styles.tableHeaderCell} onClick={() => setSortBy('date')}>
                Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th style={styles.tableHeaderCell}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {currentTrades.map((trade, index) => (
              <tr 
                key={trade.id} 
                style={styles.tableRow}
                onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = '#f8fafc'}
                onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = ''}
              >
                <td style={styles.tableCell}>
                  <div style={styles.tradeId}>{trade.id}</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                    ML-{trade.martingaleLevel}
                  </div>
                </td>
                
                <td style={styles.tableCell}>
                  <div 
                    style={{
                      ...styles.assetBadge,
                      backgroundColor: getAssetColor(trade.pair)
                    }}
                  >
                    {trade.pair}
                  </div>
                </td>
                
                <td style={styles.tableCell}>
                  <div style={styles.strategyBadge}>
                    {getStrategyIcon(trade.strategy)} {trade.strategy}
                  </div>
                  <div 
                    style={{
                      ...styles.riskBadge,
                      backgroundColor: getRiskColor(trade.riskLevel),
                      marginTop: '4px'
                    }}
                  >
                    {trade.riskLevel}
                  </div>
                </td>
                
                <td style={styles.tableCell}>
                  <div>${trade.entryPrice.toFixed(trade.pair.includes('BTC') ? 0 : 4)}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    ${trade.exitPrice.toFixed(trade.pair.includes('BTC') ? 0 : 4)}
                  </div>
                </td>
                
                <td style={styles.tableCell}>
                  <div>{trade.quantity.toFixed(4)}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {formatCurrency(trade.volume)}
                  </div>
                </td>
                
                <td style={styles.tableCell}>
                  <div>{trade.duration}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {formatDateTime(trade.entryTime)}
                  </div>
                </td>
                
                <td style={styles.tableCell}>
                  <div style={trade.profit >= 0 ? styles.profitPositive : styles.profitNegative}>
                    {formatCurrency(trade.profit)}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: trade.profitPercent >= 0 ? '#10b981' : '#ef4444'
                  }}>
                    {formatPercentage(trade.profitPercent)}
                  </div>
                </td>
                
                <td style={styles.tableCell}>
                  <div>{formatDateTime(trade.exitTime || trade.entryTime)}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Fee: {formatCurrency(trade.fees)}
                  </div>
                </td>
                
                <td style={styles.tableCell}>
                  <span style={{
                    ...styles.statusBadge,
                    ...(trade.status === 'COMPLETED' ? styles.statusCompleted : styles.statusActive)
                  }}>
                    {trade.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        <button 
          style={styles.pageButton}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>
        
        <div style={styles.pageInfo}>
          Page {currentPage} of {totalPages} ({filteredTrades.length} trades)
        </div>
        
        <button 
          style={styles.pageButton}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default TradingHistoryPage;