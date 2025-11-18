// backend/src/controllers/authController.js
const bcrypt = require('bcrypt');
const prisma = require('../utils/prisma');

/* ============================================================
   ВСПОМОГАТЕЛЬНАЯ: FakeUser для системного USER (ADMIN/USER)
   ============================================================ */
async function ensureFakeUserForSystemUser(user) {
  const exists = await prisma.fakeUser.findUnique({
    where: { userId: user.id },
  });

  if (exists) return exists;

  return prisma.fakeUser.create({
    data: {
      codename: user.name || user.email.split('@')[0],
      rank: user.title || 'Investigator',
      clearance: 'Ω',
      bio: user.bio || '',
      avatarUrl: user.avatarUrl || null,
      userId: user.id,
    },
  });
}

/* ============================================================
   ВСПОМОГАТЕЛЬНАЯ: FakeUser-слот для RealUser (Field Operator)
   ============================================================ */
async function ensureFakeUserForRealUser(real) {
  // Реальный игрок привязан к User через userId
  if (!real.userId) return null;

  const exists = await prisma.fakeUser.findUnique({
    where: { userId: real.userId },
  });

  if (exists) return exists;

  // Если вдруг слота нет — создаём его
  return prisma.fakeUser.create({
    data: {
      codename: real.username || `USER-${real.id}`,
      rank: 'Field Operator',
      clearance: 'D-13',
      bio: null,
      avatarUrl: real.avatarUrl || null,
      userId: real.userId, // связь через системного USER
    },
  });
}

/* ============================================================
   ЛОГИН
   ============================================================ */
async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    /* ---------------------------------------------------------
       1) ЛОГИН СИСТЕМНОГО USER (ADMIN / USER)
       --------------------------------------------------------- */
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const ok = await bcrypt.compare(password, user.password);
      if (ok) {
        await ensureFakeUserForSystemUser(user);

        req.session.user = {
          id: user.id,          // User.id
          role: user.role,
          email: user.email,
          name: user.name,
          realUser: null,       // нет привязки к RealUser
        };

        console.log(`✅ [User login] ${user.email} (${user.role})`);
        return res.json({
          message: 'Logged in (system user)',
          user: req.session.user,
        });
      }
    }

    /* ---------------------------------------------------------
       2) ЛОГИН REALUSER (игрок из RenPy)
       --------------------------------------------------------- */
    const real = await prisma.realUser.findFirst({
      where: { email, password },
    });

    if (real) {
      await prisma.realUser.update({
        where: { id: real.id },
        data: {
          is_online: true,
          last_seen: new Date(),
        },
      });

      await ensureFakeUserForRealUser(real);

      // Кладём в сессию И User.id (для слота), И realUser.id
      req.session.user = {
        id: real.userId, // ID системного USER, к которому привязан слот
        role: real.role || 'RESEARCHER',
        email: real.email,
        name: real.username,
        realUser: {
          id: real.id,
          username: real.username,
        },
      };

      console.log(`🎮 [RealUser login] ${real.username}`);
      return res.json({
        message: 'Logged in (real player)',
        user: req.session.user,
      });
    }

    /* ---------------------------------------------------------
       3) Неверный логин
       --------------------------------------------------------- */
    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (err) {
    console.error('❌ Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/* ============================================================
   ЛОГАУТ
   ============================================================ */
async function logout(req, res) {
  try {
    const sessionUser = req.session?.user;

    // Если это realUser — выключаем флаг онлайн
    if (sessionUser?.realUser?.id) {
      await prisma.realUser.update({
        where: { id: sessionUser.realUser.id },
        data: { is_online: false },
      });
    }

    req.session = null;
    console.log(`🚪 Logout: ${sessionUser?.email || 'Unknown'}`);

    res.json({ message: 'Logged out' });
  } catch (err) {
    console.error('❌ Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
}

/* ============================================================
   Фейковая заявка
   ============================================================ */
async function fakeRegister(req, res) {
  const { email } = req.body || {};
  let fileUrl = null;

  if (req.file) fileUrl = `/uploads/${req.file.filename}`;

  if (email) {
    await prisma.fakeApplication.create({ data: { email, fileUrl } });
  }

  return res.status(202).json({
    message: 'Ваша заявка успешно отправлена.',
  });
}

module.exports = { login, logout, fakeRegister };
