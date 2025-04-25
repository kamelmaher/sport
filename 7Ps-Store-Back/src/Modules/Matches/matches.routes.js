const express = require('express');
const router = express.Router();
const matchesController = require('./matches.controller');

router.get('/', matchesController.getMatches);

module.exports = router;