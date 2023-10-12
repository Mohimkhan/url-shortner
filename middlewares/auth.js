const { getUser } = require('../service/auth');

function checkForAuthentication(req, res, next) {
    const tokenValue = req.cookies?.token;
    req.user = null;

    if (!tokenValue) return next();

    const user = getUser(tokenValue);

    req.user = user;

    return next();
}

function restrictTo(roles = []) {
    return function (req, res, next) {
        if (!req.user) return res.redirect('/login');
        console.log(req.user)
        if (!roles.includes(req.user.role)) return res.end("UnAuthorized");

        return next();
    }
}


module.exports = {
    checkForAuthentication,
    restrictTo
}