const express = require('express');
const { authRequired } = require('../middleware/auth');
const { listArchive } = require('../controllers/postController');


const router = express.Router();
router.use(authRequired);
router.get('/', listArchive);
module.exports = router;