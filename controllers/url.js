const shortid = require('shortid');
const Url = require('../models/url')

async function handleGeneratedNewShortUrl(req, res) {
    const body = req.body;
    const tempUserId = req.cookies?.tempUserId;
    if (!body.url) return res.status(400).json({ err: 'url is required' });
    const shortID = shortid();

    await Url.create({
        shortId: shortID,
        redirectUrl: body.url,
        visitHistory: [],
        createdBy: req?.user?._id ?? tempUserId,
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