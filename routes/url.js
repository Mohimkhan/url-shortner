const express = require('express');
const router = express.Router();
const { handleGeneratedNewShortUrl, handleShortIdAnalytics } = require('../controllers/url');


router.post('/', handleGeneratedNewShortUrl);
router.get('/analytics/:shortId', handleShortIdAnalytics);


module.exports = router;