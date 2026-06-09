const express = require('express');
const multer = require('multer');
const os = require('os');
const path = require('path');
const { convertBmsFiles } = require('../controllers/converterController');

const router = express.Router();

const upload = multer({
  dest: path.join(os.tmpdir(), 'alsm-uploads'),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.zip', '.bms'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file .zip hoặc .bms'));
    }
  },
});

// Accept either a single zip or multiple BMS files under the field name "files"
router.post('/upload', upload.any(), convertBmsFiles);

module.exports = router;
