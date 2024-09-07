var express = require('express');
var router = express.Router();
const multer = require('multer');
const { uploadProductCSV } = require('../controller/upload.controller');

const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a CSV file
 *     description: Uploads a CSV file for processing.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The CSV file to upload.
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: Bad Request - Invalid file or request
 *       500:
 *         description: Internal Server Error
 */

/* Upload CSV file. */
router.post('/', upload.single('file'), uploadProductCSV);

module.exports = router;
