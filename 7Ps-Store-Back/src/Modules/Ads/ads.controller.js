const Ad = require('./ads.model');
const { createAdSchema, updateAdSchema } = require('./ads.validator');
const { deleteImageFromCloudinary } = require('../../utils/fileUpload');
exports.createAd = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const ad = await Ad.create({
            title: req.body.title,
            link: req.body.link,
            image: {
                public_id: req.file.filename, // public_id من Cloudinary
                url: req.file.path // URL الصورة من Cloudinary
            }
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
        const ad = await Ad.findById(req.params.id);

        console.log(ad);
        if (!ad) {
            return res.status(404).json({
                success: false,
                message: 'Ad not found'
            });
        }

        // حذف الصورة من Cloudinary إذا كان هناك public_id
        if (ad.image.public_id) {
            await deleteImageFromCloudinary(ad.image.public_id);
        }

        console.log('Deleted image from Cloudinary');
        await Ad.deleteOne({ _id: req.params.id });
        console.log('Ad deleted successfully');
        res.json({
            success: true,
            message: 'Ad deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete ad',
            error: err.message
        });
    }
};