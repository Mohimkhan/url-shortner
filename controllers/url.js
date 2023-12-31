const shortid = require('shortid');
const Url = require('../models/url')
const dotenv = require('dotenv');
dotenv.config();

async function handleGeneratedNewShortUrl(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ err: 'url is require' });
    const shortID = shortid();

    await Url.create({
        shortId: shortID,
        redirectUrl: body.url,
        visitHistory: [],
        createdBy: req.user._id,
    })

    return res.render('home', { id: shortID,
    port: process.env.PORT });
}

async function handleShortIdAnalytics(req, res) {
    const shortId = req.params.shortId;

    const result = await Url.findOne({
        shortId
    });

    res.status(200).json({ clicks: result.visitHistory.length, timestamps: result.visitHistory });
}

module.exports = {
    handleGeneratedNewShortUrl,
    handleShortIdAnalytics
}