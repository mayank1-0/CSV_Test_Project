const express = require('express');
const router = express.Router();
const { checkProcessingStatus } = require('../controller/status.controller');

/**
 * @swagger
 * /{requestId}:
 *   get:
 *     summary: Get the processing status of a request
 *     description: Retrieve the current processing status of a request using its ID.
 *     parameters:
 *       - name: requestId
 *         in: path
 *         required: true
 *         description: The ID of the request to check the processing status.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the processing status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 requestId:
 *                   type: string
 *                   description: The ID of the request.
 *                 status:
 *                   type: string
 *                   description: The current status of the request.
 *                   example: "Processing"
 *       400:
 *         description: Bad Request - Invalid request ID or malformed request
 *       404:
 *         description: Not Found - Request ID not found
 *       500:
 *         description: Internal Server Error
 */


/* To check status of image processing request by providing requestId */
router.get('/:requestId', checkProcessingStatus);

module.exports = router;