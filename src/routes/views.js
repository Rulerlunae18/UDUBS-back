const express = require('express');
const { authRequired } = require('../middleware/auth');
const { addView } = require('../controllers/viewController');

const router = express.Router();
router.use(authRequired);

router.post('/:id', async (req, res) => {
  try {
    await addView(req, res);
  } catch (err) {
    console.error('Error in /views/:id:', err);
    res.status(500).json({ error: 'Failed to add view' });
  }
});

module.exports = router;
