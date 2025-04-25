const Ad = require('./ads.model');
const { createAdSchema, updateAdSchema } = require('./ads.validator');

exports.createAd = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const ad = await Ad.create({
            title: req.body.title,
            link: req.body.link,
            imageUrl: req.file.path
        });

        res.status(201).json(ad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAds = async (req, res) => {
    try {
        const ads = await Ad.find();
        res.json(ads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateAd = async (req, res) => {
    try {
        const ad = await Ad.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        res.json(ad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteAd = async (req, res) => {
    try {
        const ad = await Ad.findByIdAndDelete(req.params.id);

        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        res.json({ message: 'Ad deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};