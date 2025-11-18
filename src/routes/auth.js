// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const { login, logout, fakeRegister } = require('../controllers/authController');
const { upload } = require('../services/storage');

/* =========================================================
   🧠 Проверка активной сессии
   ========================================================= */
router.get('/me', async (req, res) => {
  try {
    if (req.session && req.session.user) {
      // 🔹 обновляем last_seen (активность)
      await prisma.realUser.updateMany({
        where: { userId: req.session.user.id },
        data: { last_seen: new Date() },
      });

      return res.json({ ok: true, user: req.session.user });
    }

    res.json({ ok: false, user: null });
  } catch (err) {
    console.error('❌ /me error:', err);
    res.status(500).json({ ok: false });
  }
});

/* =========================================================
   🔐 Логин
   ========================================================= */
router.post('/login', async (req, res, next) => {
  try {
    await login(req, res, async () => {
      // ⚙️ Когда логин успешен — обновляем статус RealUser
      if (req.session && req.session.user) {
        const userId = req.session.user.id;

        await prisma.realUser.updateMany({
          where: { userId },
          data: {
            is_online: true,
            last_seen: new Date(),
          },
        });

        console.log(`🟢 ${req.session.user.username} вошёл в систему`);
      }
      next && next();
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'login_failed' });
  }
});

/* =========================================================
   🚪 Логаут
   ========================================================= */
router.post('/logout', async (req, res) => {
  try {
    const user = req.session?.user;

    if (user) {
      await prisma.realUser.updateMany({
        where: { userId: user.id },
        data: { is_online: false },
      });

      console.log(`🔴 ${user.username} вышел из системы`);
    }

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ ok: true });
    });
  } catch (err) {
    console.error('❌ Logout error:', err);
    res.status(500).json({ ok: false });
  }
});

/* =========================================================
   🧾 Фиктивная регистрация (только заявка)
   ========================================================= */
router.post('/register', upload.single('file'), fakeRegister);

module.exports = router;
