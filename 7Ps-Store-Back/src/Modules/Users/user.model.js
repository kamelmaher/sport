const mongoose = require("mongoose");
const validator = require('validator');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        trim: true,
        minlength: [3, 'User name must be at least 3 characters'],
        maxlength: [30, 'User name cannot exceed 12 characters'],
        required: [true, 'User name is required']
    },
    phone: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'Phone number is required'],
        validate: {
            validator: function (v) {
                return /^[0-9]{10,15}$/.test(v);
            },
            message: props => `${props.value} it should be begin with 01 and contain 10 to 15 digits`
        }
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt automatically
    collation: { locale: 'ar', strength: 2 }
});



const User = mongoose.model("User", userSchema);

module.exports = User;