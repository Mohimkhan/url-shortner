const { getUser } = require('../service/auth');
const {v4: uuidv4} = require("uuid");

function checkForAuthentication(req, _, next) {
    const tokenValue = req.cookies?.token;
    const tempUserId = req.cookies?.tempUserId;

    req.user = null;

    if (!tokenValue) {
        if (!tempUserId) {
            req.cookies.tempUserId = uuidv4();
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