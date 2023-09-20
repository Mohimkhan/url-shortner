const mongoose = require('mongoose');


// schema 
const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        require: true,
        unique: true
    },
    redirectUrl: {
        type: String,
        require: true
    },
    visitHistory: [{ timestamp: { type: Number } }],
}, { timestamps: true })

const Url = mongoose.model('url', urlSchema);

module.exports = Url;