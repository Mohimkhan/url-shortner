const shortid = require('shortid');
const Url = require('../models/url')

async function handleGeneratedNewShortUrl(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ err: 'url is require' });
    const shortID = shortid();

    await Url.create({
        shortId: shortID,
        redirectUrl: body.url,
        visitHistory: []
    })

    return res.status(201).json({ id: shortID });
}

module.exports = {
    handleGeneratedNewShortUrl,
}