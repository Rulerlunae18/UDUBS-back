const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');

// 📡 Получить всех realUsers
router.get('/', async (req, res) => {
  try {
    const users = await prisma.realUser.findMany({
      select: {
        id: true,
        username: true,
        password: true,
        email: true,
        role: true,
        is_online: true,
        last_seen: true,
        createdAt: true,
        userId: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(users);
  } catch (err) {
    console.error('❌ Failed to load real users:', err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
