const User = require('../models/user');
const { setUser } = require('../service/auth');

async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;

    await User.create({
        name,
        email,
        password
    })

    return res.redirect('/');
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) return res.render('login', {
        error: "Invalid Email or Password"
    })

    const token = setUser(user);
    const options = {
        httpOnly: true,
        secure: true
    }
    res.cookie('token', token, options);
    return res.redirect('/');
}

async function handleUserLogout (req, res) {
    const tokenValue = req.cookies?.token;

    if (!tokenValue) return res.redirect('/login');

    const options = {
        httpOnly: true,
        secure: true
    }

    res.clearCookie('token', options);

    return res.redirect('/login');
}


module.exports = {
    handleUserSignup,
    handleUserLogin,
    handleUserLogout

}