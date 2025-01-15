const express = require('express');
const router = express.Router();
const { handleUserSignup, handleUserLogin, handleUserLogout} = require('../controllers/user');
const { restrictTo } = require('../middlewares/auth');

// middleware
router.use("/logout", async (req, res, next) => {
    console.log("yes worked");
    next();
});

router.post('/signup', handleUserSignup);
router.post('/login', handleUserLogin);
router.get('/logout', handleUserLogout);

module.exports = router;