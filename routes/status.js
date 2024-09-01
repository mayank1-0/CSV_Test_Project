const express = require('express');
const router = express.Router();
const { checkProcessingStatus } = require('../controller/status.controller');

router.get('/:requestId', checkProcessingStatus);

module.exports = router;