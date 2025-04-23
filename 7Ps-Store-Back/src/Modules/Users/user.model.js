const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        minlength: [3, 'First name must be at least 3 characters'],
        maxlength: [12, 'First name cannot exceed 12 characters'],
        required: [true, 'First name is required']
    },
    lastName: {
        type: String,
        trim: true,
        minlength: [3, 'Last name must be at least 3 characters'],
        maxlength: [12, 'Last name cannot exceed 12 characters'],
        required: [true, 'Last name is required']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, 'Email is required'],
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        // maxlength: [20, 'Password cannot exceed 20 characters'],
        // select: false // Never return password in queries
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    image: {
        type: String,
        default: "default.jpg"
    },
    phone: {
        type: String,
        validate: {
            validator: function(v) {
                return /^[0-9]{10,15}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: {
            type: String,
            default: 'Egypt'
        }
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});


const User = mongoose.model("User", userSchema);

module.exports = User;