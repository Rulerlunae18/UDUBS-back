const express = require('express');
const multer = require('multer');
const path = require('path');
const config = require('../config/env');
const fs = require('fs');

const router = express.Router();

// 📂 Настройка хранилища
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(config.uploadDir));
  },
  filename: (req, file, cb) => {
    const safeName = Date.now() + '-' + file.originalname.replace(/[^\w.-]/g, '_');
    cb(null, safeName);
  },
});

// ⚠️ Разрешённые типы (белый список)
const allowedExt = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.pdf', '.docx', '.txt'];
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExt.includes(ext)) {
      return cb(new Error('Unsupported file type'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 20 * 1024 * 1024 } // максимум 20 МБ
});

// 🟢 Загрузка файла
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const ext = path.extname(req.file.originalname).toLowerCase().replace('.', '');
  res.json({
    path: `/uploads/${req.file.filename}`,
    fileType: ext,
    originalName: req.file.originalname,
    size: req.file.size,
  });
});

// 🚫 (Удалено) router.use('/', express.static(...))
// Безопасная раздача уже настраивается в server.js

router.get('/ping', (_req, res) => res.json({ message: 'Uploads API online' }));

// 🧰 Безопасная обработка ошибок Multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    console.warn('Upload error:', err);
    return res.status(400).json({ error: err.message || 'Upload failed' });
  }
  next();
});

module.exports = router;
