const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Папка для аватаров
const uploadDir = path.resolve('uploads/fakeusers');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// === Получить всех FakeUsers ===
async function listFakeUsers(req, res) {
  try {
    const users = await prisma.fakeUser.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
    res.json(users);
  } catch (err) {
    console.error('Ошибка получения фейк-юзеров:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

// === Создать NPC ===
async function createFakeUser(req, res) {
  try {
    if (!req.session.user || req.session.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { codename, rank, clearance, bio } = req.body;

    const avatarUrl = req.file
      ? `/uploads/fakeusers/${req.file.filename}`
      : null;

    const newUser = await prisma.fakeUser.create({
      data: {
        codename,
        rank,
        clearance,
        bio,
        avatarUrl,
        userId: null,
      },
    });

    res.json(newUser);
  } catch (err) {
    console.error('Ошибка создания NPC:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

// === Получить одного исследователя ===
async function getFakeUser(req, res) {
  try {
    const id = Number(req.params.id);

    const user = await prisma.fakeUser.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!user) return res.status(404).json({ error: 'Researcher not found' });

    res.json(user);
  } catch (err) {
    console.error('GET /fakeusers/:id error:', err);
    res.status(500).json({ error: 'Failed to load researcher' });
  }
}

// === Получить посты исследователя ===
async function getFakeUserPosts(req, res) {
  try {
    const id = Number(req.params.id);

    const user = await prisma.fakeUser.findUnique({
      where: { id },
      include: {
        posts: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) return res.status(404).json({ error: 'Researcher not found' });

    res.json({ posts: user.posts });
  } catch (err) {
    console.error('GET /fakeusers/:id/posts error:', err);
    res.status(500).json({ error: 'Failed to load posts' });
  }
}


// === Удалить NPC ===
async function deleteFakeUser(req, res) {
  try {
    const id = Number(req.params.id);

    await prisma.fakeUser.delete({ where: { id } });

    res.json({ success: true });
  } catch (err) {
    console.error('Ошибка удаления FakeUser:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

module.exports = {
  upload,
  listFakeUsers,
  createFakeUser,
  deleteFakeUser,
  getFakeUser,
  getFakeUserPosts
};
