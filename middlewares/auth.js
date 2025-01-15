const { appName } = require('../constants');
const { options } = require('../routes/user');
const { getUser } = require('../service/auth');
const {v4: uuidv4} = require("uuid");

function checkForAuthentication(req, res, next) {
    const tokenValue = req.cookies?.[`${appName}-token`];
    const tempUserId = req.cookies?.[`${appName}-tempUserId`];

    req.user = null;

    if (!tokenValue) {
        if (!tempUserId) {
            res.cookie(`${appName}-tempUserId`, uuidv4(), options);
            return next();
        }
    };

    const user = getUser(tokenValue);

    req.user = user;

    return next();
}

function restrictTo(roles = []) {
    return function (req, res, next) {
        if (!req.user) return res.redirect('/login');
        if (!roles.includes(req.user.role)) return res.end("UnAuthorized");

        return next();
    }
}


module.exports = {
    checkForAuthentication,
    restrictTo
}