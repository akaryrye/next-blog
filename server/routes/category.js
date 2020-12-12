const express = require('express');
const router = express.Router();
const { runValidation } = require('../validators');
const { categoryValidator } = require('../validators/category');
const { requireSignin, adminMiddleware } = require('../controllers/auth');
const { create, read, list, remove } = require('../controllers/category');


router.post('/category', categoryValidator, runValidation, requireSignin, adminMiddleware, create);
router.get('/category/:slug', read);
router.get('/categories', list);
router.delete('/category/:slug', requireSignin, adminMiddleware, remove);


module.exports = router;
