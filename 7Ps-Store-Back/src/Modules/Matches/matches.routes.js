const express = require('express');
const router = express.Router();
const MatchesController = require('./matches.controller');

// Define routes directly
router.get('/', MatchesController.getMatches);
router.get('/finished', MatchesController.getFinishedMatches);

module.exports = router;