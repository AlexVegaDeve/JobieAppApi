const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');


router.route('/register')
    .post(catchAsync(users.registerUser))

// router.get('/verify-email', users.verifyUser);

router.route('/login')
    .post(passport.authenticate('local'), users.loginUser)

router.get('/logout', users.logoutUser);

module.exports = router;