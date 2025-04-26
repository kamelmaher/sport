const express = require('express');
const router = express.Router();
const {getMatches} = require('./matches.controller');

router.get('/', getMatches);

module.exports = router;