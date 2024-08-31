const express = require('express');
const router = express.Router();
const { Request } = require('../models');

router.get('/:requestId', async (req, res) => {
    // Retrieve status and output URL
});

module.exports = router;