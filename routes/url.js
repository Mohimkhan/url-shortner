const express = require('express');
const router = express.Router();
const { handleGeneratedNewShortUrl } = require('../controllers/url');


router.post('/', handleGeneratedNewShortUrl)


module.exports = router;