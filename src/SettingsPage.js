
import React, { useState } from 'react';

function SettingsPage({ user }) {
  const [activeSection, setActiveSection] = useState('exchanges');
  const [profileData, setProfileData] = useState({
    username: user?.username || 'trader_pro',
    email: user?.email || 'trader@voltexprofits.com',
    firstName: 'John',
    lastName: 'Trader',
    phone: '+1 (555) 123-4567',
    timezone: 'UTC+3',
    country: 'Kenya',
    language: 'English',
    avatar: null
  });

  const [tradingSettings, setTradingSettings] = useState({
    defaultStrategy: 'steady_climb',
    riskLevel: 'medium',
    maxPositionSize: 500,
    stopLossPercent: 5,
    takeProfitPercent: 10,
    martingaleEnabled: true,
    maxMartingaleLevel: 15,
    autoTradingEnabled: true,
    tradingHours: {
      enabled: true,
      start: '08:00',
      end: '18:00',
      timezone: 'UTC+3'
    }
  });

  const [exchangeConfig, setExchangeConfig] = useState({
    okx: {
      enabled: true,
      apiKey: '',
      apiSecret: '',
      passphrase: '',
      testnet: false,
      leverage: 20,
      status: 'disconnected'
    },
    bybit: {
      enabled: true,
      apiKey: '',
      apiSecret: '',
      testnet: false,
      leverage: 25,
      status: 'disconnected'
    },
    binance: {
      enabled: false,
      apiKey: '',
      apiSecret: '',
      testnet: false,
      leverage: 20,
      status: 'disconnected'
    },
    bitget: {
      enabled: false,
      apiKey: '',
      apiSecret: '',
      passphrase: '',
      testnet: false,
      leverage: 20,
      status: 'disconnected'
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedExchange, setSelectedExchange] = useState('');
  const [testingConnection, setTestingConnection] = useState(false);

  const sectionItems = [
    { id: 'profile', name: 'Profile', icon: '👤', description: 'Personal information' },
    { id: 'trading', name: 'Trading', icon: '📊', description: 'Trading preferences' },
    { id: 'exchanges', name: 'Exchanges', icon: '🔗', description: 'API configurations' },
    { id: 'assets', name: 'Assets', icon: '💰', description: 'Portfolio allocation' },
    { id: 'security', name: 'Security', icon: '🔒', description: 'Account security' },
    { id: 'notifications', name: 'Notifications', icon: '🔔', description: 'Alert settings' },
    { id: 'subscription', name: 'Subscription', icon: '💳', description: 'Billing & plans' },
    { id: 'advanced', name: 'Advanced', icon: '⚙️', description: 'Advanced options' }
  ];

  const handleConfigureExchange = (exchange) => {
    setSelectedExchange(exchange);
    setActiveModal(`${exchange}_config`);
  };

  const handleApiSubmit = async () => {
    setTestingConnection(true);
    
    try {
      const apiUrl = window.location.hostname === 'www.voltexprofits.com' 
        ? 'https://voltex-profits-backend.onrender.com'
        : 'http://localhost:5000';
      
      console.log('🔗 Connecting to:', apiUrl);
      
      const response = await fetch(`${apiUrl}/api/trading/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          exchange: selectedExchange,
          apiKey: exchangeConfig[selectedExchange].apiKey,
          secret: exchangeConfig[selectedExchange].apiSecret,
          passphrase: exchangeConfig[selectedExchange].passphrase || null
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setExchangeConfig(prev => ({
          ...prev,
          [selectedExchange]: {
            ...prev[selectedExchange],
            status: 'connected'
          }
        }));
        alert(`✅ ${selectedExchange.toUpperCase()} connected successfully!\nBalance: $${result.balance || '0.00'}\n🚀 Ready for LIVE TRADING!`);
        setActiveModal(null);
      } else {
        alert(`❌ Connection failed: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ API Connection Error:', error);
      alert(`❌ Connection error: ${error.message}`);
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSave = (section) => {
    setIsEditing(false);
    alert(`${section} settings saved successfully!`);
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      gap: '24px'
    },
    sidebar: {
      width: '280px',
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      padding: '20px',
      height: 'fit-content',
      position: 'sticky',
      top: '20px'
    },
    sidebarTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '20px'
    },
    sectionList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    sectionItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      color: '#64748b'
    },
    sectionItemActive: {
      background: '#eff6ff',
      color: '#2563eb',
      borderLeft: '4px solid #2563eb'
    },
    sectionIcon: {
      fontSize: '18px',
      minWidth: '20px'
    },
    sectionText: {
      flex: 1
    },
    sectionName: {
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '2px'
    },
    sectionDescription: {
      fontSize: '12px',
      color: '#94a3b8'
    },
    content: {
      flex: 1,
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      padding: '24px'
    },
    contentHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '1px solid #e2e8f0'
    },
    contentTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1e293b'
    },
    editButton: {
      padding: '8px 16px',
      background: isEditing ? '#10b981' : '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151'
    },
    input: {
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      background: 'white'
    },
    inputDisabled: {
      background: '#f9fafb',
      color: '#6b7280'
    },
    select: {
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      background: 'white'
    },
    card: {
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px'
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '12px'
    },
    exchangeCard: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      marginBottom: '12px'
    },
    exchangeInfo: {
      flex: 1
    },
    exchangeName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '4px'
    },
    exchangeStatus: {
      fontSize: '12px',
      padding: '2px 8px',
      borderRadius: '12px',
      fontWeight: '500'
    },
    statusConnected: {
      background: '#d1fae5',
      color: '#065f46'
    },
    statusDisconnected: {
      background: '#fee2e2',
      color: '#991b1b'
    },
    exchangeActions: {
      display: 'flex',
      gap: '8px'
    },
    actionButton: {
      padding: '6px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      background: 'white',
      cursor: 'pointer',
      fontSize: '12px'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '400px',
      width: '90%'
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '16px'
    },
    modalActions: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '20px'
    },
    button: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer'
    },
    buttonPrimary: {
      background: '#667eea',
      color: 'white'
    },
    buttonSecondary: {
      background: '#f1f5f9',
      color: '#64748b'
    },
    warningBox: {
      padding: '12px',
      background: '#fef3c7',
      border: '1px solid #f59e0b',
      borderRadius: '6px',
      fontSize: '12px',
      color: '#92400e',
      marginTop: '12px'
    },
    liveWarningBox: {
      padding: '12px',
      background: '#fee2e2',
      border: '1px solid #dc2626',
      borderRadius: '6px',
      fontSize: '12px',
      color: '#dc2626',
      marginTop: '12px',
      fontWeight: '600'
    }
  };

  const renderExchangesSection = () => (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
          🔗 Exchange API Configuration
        </h3>
        <p style={{ fontSize: '14px', color: '#64748b' }}>
          Connect your trading accounts to enable LIVE trading with your Martingale strategies.
        </p>
      </div>

      {Object.entries(exchangeConfig).map(([exchange, config]) => (
        <div key={exchange} style={styles.exchangeCard}>
          <div style={styles.exchangeInfo}>
            <div style={styles.exchangeName}>
              {exchange.toUpperCase()}
              {exchange === 'okx' && <span style={{ color: '#10b981', marginLeft: '8px' }}>🌟 RECOMMENDED</span>}
            </div>
            <div>
              <span style={{
                ...styles.exchangeStatus,
                ...(config.status === 'connected' ? styles.statusConnected : styles.statusDisconnected)
              }}>
                {config.status}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              Leverage: {config.leverage}x • <strong style={{ color: '#dc2626' }}>LIVE TRADING</strong>
            </div>
          </div>

          <div style={styles.exchangeActions}>
            <button
              style={styles.actionButton}
              onClick={() => handleConfigureExchange(exchange)}
            >
              Configure
            </button>
          </div>
        </div>
      ))}

      <div style={styles.liveWarningBox}>
        <strong>🚨 LIVE TRADING WARNING:</strong><br/>
        • You are connecting to LIVE exchanges with REAL MONEY<br/>
        • Start with small amounts for testing<br/>
        • Your Martingale strategies will place actual trades<br/>
        • Monitor your account closely during initial testing
      </div>

      <div style={styles.warningBox}>
        <strong>⚠️ API Permissions Required:</strong><br/>
        • <strong>OKX:</strong> Trade + Read permissions + Passphrase<br/>
        • <strong>Bybit:</strong> Contract Trading + Read Position<br/>
        • <strong>Binance:</strong> Futures Trading + Read Account<br/>
        • <strong>Bitget:</strong> Contract Trading + Read Account<br/>
        <strong>Never enable withdrawal permissions!</strong>
      </div>
    </div>
  );

  const renderTradingSection = () => (
    <div>
      <div style={styles.card}>
        <div style={styles.cardTitle}>🛡️ Martingale Strategy Settings (LOCKED)</div>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
          Your tested Martingale parameters are professionally optimized and cannot be modified.
        </p>
        
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Capital Base</label>
            <input
              style={{ ...styles.input, ...styles.inputDisabled }}
              type="text"
              value="0.1% of balance"
              disabled
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🔒 Battle-tested setting</span>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Leverage</label>
            <input
              style={{ ...styles.input, ...styles.inputDisabled }}
              type="text"
              value="25x futures"
              disabled
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🔒 Optimized for safety</span>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Max Martingale Levels</label>
            <input
              style={{ ...styles.input, ...styles.inputDisabled }}
              type="text"
              value="15 levels"
              disabled
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>🔒 Risk-controlled progression</span>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Strategy Selection</label>
            <select
              style={styles.select}
              value={tradingSettings.defaultStrategy}
              onChange={(e) => setTradingSettings({ ...tradingSettings, defaultStrategy: e.target.value })}
            >
              <option value="steady_climb">🛡️ Steady Climb (Conservative)</option>
              <option value="power_surge">🚀 Power Surge (Aggressive)</option>
            </select>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>⏰ Trading Schedule</div>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={tradingSettings.tradingHours.enabled}
                onChange={(e) => setTradingSettings({
                  ...tradingSettings,
                  tradingHours: { ...tradingSettings.tradingHours, enabled: e.target.checked }
                })}
                style={{ marginRight: '8px' }}
              />
              Enable Trading Hours
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={tradingSettings.autoTradingEnabled}
                onChange={(e) => setTradingSettings({ ...tradingSettings, autoTradingEnabled: e.target.checked })}
                style={{ marginRight: '8px' }}
              />
              24/7 Auto Trading
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile': return <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Profile section - coming soon</div>;
      case 'trading': return renderTradingSection();
      case 'exchanges': return renderExchangesSection();
      case 'assets': return <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Assets section - coming soon</div>;
      case 'security': return <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Security section - coming soon</div>;
      case 'notifications': return <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Notifications section - coming soon</div>;
      case 'subscription': return <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Subscription section - coming soon</div>;
      case 'advanced': return <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Advanced section - coming soon</div>;
      default: return renderExchangesSection();
    }
  };

  const getCurrentSectionTitle = () => {
    const section = sectionItems.find(item => item.id === activeSection);
    return section ? `${section.icon} ${section.name}` : '🔗 Exchanges';
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarTitle}>⚙️ Settings</div>
        <div style={styles.sectionList}>
          {sectionItems.map(section => (
            <div
              key={section.id}
              style={{
                ...styles.sectionItem,
                ...(activeSection === section.id ? styles.sectionItemActive : {})
              }}
              onClick={() => setActiveSection(section.id)}
            >
              <span style={styles.sectionIcon}>{section.icon}</span>
              <div style={styles.sectionText}>
                <div style={styles.sectionName}>{section.name}</div>
                <div style={styles.sectionDescription}>{section.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.contentHeader}>
          <div style={styles.contentTitle}>{getCurrentSectionTitle()}</div>
          {activeSection === 'trading' && (
            <button
              style={styles.editButton}
              onClick={() => isEditing ? handleSave(activeSection) : setIsEditing(true)}
            >
              {isEditing ? '💾 Save Changes' : '✏️ Edit'}
            </button>
          )}
        </div>

        {renderContent()}
      </div>

      {activeModal && activeModal.includes('_config') && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalTitle}>
              🔗 Configure {selectedExchange?.toUpperCase()} API - LIVE TRADING
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={styles.label}>API Key</label>
              <input
                style={styles.input}
                type="text"
                value={exchangeConfig[selectedExchange]?.apiKey || ''}
                onChange={(e) => setExchangeConfig(prev => ({
                  ...prev,
                  [selectedExchange]: {
                    ...prev[selectedExchange],
                    apiKey: e.target.value
                  }
                }))}
                placeholder="Enter your API key"
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={styles.label}>Secret Key</label>
              <input
                style={styles.input}
                type="password"
                value={exchangeConfig[selectedExchange]?.apiSecret || ''}
                onChange={(e) => setExchangeConfig(prev => ({
                  ...prev,
                  [selectedExchange]: {
                    ...prev[selectedExchange],
                    apiSecret: e.target.value
                  }
                }))}
                placeholder="Enter your secret key"
              />
            </div>

            {(selectedExchange === 'okx' || selectedExchange === 'bitget') && (
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>
                  Passphrase {selectedExchange === 'okx' ? <span style={{ color: '#dc2626' }}>(Required)</span> : <span style={{ color: '#94a3b8' }}>(Optional)</span>}
                </label>
                <input
                  style={styles.input}
                  type="password"
                  value={exchangeConfig[selectedExchange]?.passphrase || ''}
                  onChange={(e) => setExchangeConfig(prev => ({
                    ...prev,
                    [selectedExchange]: {
                      ...prev[selectedExchange],
                      passphrase: e.target.value
                    }
                  }))}
                  placeholder={selectedExchange === 'okx' ? 'Enter your passphrase (required)' : 'Enter passphrase if enabled'}
                />
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  {selectedExchange === 'okx' ? 'OKX requires a passphrase for all API connections' : 'Only required if you enabled passphrase in Bitget API settings'}
                </p>
              </div>
            )}

            <div style={styles.liveWarningBox}>
              <strong>🚨 LIVE TRADING CONFIRMATION:</strong><br/>
              • This connects to REAL {selectedExchange?.toUpperCase()} account<br/>
              • Your Martingale strategies will use REAL MONEY<br/>
              • Start with small amounts for testing<br/>
              • Monitor your trades closely
            </div>

            <div style={styles.warningBox}>
              <strong>⚠️ Required Permissions:</strong><br/>
              • {selectedExchange === 'okx' ? 'Trade + Read permissions (NO withdrawals)' :
                 selectedExchange === 'bybit' ? 'Contract Trading + Read Position' : 
                 selectedExchange === 'binance' ? 'Futures Trading + Read Account' : 
                 'Contract Trading + Read Account'}<br/>
              <strong>Never enable withdrawal permissions!</strong>
            </div>
            
            <div style={styles.modalActions}>
              <button
                style={{ ...styles.button, ...styles.buttonSecondary }}
                onClick={() => setActiveModal(null)}
              >
                Cancel
              </button>
              <button
                style={{ 
                  ...styles.button, 
                  background: '#dc2626', 
                  color: 'white'
                }}
                onClick={handleApiSubmit}
                disabled={testingConnection || !exchangeConfig[selectedExchange]?.apiKey || !exchangeConfig[selectedExchange]?.apiSecret || (selectedExchange === 'okx' && !exchangeConfig[selectedExchange]?.passphrase)}
              >
                {testingConnection ? 'Connecting...' : '🚀 Connect LIVE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;