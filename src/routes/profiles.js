// src/routes/profiles.js
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { authRequired, adminOnly } = require('../middleware/auth');

const {
  listUsers,
  getProfile,
  updateProfile,
} = require('../controllers/profileController');

const router = express.Router();
router.use(authRequired);

// Получить список профилей
router.get('/', listUsers);

// Получить один профиль
router.get('/:id', getProfile);

// Обновить профиль (только для админа)
router.put('/:id', adminOnly, upload.single('avatar'), updateProfile);

module.exports = router;
