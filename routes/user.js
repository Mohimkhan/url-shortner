const express = require('express');
const router = express.Router();
const { handleUserSignup, handleUserLogin, handleUserLogout} = require('../controllers/user');
const { restrictTo } = require('../middlewares/auth');

router.post('/signup', handleUserSignup);
router.post('/login', handleUserLogin);
router.get('/logout', restrictTo(["NORMAL", "ADMIN"]), handleUserLogout);

module.exports = router;