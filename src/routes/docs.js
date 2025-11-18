const express = require('express');
const { authRequired, adminOnly } = require('../middleware/auth');
const { upload } = require('../services/storage');
const { listDocs, getDoc, createDoc, deleteDoc } = require('../controllers/docController');


const router = express.Router();
router.use(authRequired);


router.get('/', listDocs);
router.get('/:id', getDoc);
router.post('/', adminOnly, upload.single('file'), createDoc);
router.delete('/:id', adminOnly, deleteDoc);


module.exports = router;