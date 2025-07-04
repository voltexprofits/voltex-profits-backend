
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get trading status
router.get('/status', auth, (req, res) => {
  res.json({ 
    message: 'Trading routes working',
    isActive: req.user.trading?.isActive || false
  });
});

// Start/Stop trading
router.post('/toggle', auth, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    // Here we would update the user's trading status
    res.json({ 
      message: `Trading ${isActive ? 'started' : 'stopped'}`,
      isActive 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling trading' });
  }
});

module.exports = router;