const User = require('../models/user');
const { setUser } = require('../service/auth');

async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;

    if ([name, email, password].some((field) => field === undefined)) {
        return res.render("signup", {
            error: "All fields should be filled"
        });
    }

    await User.create({
        name,
        email,
        password
    })

    return res.redirect('/');
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;

    if ([email, password].some((field) => field === undefined)) {
        return res.render("login", {
            error: "All fields should be filled"
        });
    }

    const user = await User.findOne({ email });

    if (!user) return res.render('login', {
       error:"Invalid Email or Password"
    })

    const isPasswordValid = await user.isPasswordValid(password);

    if (!isPasswordValid) {
        return res.render("login", {
            error: "Invalid password"
        })
    }

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