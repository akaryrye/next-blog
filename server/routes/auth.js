const express = require('express');
const router = express.Router();
const {signup, signin, requireSignin, signout} = require('../controllers/auth');
const {runValidation} = require('../validators');
const {userSignupValidator, userSigninValidator} = require('../validators/auth');

// Run validation on routes:
router.post('/signup', userSignupValidator, runValidation, signup);
router.post('/signin', userSigninValidator, runValidation, signin);
router.get('/signout', signout);

module.exports = router;