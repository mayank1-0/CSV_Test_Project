var express = require('express');
var router = express.Router();
const multer = require('multer');
const { uploadProductCSV } = require('../controller/upload.controller')

const upload = multer({ dest: 'uploads/' });

/* Upload CSV file. */
router.post('/', upload.single('file'), uploadProductCSV);

module.exports = router;
