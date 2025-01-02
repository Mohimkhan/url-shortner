const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const { saltOrRounds } = require('../constants');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role:{
        type: String,
        require: true,
        default: "NORMAL"
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    // Check if the password field is modified
    if (!this.isModified("password")) return next();
    
    // Hash the password
    try {
        this.password = await bcrypt.hash(this.password, saltOrRounds);
        next();
    } catch (err) {
        next(err); // Pass errors to the next middleware
    }
})

const User = mongoose.models.User || mongoose.model('user', userSchema);


module.exports = User;