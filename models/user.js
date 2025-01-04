const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const { saltOrRounds } = require('../constants');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    role:{
        type: String,
        require: true,
        trim: true,
        enum: ["NORMAL", "ADMIN"],
        default: "NORMAL"
    },
    password: {
        type: String,
        trim: true,
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

userSchema.methods.isPasswordValid = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.models.User || mongoose.model('user', userSchema);


module.exports = User;