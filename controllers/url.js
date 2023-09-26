const shortid = require('shortid');
const Url = require('../models/url')

async function handleGeneratedNewShortUrl(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ err: 'url is require' });
    const shortID = shortid();

    await Url.create({
        shortId: shortID,
        redirectUrl: body.url,
        visitHistory: [],
    })

    return res.json({ id: shortID });
}

async function handleShortIdAnalytics(req, res) {
    const shortId = req.params.shortId;

    const result = await Url.findOne({
        shortId
    });

    res.status(200).json({clicks: result.visitHistory.length, timestamps: result.visitHistory});
}

module.exports = {
    handleGeneratedNewShortUrl,
    handleShortIdAnalytics
}