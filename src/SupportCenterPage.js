
import React, { useState, useEffect } from 'react';

function SupportCenterPage({ user }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'technical',
    priority: 'medium',
    description: ''
  });
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'support',
      message: 'Hello! How can I help you today?',
      timestamp: new Date(Date.now() - 60000),
      type: 'text'
    }
  ]);

  // Comprehensive support data
  const [supportData] = useState({
    stats: {
      avgResponseTime: '< 2 hours',
      ticketsResolved: '98.5%',
      satisfactionRate: '4.9/5',
      supportAgents: '24/7'
    },
    faqCategories: [
      { id: 'all', name: 'All Topics', count: 45 },
      { id: 'getting-started', name: 'Getting Started', count: 12 },
      { id: 'trading', name: 'Trading', count: 15 },
      { id: 'account', name: 'Account & Security', count: 8 },
      { id: 'payments', name: 'Payments & Billing', count: 6 },
      { id: 'technical', name: 'Technical Issues', count: 4 }
    ],
    faqs: [
      {
        id: 1,
        category: 'getting-started',
        question: 'How do I start trading on Voltex Profits?',
        answer: 'Getting started is easy! First, complete your account registration and verify your email. Then, connect your exchange API keys (Bybit, Binance, or Bitget) in the Settings page. Choose your preferred trading strategy (Steady Climb or Power Surge), set your risk parameters, and start with our 14-day free trial. Our Trading Academy has a complete "Platform Overview" course to guide you through every step.',
        helpful: 234,
        views: 1250,
        lastUpdated: '2024-07-05'
      },
      {
        id: 2,
        category: 'trading',
        question: 'What trading pairs are supported?',
        answer: 'Voltex Profits supports 7 major cryptocurrency trading pairs: BTC/USDT, ETH/USDT, HYPE/USDT, BNB/USDT, SOL/USDT, ADA/USDT, and XRP/USDT. You can enable/disable specific pairs and adjust allocation percentages in the Settings > Assets section. Our multi-asset approach helps diversify risk and maximize profit opportunities across different market conditions.',
        helpful: 189,
        views: 876,
        lastUpdated: '2024-07-06'
      },
      {
        id: 3,
        category: 'trading',
        question: 'What is the difference between Steady Climb and Power Surge strategies?',
        answer: 'Steady Climb is our low-risk strategy designed for consistent, smaller profits with minimal drawdown. It typically achieves 2-5% returns per trade with a 76%+ win rate. Power Surge is our high-return strategy for experienced traders, targeting 5-15% returns per trade with higher volatility. Power Surge has shown exceptional performance with HYPE/USDT, achieving 67%+ annual returns. Both strategies use our proprietary Martingale system for position management.',
        helpful: 167,
        views: 743,
        lastUpdated: '2024-07-04'
      },
      {
        id: 4,
        category: 'account',
        question: 'How do I enable two-factor authentication (2FA)?',
        answer: 'To enable 2FA, go to Settings > Security and toggle "Two-Factor Authentication" to ON. You\'ll need an authenticator app like Google Authenticator or Authy. Scan the QR code displayed, enter the 6-digit code from your app, and save. 2FA adds an extra layer of security to your account and is highly recommended for protecting your trading activities and funds.',
        helpful: 145,
        views: 623,
        lastUpdated: '2024-07-03'
      },
      {
        id: 5,
        category: 'payments',
        question: 'What payment methods do you accept?',
        answer: 'We accept USDT (TRC20) cryptocurrency payments for all subscription plans. Our premium plan is $15/month with a 14-day free trial. USDT payments are processed instantly and provide the highest security. We chose USDT to align with the cryptocurrency trading focus of our platform and to ensure fast, global payment processing.',
        helpful: 198,
        views: 892,
        lastUpdated: '2024-07-06'
      },
      {
        id: 6,
        category: 'technical',
        question: 'Why am I getting API connection errors?',
        answer: 'API connection errors usually occur due to: 1) Incorrect API keys - verify your keys in Settings > Exchanges, 2) IP restrictions on your exchange account - add our server IPs to your exchange whitelist, 3) Insufficient API permissions - ensure "Spot Trading" permissions are enabled, 4) Exchange maintenance - check your exchange status page. Use our "Test Connection" button to diagnose issues quickly.',
        helpful: 156,
        views: 534,
        lastUpdated: '2024-07-05'
      },
      {
        id: 7,
        category: 'trading',
        question: 'How does the Martingale system work?',
        answer: 'Our Martingale system is a position management technique that doubles position size after losses to recover quickly when the market turns favorable. It\'s limited to 3-5 levels maximum to control risk. For example, if a $100 trade loses, the next trade might be $200 to recover the loss plus profit. This system works best in ranging markets and is automatically managed by our algorithms with strict risk controls.',
        helpful: 134,
        views: 687,
        lastUpdated: '2024-07-04'
      },
      {
        id: 8,
        category: 'account',
        question: 'How do I change my subscription plan?',
        answer: 'To change your subscription, go to Settings > Subscription and click "Manage Billing" or "Upgrade to Premium". If you\'re on the free trial, you can upgrade anytime to premium. Downgrades take effect at the next billing cycle. All plan changes are processed immediately, and you\'ll receive email confirmation of any billing changes.',
        helpful: 112,
        views: 445,
        lastUpdated: '2024-07-05'
      }
    ],
    tutorials: [
      {
        id: 1,
        title: 'Complete Platform Setup Guide',
        description: 'Step-by-step walkthrough of account setup and first trade',
        duration: '12:34',
        views: 2341,
        category: 'getting-started',
        thumbnail: '🎬',
        url: '#'
      },
      {
        id: 2,
        title: 'API Configuration for Bybit',
        description: 'How to safely connect your Bybit account',
        duration: '8:45',
        views: 1876,
        category: 'technical',
        thumbnail: '🔗',
        url: '#'
      },
      {
        id: 3,
        title: 'Understanding Multi-Asset Trading',
        description: 'Portfolio diversification across 7 trading pairs',
        duration: '15:22',
        views: 1654,
        category: 'trading',
        thumbnail: '📊',
        url: '#'
      },
      {
        id: 4,
        title: 'Risk Management Best Practices',
        description: 'Protect your capital with proper position sizing',
        duration: '10:18',
        views: 1432,
        category: 'trading',
        thumbnail: '🛡️',
        url: '#'
      }
    ],
    ticketCategories: [
      { id: 'technical', name: 'Technical Issue' },
      { id: 'trading', name: 'Trading Question' },
      { id: 'account', name: 'Account & Security' },
      { id: 'billing', name: 'Billing & Payments' },
      { id: 'feature', name: 'Feature Request' },
      { id: 'other', name: 'Other' }
    ],
    priorities: [
      { id: 'low', name: 'Low', color: '#10b981' },
      { id: 'medium', name: 'Medium', color: '#f59e0b' },
      { id: 'high', name: 'High', color: '#ef4444' },
      { id: 'urgent', name: 'Urgent', color: '#8b5cf6' }
    ]
  });

  const filteredFAQs = supportData.faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTicketSubmit = () => {
    if (!ticketForm.subject || !ticketForm.description) {
      alert('Please fill in all required fields');
      return;
    }
    
    alert(`Support ticket submitted successfully!\n\nTicket ID: #VT-${Date.now()}\nSubject: ${ticketForm.subject}\nCategory: ${ticketForm.category}\nPriority: ${ticketForm.priority}\n\nYou'll receive an email confirmation shortly. Our team typically responds within ${supportData.stats.avgResponseTime}.`);
    
    setTicketForm({
      subject: '',
      category: 'technical',
      priority: 'medium',
      description: ''
    });
  };

  const handleChatSend = (message) => {
    if (!message.trim()) return;
    
    const userMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      message: message,
      timestamp: new Date(),
      type: 'text'
    };
    
    setChatMessages([...chatMessages, userMessage]);
    
    // Simulate support response
    setTimeout(() => {
      const supportMessage = {
        id: chatMessages.length + 2,
        sender: 'support',
        message: 'Thanks for your message! I\'m reviewing your question and will provide a detailed response shortly. In the meantime, you might find our FAQ section helpful for common questions.',
        timestamp: new Date(),
        type: 'text'
      };
      setChatMessages(prev => [...prev, supportMessage]);
    }, 2000);
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '30px',
      textAlign: 'center'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#6B7280',
      fontSize: '16px',
      marginBottom: '20px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '40px'
    },
    statCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      textAlign: 'center'
    },
    statCardPrimary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    },
    statValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '4px'
    },
    statValueWhite: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '4px'
    },
    statLabel: {
      fontSize: '14px',
      color: '#64748b'
    },
    statLabelWhite: {
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.9)'
    },
    navigationTabs: {
      display: 'flex',
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      marginBottom: '24px',
      overflow: 'hidden'
    },
    navTab: {
      flex: 1,
      padding: '16px 24px',
      background: 'none',
      border: 'none',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      borderBottom: '3px solid transparent',
      color: '#64748b'
    },
    navTabActive: {
      color: '#2563eb',
      borderBottomColor: '#2563eb',
      background: '#f8fafc'
    },
    content: {
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      padding: '24px'
    },
    searchSection: {
      marginBottom: '24px'
    },
    searchContainer: {
      display: 'flex',
      gap: '16px',
      marginBottom: '16px'
    },
    searchInput: {
      flex: 1,
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px'
    },
    categoryFilter: {
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      background: 'white',
      minWidth: '200px'
    },
    faqList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    faqItem: {
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      overflow: 'hidden'
    },
    faqHeader: {
      padding: '16px 20px',
      background: '#f8fafc',
      cursor: 'pointer',
      transition: 'background 0.2s'
    },
    faqQuestion: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '8px'
    },
    faqMeta: {
      display: 'flex',
      gap: '16px',
      fontSize: '12px',
      color: '#64748b'
    },
    faqAnswer: {
      padding: '20px',
      borderTop: '1px solid #e2e8f0',
      fontSize: '14px',
      color: '#4b5563',
      lineHeight: '1.6'
    },
    faqActions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: '1px solid #f1f5f9'
    },
    helpfulSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '12px',
      color: '#64748b'
    },
    helpfulButton: {
      padding: '4px 8px',
      border: '1px solid #e2e8f0',
      borderRadius: '4px',
      background: 'white',
      cursor: 'pointer',
      fontSize: '12px'
    },
    tutorialsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px'
    },
    tutorialCard: {
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '20px',
      transition: 'all 0.2s',
      cursor: 'pointer'
    },
    tutorialHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px'
    },
    tutorialThumbnail: {
      fontSize: '24px',
      background: '#f8fafc',
      borderRadius: '8px',
      padding: '8px',
      minWidth: '40px',
      textAlign: 'center'
    },
    tutorialTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '4px'
    },
    tutorialDescription: {
      fontSize: '14px',
      color: '#64748b'
    },
    tutorialMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: '#64748b',
      marginTop: '12px'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      marginBottom: '20px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    formGroupFull: {
      gridColumn: '1 / -1'
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
      fontSize: '14px'
    },
    select: {
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      background: 'white'
    },
    textarea: {
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      minHeight: '120px',
      resize: 'vertical'
    },
    submitButton: {
      padding: '12px 24px',
      background: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer'
    },
    chatWidget: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000
    },
    chatButton: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: '#667eea',
      color: 'white',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    },
    chatWindow: {
      position: 'absolute',
      bottom: '70px',
      right: '0',
      width: '350px',
      height: '500px',
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      flexDirection: 'column'
    },
    chatHeader: {
      padding: '16px',
      borderBottom: '1px solid #e2e8f0',
      background: '#667eea',
      color: 'white',
      borderRadius: '12px 12px 0 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    chatMessages: {
      flex: 1,
      padding: '16px',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    chatMessage: {
      maxWidth: '80%',
      padding: '8px 12px',
      borderRadius: '8px',
      fontSize: '14px'
    },
    chatMessageUser: {
      alignSelf: 'flex-end',
      background: '#667eea',
      color: 'white'
    },
    chatMessageSupport: {
      alignSelf: 'flex-start',
      background: '#f1f5f9',
      color: '#1e293b'
    },
    chatInput: {
      display: 'flex',
      padding: '16px',
      borderTop: '1px solid #e2e8f0',
      gap: '8px'
    },
    chatInputField: {
      flex: 1,
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px'
    },
    chatSendButton: {
      padding: '8px 16px',
      background: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer'
    }
  };

  const renderOverview = () => (
    <div>
      <div style={styles.searchSection}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
          🔍 Quick Help Search
        </h3>
        <div style={styles.searchContainer}>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search for help articles, guides, or common questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button style={styles.submitButton}>Search</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          border: '1px solid #bbf7d0',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📚</div>
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Knowledge Base</h4>
          <p style={{ fontSize: '14px', color: '#15803d', marginBottom: '16px' }}>
            Comprehensive guides and tutorials
          </p>
          <button
            style={styles.submitButton}
            onClick={() => setActiveSection('faq')}
          >
            Browse FAQs
          </button>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          border: '1px solid #93c5fd',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎬</div>
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Video Tutorials</h4>
          <p style={{ fontSize: '14px', color: '#1e40af', marginBottom: '16px' }}>
            Step-by-step video guides
          </p>
          <button
            style={styles.submitButton}
            onClick={() => setActiveSection('tutorials')}
          >
            Watch Videos
          </button>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
          border: '1px solid #fcd34d',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎫</div>
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Support Ticket</h4>
          <p style={{ fontSize: '14px', color: '#92400e', marginBottom: '16px' }}>
            Get personalized help from our team
          </p>
          <button
            style={styles.submitButton}
            onClick={() => setActiveSection('tickets')}
          >
            Create Ticket
          </button>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
          border: '1px solid #c4b5fd',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>💬</div>
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Live Chat</h4>
          <p style={{ fontSize: '14px', color: '#7c3aed', marginBottom: '16px' }}>
            Chat with our support team
          </p>
          <button
            style={styles.submitButton}
            onClick={() => setChatOpen(true)}
          >
            Start Chat
          </button>
        </div>
      </div>
    </div>
  );

  const renderFAQ = () => (
    <div>
      <div style={styles.searchSection}>
        <div style={styles.searchContainer}>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search frequently asked questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            style={styles.categoryFilter}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {supportData.faqCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name} ({category.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.faqList}>
        {filteredFAQs.map(faq => (
          <div key={faq.id} style={styles.faqItem}>
            <div style={styles.faqHeader}>
              <div style={styles.faqQuestion}>{faq.question}</div>
              <div style={styles.faqMeta}>
                <span>👁️ {faq.views} views</span>
                <span>👍 {faq.helpful} helpful</span>
                <span>📅 Updated {faq.lastUpdated}</span>
              </div>
            </div>
            <div style={styles.faqAnswer}>
              {faq.answer}
              <div style={styles.faqActions}>
                <div style={styles.helpfulSection}>
                  <span>Was this helpful?</span>
                  <button style={styles.helpfulButton}>👍 Yes</button>
                  <button style={styles.helpfulButton}>👎 No</button>
                </div>
                <button style={styles.helpfulButton}>🔗 Share</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTutorials = () => (
    <div>
      <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
        🎬 Video Tutorials
      </h3>
      <div style={styles.tutorialsGrid}>
        {supportData.tutorials.map(tutorial => (
          <div
            key={tutorial.id}
            style={styles.tutorialCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={styles.tutorialHeader}>
              <div style={styles.tutorialThumbnail}>{tutorial.thumbnail}</div>
              <div>
                <div style={styles.tutorialTitle}>{tutorial.title}</div>
                <div style={styles.tutorialDescription}>{tutorial.description}</div>
              </div>
            </div>
            <div style={styles.tutorialMeta}>
              <span>⏱️ {tutorial.duration}</span>
              <span>👁️ {tutorial.views} views</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTickets = () => (
    <div>
      <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
        🎫 Create Support Ticket
      </h3>
      <div style={styles.formGrid}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Subject *</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Brief description of your issue"
            value={ticketForm.subject}
            onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Category</label>
          <select
            style={styles.select}
            value={ticketForm.category}
            onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
          >
            {supportData.ticketCategories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Priority</label>
          <select
            style={styles.select}
            value={ticketForm.priority}
            onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
          >
            {supportData.priorities.map(priority => (
              <option key={priority.id} value={priority.id}>{priority.name}</option>
            ))}
          </select>
        </div>

        <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
          <label style={styles.label}>Description *</label>
          <textarea
            style={styles.textarea}
            placeholder="Please provide detailed information about your issue, including any error messages, steps you've taken, and what you were trying to accomplish..."
            value={ticketForm.description}
            onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
          />
        </div>
      </div>

      <div style={{
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#15803d', marginBottom: '8px' }}>
          📋 Before submitting your ticket:
        </h4>
        <ul style={{ fontSize: '12px', color: '#15803d', paddingLeft: '20px' }}>
          <li>Check our FAQ section for common solutions</li>
          <li>Include your account email and any relevant trade IDs</li>
          <li>Describe the issue step-by-step</li>
          <li>Attach screenshots if helpful (you can email them to support@voltexprofits.com)</li>
        </ul>
      </div>

      <button
        style={styles.submitButton}
        onClick={handleTicketSubmit}
      >
        🚀 Submit Ticket
      </button>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'faq': return renderFAQ();
      case 'tutorials': return renderTutorials();
      case 'tickets': return renderTickets();
      default: return renderOverview();
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>📞 Support Center</div>
        <div style={styles.subtitle}>
          Get help with trading, account management, and platform features
        </div>
      </div>

      {/* Support Stats */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, ...styles.statCardPrimary }}>
          <div style={styles.statValueWhite}>{supportData.stats.avgResponseTime}</div>
          <div style={styles.statLabelWhite}>Average Response Time</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statValue}>{supportData.stats.ticketsResolved}</div>
          <div style={styles.statLabel}>Tickets Resolved</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statValue}>{supportData.stats.satisfactionRate}</div>
          <div style={styles.statLabel}>Customer Satisfaction</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statValue}>{supportData.stats.supportAgents}</div>
          <div style={styles.statLabel}>Support Available</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={styles.navigationTabs}>
        {[
          { id: 'overview', name: '🏠 Overview', icon: '🏠' },
          { id: 'faq', name: '❓ FAQ', icon: '❓' },
          { id: 'tutorials', name: '🎬 Tutorials', icon: '🎬' },
          { id: 'tickets', name: '🎫 Tickets', icon: '🎫' }
        ].map(tab => (
          <button
            key={tab.id}
            style={{
              ...styles.navTab,
              ...(activeSection === tab.id ? styles.navTabActive : {})
            }}
            onClick={() => setActiveSection(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={styles.content}>
        {renderContent()}
      </div>

      {/* Live Chat Widget */}
      <div style={styles.chatWidget}>
        {chatOpen && (
          <div style={styles.chatWindow}>
            <div style={styles.chatHeader}>
              <div>
                <div style={{ fontWeight: '600' }}>💬 Live Support</div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>We're here to help!</div>
              </div>
              <button
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                onClick={() => setChatOpen(false)}
              >
                ✕
              </button>
            </div>

            <div style={styles.chatMessages}>
              {chatMessages.map(message => (
                <div
                  key={message.id}
                  style={{
                    ...styles.chatMessage,
                    ...(message.sender === 'user' ? styles.chatMessageUser : styles.chatMessageSupport)
                  }}
                >
                  {message.message}
                </div>
              ))}
            </div>

            <div style={styles.chatInput}>
              <input
                style={styles.chatInputField}
                type="text"
                placeholder="Type your message..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleChatSend(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <button
                style={styles.chatSendButton}
                onClick={(e) => {
                  const input = e.target.previousElementSibling;
                  handleChatSend(input.value);
                  input.value = '';
                }}
              >
                Send
              </button>
            </div>
          </div>
        )}

        <button
          style={styles.chatButton}
          onClick={() => setChatOpen(!chatOpen)}
        >
          {chatOpen ? '✕' : '💬'}
        </button>
      </div>
    </div>
  );
}

export default SupportCenterPage;