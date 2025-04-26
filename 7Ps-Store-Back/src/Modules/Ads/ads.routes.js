const express = require('express');
const router = express.Router();
const upload = require('../../utils/fileUpload');
const { createAdSchema, updateAdSchema } = require('./ads.validator');
const validate = require('../../middlewares/errorHandler');
const { createAd, getAds, updateAd, deleteAd } = require('./ads.controller');

router.post('/', upload.single('image'), validate(createAdSchema), createAd);

router.get('/', getAds);

router.put('/:id', validate(updateAdSchema), updateAd
);

router.delete('/:id', deleteAd);

module.exports = router;