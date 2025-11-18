// backend/src/routes/realusers-self.js
const express = require('express');
const multer = require('multer');
const { authRequired } = require('../middleware/auth');
const { getOwnProfile, updateOwnAvatar } = require('../controllers/realUsersController');

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.use(authRequired);

// Профиль текущего realUser
router.get('/me', getOwnProfile);

// Обновление ТОЛЬКО аватара текущего realUser
router.put('/me/avatar', upload.single('avatar'), updateOwnAvatar);

module.exports = router;
