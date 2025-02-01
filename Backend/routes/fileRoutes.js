// routes/fileRoutes.js
const express = require('express');
const { upload, processFile } = require('../controllers/fileController');

const router = express.Router();

router.post('/upload', upload.single('file'), processFile);

module.exports = router;
