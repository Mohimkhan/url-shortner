const express = require('express');
const router = express.Router();
const Url = require('../models/url')
const { restrictTo } = require('../middlewares/auth');
const User = require('../models/user');
const { appName } = require('../constants');


router.get('/admin/urls', restrictTo(['ADMIN']), async (req, res) => {
    const data = [];
    const user = await User.find({});

    for (let i = 0; i < user.length; i++) {
        const {_id, name, email, role} = user[i];
        
        if (user[i]) {
            const urls = await Url.find({createdBy: _id});
            data.push({name, email, role, userDetails: {length: urls.length, links: urls}})
        }
    }

    res.render('admin', {
        data
    });
})

router.get('/', async (req, res) => {
    const userId = req?.user?._id;
    const tempUserId = req.cookies?.[`${appName}-tempUserId`];
    

    if (!userId) {
        const urls = await Url.find({tempUserId});

        return res.render('home', {
            urls
        });
    }

    const allUrls = await Url.find({ createdBy: req.user?._id });

    res.render('home', {
        urls: allUrls
    });
})

router.get('/signup', (_, res) => {
    res.render('signup');
})

router.get('/login', (_, res) => {
    res.render('login');
})

module.exports = router;