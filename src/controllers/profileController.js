// backend/src/controllers/profileController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { publicUrl } = require('../services/storage');

/* ============================================================
   📌 Получить профиль пользователя (User)
   ============================================================ */
async function getProfile(req, res) {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        realUsers: true,
        gameProfiles: true,
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('getProfile error:', err);
    res.status(500).json({ error: 'Failed to load profile' });
  }
}

/* ============================================================
   📌 Обновить профиль User + Синхронизировать FakeUser
   ============================================================ */
async function updateProfile(req, res) {
  try {
    const id = Number(req.params.id);
    const { name, title, bio } = req.body;

    // Проверяем, что User существует
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Если загружен новый аватар
    let avatarUrl = user.avatarUrl;
    if (req.file) {
      avatarUrl = publicUrl(req.file.path);
    }

    /* === 1) Обновляем таблицу USER === */
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        title,
        bio,
        avatarUrl,
      },
    });

    /* === 2) Синхронизируем связанные FakeUser === */
    await prisma.fakeUser.updateMany({
      where: { userId: updatedUser.id },
      data: {
        codename: updatedUser.name,      // Имя → позывной
        rank: updatedUser.title,         // Титул → ранг
        bio: updatedUser.bio,            // Биография
        avatarUrl: updatedUser.avatarUrl // Аватар
      },
    });

    res.json({
      message: 'Profile updated successfully.',
      user: updatedUser,
    });
  } catch (err) {
    console.error('updateProfile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}

/* ============================================================
   📌 Получить всех пользователей
   ============================================================ */
async function listUsers(_req, res) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        realUsers: true,
        gameProfiles: true,
      },
    });

    res.json(users);
  } catch (err) {
    console.error('listUsers error:', err);
    res.status(500).json({ error: 'Failed to load users' });
  }
}

/* ============================================================
   📌 Удалить пользователя
   ============================================================ */
async function deleteUser(req, res) {
  try {
    const id = Number(req.params.id);

    await prisma.user.delete({ where: { id } });

    // Также удалим FakeUser, привязанный к нему
    await prisma.fakeUser.deleteMany({ where: { userId: id } });

    res.json({ success: true });
  } catch (err) {
    console.error('deleteUser error:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  listUsers,
  deleteUser,
};
