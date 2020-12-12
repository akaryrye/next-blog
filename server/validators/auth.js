const { check } = require('express-validator');

exports.userSignupValidator = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Valid email required'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

exports.userSigninValidator = [
  check('email').isEmail().withMessage('Valid email required'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];