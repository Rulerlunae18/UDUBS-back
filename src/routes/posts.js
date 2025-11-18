const express = require('express');
const { authRequired, adminOnly } = require('../middleware/auth');
const { upload } = require('../services/storage');
const { listPosts, getPost, createPost, updatePost, deletePost, listArchive, addView } = require('../controllers/postController');

const router = express.Router();

router.use(authRequired);

router.get('/archive', listArchive);

router.get('/', listPosts);
router.get('/:id', getPost);


router.post('/', adminOnly, upload.single('cover'), createPost);
router.post('/:id/view', addView);
router.put('/:id', adminOnly, upload.single('cover'), updatePost);
router.delete('/:id', adminOnly, deletePost);

module.exports = router;