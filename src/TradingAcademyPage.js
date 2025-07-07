
import React, { useState, useEffect } from 'react';

function TradingAcademyPage({ user }) {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [userProgress, setUserProgress] = useState({
    coursesCompleted: 3,
    totalCourses: 12,
    certificatesEarned: 1,
    studyTime: 145,
    currentStreak: 7
  });

  // Comprehensive academy content
  const [academyData] = useState({
    categories: [
      { id: 'getting-started', name: 'Getting Started', icon: '🚀', description: 'Platform basics' },
      { id: 'strategies', name: 'Trading Strategies', icon: '📊', description: 'Advanced techniques' },
      { id: 'risk-management', name: 'Risk Management', icon: '🛡️', description: 'Protect your capital' },
      { id: 'market-analysis', name: 'Market Analysis', icon: '📈', description: 'Technical & fundamental' },
      { id: 'multi-asset', name: 'Multi-Asset Trading', icon: '💰', description: 'Portfolio diversification' },
      { id: 'advanced', name: 'Advanced Topics', icon: '🎯', description: 'Expert-level content' }
    ],
    courses: {
      'getting-started': [
        {
          id: 'platform-overview',
          title: 'Voltex Profits Platform Overview',
          description: 'Complete introduction to the trading platform',
          duration: '25 min',
          difficulty: 'Beginner',
          completion: 100,
          rating: 4.8,
          lessons: 6,
          thumbnail: '🖥️',
          topics: ['Dashboard Navigation', 'Account Setup', 'Basic Settings', 'First Trade', 'Safety Features', 'Support Resources']
        },
        {
          id: 'crypto-basics',
          title: 'Cryptocurrency Trading Fundamentals',
          description: 'Essential concepts for crypto trading success',
          duration: '35 min',
          difficulty: 'Beginner',
          completion: 100,
          rating: 4.9,
          lessons: 8,
          thumbnail: '₿',
          topics: ['What is Crypto?', 'Market Basics', 'Trading Pairs', 'Order Types', 'Fees & Spreads', 'Market Hours', 'Volatility', 'Security']
        },
        {
          id: 'account-security',
          title: 'Account Security Best Practices',
          description: 'Protect your account and funds',
          duration: '15 min',
          difficulty: 'Beginner',
          completion: 75,
          rating: 4.7,
          lessons: 4,
          thumbnail: '🔒',
          topics: ['Strong Passwords', '2FA Setup', 'API Security', 'Phishing Protection']
        }
      ],
      'strategies': [
        {
          id: 'steady-climb-mastery',
          title: 'Steady Climb Strategy Mastery',
          description: 'Master the low-risk, consistent profit strategy',
          duration: '45 min',
          difficulty: 'Intermediate',
          completion: 60,
          rating: 4.9,
          lessons: 10,
          thumbnail: '📊',
          topics: ['Strategy Overview', 'Entry Signals', 'Exit Rules', 'Risk Parameters', 'Position Sizing', 'Backtesting', 'Live Examples', 'Optimization', 'Multi-Asset Application', 'Performance Tracking']
        },
        {
          id: 'power-surge-advanced',
          title: 'Power Surge Strategy Deep Dive',
          description: 'High-return strategy for experienced traders',
          duration: '55 min',
          difficulty: 'Advanced',
          completion: 0,
          rating: 4.8,
          lessons: 12,
          thumbnail: '🚀',
          topics: ['Advanced Signals', 'Momentum Analysis', 'Risk Management', 'Leveraged Trading', 'Market Timing', 'Volatility Trading', 'Stop Loss Strategies', 'Profit Maximization', 'Psychology', 'Advanced Tools', 'Portfolio Integration', 'Performance Optimization']
        },
        {
          id: 'martingale-system',
          title: 'Martingale System & Grid Trading',
          description: 'Advanced position management techniques',
          duration: '40 min',
          difficulty: 'Advanced',
          completion: 0,
          rating: 4.6,
          lessons: 9,
          thumbnail: '🎯',
          topics: ['Martingale Basics', 'Grid Setup', 'Risk Calculations', 'Exit Strategies', 'Capital Requirements', 'Drawdown Management', 'Multi-Level Trading', 'Automation', 'Real Examples']
        }
      ],
      'risk-management': [
        {
          id: 'position-sizing',
          title: 'Position Sizing & Capital Management',
          description: 'Optimize your trade sizes for maximum safety',
          duration: '30 min',
          difficulty: 'Intermediate',
          completion: 100,
          rating: 4.9,
          lessons: 7,
          thumbnail: '💼',
          topics: ['Kelly Criterion', 'Fixed Percentage', 'Volatility Sizing', 'Risk-Reward Ratios', 'Portfolio Heat', 'Correlation Analysis', 'Dynamic Sizing']
        },
        {
          id: 'stop-loss-mastery',
          title: 'Stop Loss Strategies',
          description: 'Protect your capital with smart exit rules',
          duration: '25 min',
          difficulty: 'Beginner',
          completion: 40,
          rating: 4.8,
          lessons: 6,
          thumbnail: '🛑',
          topics: ['Fixed Stop Loss', 'Trailing Stops', 'ATR-Based Stops', 'Support/Resistance', 'Time-Based Exits', 'Breakeven Rules']
        },
        {
          id: 'portfolio-diversification',
          title: 'Multi-Asset Portfolio Diversification',
          description: 'Spread risk across different cryptocurrencies',
          duration: '35 min',
          difficulty: 'Intermediate',
          completion: 0,
          rating: 4.7,
          lessons: 8,
          thumbnail: '🌍',
          topics: ['Correlation Analysis', 'Asset Allocation', 'Rebalancing', 'Risk Budgeting', 'Sector Diversification', 'Geographic Spread', 'Temporal Diversification', 'Performance Monitoring']
        }
      ],
      'market-analysis': [
        {
          id: 'technical-analysis',
          title: 'Technical Analysis for Crypto',
          description: 'Read charts like a professional trader',
          duration: '50 min',
          difficulty: 'Intermediate',
          completion: 0,
          rating: 4.8,
          lessons: 11,
          thumbnail: '📈',
          topics: ['Chart Patterns', 'Support & Resistance', 'Trend Lines', 'Moving Averages', 'RSI & MACD', 'Volume Analysis', 'Fibonacci', 'Candlestick Patterns', 'Multiple Timeframes', 'Entry/Exit Timing', 'Market Psychology']
        },
        {
          id: 'fundamental-analysis',
          title: 'Cryptocurrency Fundamental Analysis',
          description: 'Evaluate crypto projects and market conditions',
          duration: '40 min',
          difficulty: 'Advanced',
          completion: 0,
          rating: 4.6,
          lessons: 9,
          thumbnail: '🔍',
          topics: ['Project Evaluation', 'Tokenomics', 'Market Cap Analysis', 'News Impact', 'Regulatory Factors', 'Adoption Metrics', 'Team & Technology', 'Competitive Analysis', 'Macro Trends']
        }
      ],
      'multi-asset': [
        {
          id: 'asset-correlation',
          title: 'Understanding Asset Correlations',
          description: 'How different cryptocurrencies move together',
          duration: '30 min',
          difficulty: 'Intermediate',
          completion: 0,
          rating: 4.7,
          lessons: 7,
          thumbnail: '🔗',
          topics: ['Correlation Basics', 'BTC Dominance', 'Alt Season', 'Market Cycles', 'Pair Trading', 'Hedging Strategies', 'Risk Reduction']
        },
        {
          id: 'cross-asset-strategies',
          title: 'Cross-Asset Trading Strategies',
          description: 'Advanced multi-pair trading techniques',
          duration: '45 min',
          difficulty: 'Advanced',
          completion: 0,
          rating: 4.8,
          lessons: 10,
          thumbnail: '⚖️',
          topics: ['Arbitrage Opportunities', 'Spread Trading', 'Statistical Arbitrage', 'Mean Reversion', 'Momentum Strategies', 'Sector Rotation', 'Risk Parity', 'Alpha Generation', 'Portfolio Optimization', 'Execution Strategies']
        }
      ],
      'advanced': [
        {
          id: 'algo-trading',
          title: 'Algorithmic Trading Concepts',
          description: 'Understanding automated trading systems',
          duration: '60 min',
          difficulty: 'Expert',
          completion: 0,
          rating: 4.9,
          lessons: 13,
          thumbnail: '🤖',
          topics: ['Algorithm Design', 'Backtesting', 'Parameter Optimization', 'Execution Algorithms', 'Market Microstructure', 'Latency Optimization', 'Risk Controls', 'Performance Attribution', 'Live Trading', 'System Monitoring', 'Disaster Recovery', 'Regulatory Compliance', 'Future Trends']
        },
        {
          id: 'psychology-mastery',
          title: 'Trading Psychology & Discipline',
          description: 'Master your emotions for consistent profits',
          duration: '35 min',
          difficulty: 'Intermediate',
          completion: 0,
          rating: 4.8,
          lessons: 8,
          thumbnail: '🧠',
          topics: ['Emotional Control', 'Fear & Greed', 'Discipline Building', 'Decision Making', 'Stress Management', 'Cognitive Biases', 'Routine Development', 'Performance Review']
        }
      ]
    },
    achievements: [
      { id: 'first-course', title: 'First Steps', description: 'Completed your first course', icon: '🎓', earned: true },
      { id: 'strategy-master', title: 'Strategy Master', description: 'Completed all strategy courses', icon: '📊', earned: true },
      { id: 'risk-aware', title: 'Risk Aware', description: 'Mastered risk management', icon: '🛡️', earned: false },
      { id: 'multi-asset', title: 'Multi-Asset Pro', description: 'Expert in portfolio diversification', icon: '💰', earned: false },
      { id: 'speed-learner', title: 'Speed Learner', description: '5+ courses in one week', icon: '⚡', earned: false },
      { id: 'perfect-score', title: 'Perfect Score', description: '100% on all quizzes', icon: '🏆', earned: false }
    ]
  });

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': '#10b981',
      'Intermediate': '#f59e0b',
      'Advanced': '#ef4444',
      'Expert': '#8b5cf6'
    };
    return colors[difficulty] || '#64748b';
  };

  const getProgressColor = (completion) => {
    if (completion === 0) return '#e2e8f0';
    if (completion < 50) return '#f59e0b';
    if (completion < 100) return '#3b82f6';
    return '#10b981';
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
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '30px'
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
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '4px'
    },
    statValueWhite: {
      fontSize: '28px',
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
    mainContent: {
      display: 'grid',
      gridTemplateColumns: '280px 1fr',
      gap: '24px'
    },
    sidebar: {
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
    categoryList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    categoryItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      color: '#64748b'
    },
    categoryItemActive: {
      background: '#eff6ff',
      color: '#2563eb',
      borderLeft: '4px solid #2563eb'
    },
    categoryIcon: {
      fontSize: '18px',
      minWidth: '20px'
    },
    categoryText: {
      flex: 1
    },
    categoryName: {
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '2px'
    },
    categoryDescription: {
      fontSize: '12px',
      color: '#94a3b8'
    },
    content: {
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      padding: '24px'
    },
    contentHeader: {
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '1px solid #e2e8f0'
    },
    contentTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '8px'
    },
    contentDescription: {
      color: '#64748b',
      fontSize: '16px'
    },
    coursesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '20px'
    },
    courseCard: {
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '20px',
      transition: 'all 0.2s',
      cursor: 'pointer',
      background: 'white'
    },
    courseCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)'
    },
    courseHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      marginBottom: '16px'
    },
    courseThumbnail: {
      fontSize: '32px',
      background: '#f8fafc',
      borderRadius: '8px',
      padding: '12px',
      minWidth: '56px',
      textAlign: 'center'
    },
    courseInfo: {
      flex: 1
    },
    courseTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '8px'
    },
    courseDescription: {
      fontSize: '14px',
      color: '#64748b',
      marginBottom: '12px'
    },
    courseMeta: {
      display: 'flex',
      gap: '16px',
      fontSize: '12px',
      color: '#64748b',
      marginBottom: '12px'
    },
    difficultyBadge: {
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '500',
      color: 'white'
    },
    progressSection: {
      marginTop: '16px'
    },
    progressLabel: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: '#64748b',
      marginBottom: '6px'
    },
    progressBar: {
      height: '6px',
      background: '#f1f5f9',
      borderRadius: '3px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      transition: 'width 0.3s ease'
    },
    courseTopics: {
      marginTop: '16px'
    },
    topicsTitle: {
      fontSize: '12px',
      fontWeight: '500',
      color: '#64748b',
      marginBottom: '8px'
    },
    topicsList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px'
    },
    topicTag: {
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '4px',
      padding: '4px 8px',
      fontSize: '11px',
      color: '#64748b'
    },
    achievementsSection: {
      marginTop: '40px',
      padding: '24px',
      background: '#f8fafc',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    },
    achievementsTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '20px'
    },
    achievementsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px'
    },
    achievementCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px',
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0'
    },
    achievementCardEarned: {
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      border: '1px solid #bbf7d0'
    },
    achievementIcon: {
      fontSize: '24px',
      filter: 'grayscale(100%)',
      opacity: 0.5
    },
    achievementIconEarned: {
      filter: 'none',
      opacity: 1
    },
    achievementInfo: {
      flex: 1
    },
    achievementTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '4px'
    },
    achievementDescription: {
      fontSize: '12px',
      color: '#64748b'
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
      maxWidth: '600px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#1e293b'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#64748b'
    },
    lessonList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    lessonItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
      background: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0'
    },
    lessonName: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#1e293b'
    },
    lessonDuration: {
      fontSize: '12px',
      color: '#64748b'
    },
    startButton: {
      width: '100%',
      padding: '12px 24px',
      background: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      marginTop: '20px'
    }
  };

  const getCurrentCategory = () => {
    return academyData.categories.find(cat => cat.id === activeCategory);
  };

  const getCurrentCourses = () => {
    return academyData.courses[activeCategory] || [];
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const handleStartCourse = () => {
    alert(`Starting course: ${selectedCourse.title}\n\nThis would open the interactive learning module with video lessons, quizzes, and practical exercises.`);
    setSelectedCourse(null);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>🎓 Trading Academy</div>
        <div style={styles.subtitle}>
          Master cryptocurrency trading with our comprehensive educational platform
        </div>
      </div>

      {/* Progress Stats */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, ...styles.statCardPrimary }}>
          <div style={styles.statValueWhite}>{userProgress.coursesCompleted}/{userProgress.totalCourses}</div>
          <div style={styles.statLabelWhite}>Courses Completed</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statValue}>{userProgress.certificatesEarned}</div>
          <div style={styles.statLabel}>Certificates Earned</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statValue}>{formatTime(userProgress.studyTime)}</div>
          <div style={styles.statLabel}>Study Time</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statValue}>{userProgress.currentStreak}</div>
          <div style={styles.statLabel}>Day Streak</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statValue}>
            {Math.round((userProgress.coursesCompleted / userProgress.totalCourses) * 100)}%
          </div>
          <div style={styles.statLabel}>Overall Progress</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarTitle}>📚 Course Categories</div>
          <div style={styles.categoryList}>
            {academyData.categories.map(category => (
              <div
                key={category.id}
                style={{
                  ...styles.categoryItem,
                  ...(activeCategory === category.id ? styles.categoryItemActive : {})
                }}
                onClick={() => setActiveCategory(category.id)}
              >
                <span style={styles.categoryIcon}>{category.icon}</span>
                <div style={styles.categoryText}>
                  <div style={styles.categoryName}>{category.name}</div>
                  <div style={styles.categoryDescription}>{category.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={styles.content}>
          <div style={styles.contentHeader}>
            <div style={styles.contentTitle}>
              {getCurrentCategory()?.icon} {getCurrentCategory()?.name}
            </div>
            <div style={styles.contentDescription}>
              {getCurrentCategory()?.description === 'Platform basics' && 
                'Start your journey with essential platform knowledge and trading fundamentals'}
              {getCurrentCategory()?.description === 'Advanced techniques' && 
                'Master our proprietary trading strategies for consistent profits'}
              {getCurrentCategory()?.description === 'Protect your capital' && 
                'Learn essential risk management to preserve and grow your capital'}
              {getCurrentCategory()?.description === 'Technical & fundamental' && 
                'Analyze markets like a professional trader'}
              {getCurrentCategory()?.description === 'Portfolio diversification' && 
                'Advanced multi-asset trading and portfolio management'}
              {getCurrentCategory()?.description === 'Expert-level content' && 
                'Cutting-edge topics for experienced traders'}
            </div>
          </div>

          {/* Courses Grid */}
          <div style={styles.coursesGrid}>
            {getCurrentCourses().map(course => (
              <div
                key={course.id}
                style={styles.courseCard}
                onClick={() => handleCourseClick(course)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={styles.courseHeader}>
                  <div style={styles.courseThumbnail}>{course.thumbnail}</div>
                  <div style={styles.courseInfo}>
                    <div style={styles.courseTitle}>{course.title}</div>
                    <div style={styles.courseDescription}>{course.description}</div>
                    
                    <div style={styles.courseMeta}>
                      <span>⏱️ {course.duration}</span>
                      <span>📚 {course.lessons} lessons</span>
                      <span>⭐ {course.rating}</span>
                    </div>
                    
                    <span style={{
                      ...styles.difficultyBadge,
                      backgroundColor: getDifficultyColor(course.difficulty)
                    }}>
                      {course.difficulty}
                    </span>
                  </div>
                </div>

                <div style={styles.progressSection}>
                  <div style={styles.progressLabel}>
                    <span>Progress</span>
                    <span>{course.completion}%</span>
                  </div>
                  <div style={styles.progressBar}>
                    <div 
                      style={{
                        ...styles.progressFill,
                        width: `${course.completion}%`,
                        backgroundColor: getProgressColor(course.completion)
                      }}
                    />
                  </div>
                </div>

                <div style={styles.courseTopics}>
                  <div style={styles.topicsTitle}>Topics Covered:</div>
                  <div style={styles.topicsList}>
                    {course.topics.slice(0, 4).map((topic, index) => (
                      <span key={index} style={styles.topicTag}>{topic}</span>
                    ))}
                    {course.topics.length > 4 && (
                      <span style={styles.topicTag}>+{course.topics.length - 4} more</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div style={styles.achievementsSection}>
        <div style={styles.achievementsTitle}>🏆 Achievements</div>
        <div style={styles.achievementsGrid}>
          {academyData.achievements.map(achievement => (
            <div 
              key={achievement.id}
              style={{
                ...styles.achievementCard,
                ...(achievement.earned ? styles.achievementCardEarned : {})
              }}
            >
              <div style={{
                ...styles.achievementIcon,
                ...(achievement.earned ? styles.achievementIconEarned : {})
              }}>
                {achievement.icon}
              </div>
              <div style={styles.achievementInfo}>
                <div style={styles.achievementTitle}>{achievement.title}</div>
                <div style={styles.achievementDescription}>{achievement.description}</div>
              </div>
              {achievement.earned && (
                <div style={{ fontSize: '16px', color: '#10b981' }}>✓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>
                {selectedCourse.thumbnail} {selectedCourse.title}
              </div>
              <button 
                style={styles.closeButton}
                onClick={() => setSelectedCourse(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '16px', color: '#64748b', marginBottom: '12px' }}>
                {selectedCourse.description}
              </div>
              
              <div style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '20px',
                fontSize: '14px',
                color: '#64748b'
              }}>
                <span>⏱️ Duration: {selectedCourse.duration}</span>
                <span>📚 {selectedCourse.lessons} lessons</span>
                <span>⭐ Rating: {selectedCourse.rating}/5.0</span>
                <span style={{
                  backgroundColor: getDifficultyColor(selectedCourse.difficulty),
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}>
                  {selectedCourse.difficulty}
                </span>
              </div>

              <div style={styles.progressSection}>
                <div style={styles.progressLabel}>
                  <span>Your Progress</span>
                  <span>{selectedCourse.completion}%</span>
                </div>
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: `${selectedCourse.completion}%`,
                      backgroundColor: getProgressColor(selectedCourse.completion)
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                📋 Course Curriculum
              </div>
              <div style={styles.lessonList}>
                {selectedCourse.topics.map((topic, index) => (
                  <div key={index} style={styles.lessonItem}>
                    <div style={styles.lessonName}>
                      {index + 1}. {topic}
                    </div>
                    <div style={styles.lessonDuration}>
                      {Math.ceil(parseInt(selectedCourse.duration) / selectedCourse.lessons)} min
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '14px', color: '#15803d', fontWeight: '500', marginBottom: '8px' }}>
                🎯 What You'll Learn:
              </div>
              <div style={{ fontSize: '12px', color: '#15803d' }}>
                {selectedCourse.id === 'steady-climb-mastery' && 
                  'Master the Steady Climb strategy with real examples from BTC/USDT, ETH/USDT, and HYPE/USDT trading'}
                {selectedCourse.id === 'power-surge-advanced' && 
                  'Advanced Power Surge techniques for high-volatility assets like HYPE/USDT and SOL/USDT'}
                {selectedCourse.id === 'platform-overview' && 
                  'Complete platform navigation, from dashboard basics to advanced multi-asset trading'}
                {selectedCourse.id === 'crypto-basics' && 
                  'Essential cryptocurrency knowledge for trading BTC, ETH, HYPE and other major assets'}
                {selectedCourse.id === 'position-sizing' && 
                  'Optimize position sizes across your entire portfolio of 7+ trading pairs'}
                {!['steady-climb-mastery', 'power-surge-advanced', 'platform-overview', 'crypto-basics', 'position-sizing'].includes(selectedCourse.id) &&
                  'Comprehensive training with practical examples and actionable strategies'}
              </div>
            </div>

            <button 
              style={styles.startButton}
              onClick={handleStartCourse}
            >
              {selectedCourse.completion === 0 ? '🚀 Start Course' : 
               selectedCourse.completion === 100 ? '🔄 Review Course' : 
               '▶️ Continue Learning'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TradingAcademyPage;