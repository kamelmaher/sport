const express = require('express');
const router = express.Router();
const { upload } = require('../../utils/fileUpload');
const { createAdSchema, updateAdSchema } = require('./ads.validator');
const validate = require('../../middlewares/errorHandler');
const adminFilter = require('../../middlewares/adminMiddleware');
const authMiddleware = require('../../middlewares/authMiddleware');
const { createAd, getAds, updateAd, deleteAd } = require('./ads.controller');


router.post('/', authMiddleware, adminFilter, validate(createAdSchema), upload.single('image'), createAd);

router.get('/', getAds);

router.put('/:id', authMiddleware, adminFilter, validate(updateAdSchema), updateAd);

router.delete('/:id', authMiddleware, adminFilter, deleteAd);

module.exports = router;