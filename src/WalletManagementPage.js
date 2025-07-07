
import React, { useState, useEffect } from 'react';

function WalletManagementPage({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [walletData, setWalletData] = useState({
    totalBalance: 2847.92,
    availableBalance: 2156.34,
    lockedInTrades: 691.58,
    totalProfit: 847.92,
    totalDeposited: 2000.00,
    yieldWalletBalance: 156.78,
    hypeBalance: 245.67
  });

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'trade_profit',
      amount: 81.58,
      currency: 'USDT',
      pair: 'HYPE/USDT',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'completed',
      description: 'Trading profit from HYPE position'
    },
    {
      id: 2,
      type: 'yield_earning',
      amount: 12.45,
      currency: 'USDT',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: 'completed',
      description: 'Daily yield wallet earnings'
    },
    {
      id: 3,
      type: 'deposit',
      amount: 500.00,
      currency: 'USDT',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'completed',
      description: 'USDT deposit via TRC20'
    },
    {
      id: 4,
      type: 'trade_profit',
      amount: 34.22,
      currency: 'USDT',
      pair: 'BTC/USDT',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'completed',
      description: 'Trading profit from BTC position'
    },
    {
      id: 5,
      type: 'withdrawal',
      amount: 200.00,
      currency: 'USDT',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'pending',
      description: 'USDT withdrawal to external wallet'
    }
  ]);

  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit': return '💰';
      case 'withdrawal': return '📤';
      case 'trade_profit': return '📈';
      case 'trade_loss': return '📉';
      case 'yield_earning': return '🎯';
      default: return '💱';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'deposit': return '#10B981';
      case 'withdrawal': return '#F59E0B';
      case 'trade_profit': return '#10B981';
      case 'trade_loss': return '#EF4444';
      case 'yield_earning': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const handleDeposit = () => {
    alert('Deposit functionality - Coming soon! Integration with payment processor.');
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || !withdrawAddress) {
      alert('Please enter withdrawal amount and address');
      return;
    }
    alert('Withdrawal request submitted! Processing time: 1-3 business days.');
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
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
    balanceGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    balanceCard: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      padding: '24px',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    },
    balanceCardSecondary: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      borderRadius: '16px',
      padding: '24px',
      color: 'white'
    },
    balanceCardTertiary: {
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      borderRadius: '16px',
      padding: '24px',
      color: 'white'
    },
    balanceAmount: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    balanceLabel: {
      fontSize: '14px',
      opacity: 0.9
    },
    balanceChange: {
      fontSize: '12px',
      marginTop: '8px',
      opacity: 0.8
    },
    tabContainer: {
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      marginBottom: '20px'
    },
    tabHeader: {
      display: 'flex',
      borderBottom: '1px solid #E5E7EB'
    },
    tab: {
      flex: 1,
      padding: '16px 24px',
      background: 'none',
      border: 'none',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      borderBottom: '3px solid transparent'
    },
    tabActive: {
      color: '#667eea',
      borderBottomColor: '#667eea',
      background: '#F8FAFC'
    },
    tabContent: {
      padding: '24px'
    },
    transactionsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    transactionItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '16px',
      background: '#F9FAFB',
      borderRadius: '8px',
      border: '1px solid #E5E7EB'
    },
    transactionIcon: {
      fontSize: '24px',
      marginRight: '16px',
      width: '40px',
      textAlign: 'center'
    },
    transactionDetails: {
      flex: 1
    },
    transactionDescription: {
      fontWeight: '500',
      color: '#1F2937',
      marginBottom: '4px'
    },
    transactionMeta: {
      fontSize: '12px',
      color: '#6B7280'
    },
    transactionAmount: {
      fontWeight: 'bold',
      fontSize: '16px'
    },
    depositWithdrawGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '24px'
    },
    actionCard: {
      background: '#F9FAFB',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #E5E7EB'
    },
    actionTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#1F2937'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #D1D5DB',
      borderRadius: '8px',
      fontSize: '16px',
      marginBottom: '12px'
    },
    button: {
      width: '100%',
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'transform 0.2s'
    },
    withdrawButton: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    statusBadge: {
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      marginLeft: '8px'
    },
    statusCompleted: {
      background: '#D1FAE5',
      color: '#065F46'
    },
    statusPending: {
      background: '#FEF3C7',
      color: '#92400E'
    },
    hypeSection: {
      background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
      borderRadius: '12px',
      padding: '20px',
      color: 'white',
      marginBottom: '20px'
    },
    hypeTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    hypeStats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '16px'
    },
    hypeStat: {
      textAlign: 'center'
    },
    hypeStatValue: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '4px'
    },
    hypeStatLabel: {
      fontSize: '12px',
      opacity: 0.9
    }
  };

  const renderOverview = () => (
    <div>
      <div style={styles.hypeSection}>
        <div style={styles.hypeTitle}>🔥 HYPE Portfolio Performance</div>
        <div style={styles.hypeStats}>
          <div style={styles.hypeStat}>
            <div style={styles.hypeStatValue}>{formatCurrency(walletData.hypeBalance)}</div>
            <div style={styles.hypeStatLabel}>HYPE Value</div>
          </div>
          <div style={styles.hypeStat}>
            <div style={styles.hypeStatValue}>+24.5%</div>
            <div style={styles.hypeStatLabel}>24h Change</div>
          </div>
          <div style={styles.hypeStat}>
            <div style={styles.hypeStatValue}>19.7 HYPE</div>
            <div style={styles.hypeStatLabel}>Holdings</div>
          </div>
          <div style={styles.hypeStat}>
            <div style={styles.hypeStatValue}>+$81.58</div>
            <div style={styles.hypeStatLabel}>Today's P&L</div>
          </div>
        </div>
      </div>

      <div style={styles.balanceGrid}>
        <div style={styles.balanceCard}>
          <div style={styles.balanceAmount}>{formatCurrency(walletData.totalBalance)}</div>
          <div style={styles.balanceLabel}>Total Portfolio Value</div>
          <div style={styles.balanceChange}>+{formatCurrency(walletData.totalProfit)} All Time</div>
        </div>
        <div style={styles.balanceCardSecondary}>
          <div style={styles.balanceAmount}>{formatCurrency(walletData.availableBalance)}</div>
          <div style={styles.balanceLabel}>Available Balance</div>
          <div style={styles.balanceChange}>Ready for Trading</div>
        </div>
        <div style={styles.balanceCardTertiary}>
          <div style={styles.balanceAmount}>{formatCurrency(walletData.yieldWalletBalance)}</div>
          <div style={styles.balanceLabel}>Yield Wallet</div>
          <div style={styles.balanceChange}>+12.5% APY</div>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div style={styles.transactionsList}>
      {transactions.map(transaction => (
        <div key={transaction.id} style={styles.transactionItem}>
          <div style={styles.transactionIcon}>
            {getTransactionIcon(transaction.type)}
          </div>
          <div style={styles.transactionDetails}>
            <div style={styles.transactionDescription}>
              {transaction.description}
              {transaction.pair && <span style={{ color: '#667eea', fontWeight: 'bold' }}> • {transaction.pair}</span>}
            </div>
            <div style={styles.transactionMeta}>
              {formatTime(transaction.timestamp)}
              <span 
                style={{
                  ...styles.statusBadge,
                  ...(transaction.status === 'completed' ? styles.statusCompleted : styles.statusPending)
                }}
              >
                {transaction.status}
              </span>
            </div>
          </div>
          <div 
            style={{
              ...styles.transactionAmount,
              color: getTransactionColor(transaction.type)
            }}
          >
            {transaction.type === 'withdrawal' ? '-' : '+'}
            {formatCurrency(transaction.amount)}
          </div>
        </div>
      ))}
    </div>
  );

  const renderDepositWithdraw = () => (
    <div style={styles.depositWithdrawGrid}>
      <div style={styles.actionCard}>
        <div style={styles.actionTitle}>💰 Deposit Funds</div>
        <input
          style={styles.input}
          type="number"
          placeholder="Enter amount (USDT)"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
        />
        <select style={styles.input}>
          <option>USDT (TRC20)</option>
          <option>USDT (ERC20)</option>
          <option>BTC</option>
          <option>ETH</option>
        </select>
        <button 
          style={styles.button}
          onClick={handleDeposit}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          Generate Deposit Address
        </button>
      </div>

      <div style={styles.actionCard}>
        <div style={styles.actionTitle}>📤 Withdraw Funds</div>
        <input
          style={styles.input}
          type="number"
          placeholder="Enter amount (USDT)"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
        />
        <input
          style={styles.input}
          type="text"
          placeholder="Withdrawal address"
          value={withdrawAddress}
          onChange={(e) => setWithdrawAddress(e.target.value)}
        />
        <button 
          style={{...styles.button, ...styles.withdrawButton}}
          onClick={handleWithdraw}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          Request Withdrawal
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>💰 Wallet Management</div>
        <div style={styles.subtitle}>
          Track your balance, transactions, and manage deposits/withdrawals
        </div>
      </div>

      <div style={styles.tabContainer}>
        <div style={styles.tabHeader}>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === 'overview' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === 'transactions' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('transactions')}
          >
            📋 Transactions
          </button>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === 'deposit-withdraw' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('deposit-withdraw')}
          >
            💳 Deposit/Withdraw
          </button>
        </div>
        
        <div style={styles.tabContent}>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'transactions' && renderTransactions()}
          {activeTab === 'deposit-withdraw' && renderDepositWithdraw()}
        </div>
      </div>
    </div>
  );
}

export default WalletManagementPage;