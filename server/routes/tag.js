const express = require('express');
const router = express.Router();
const { runValidation } = require('../validators');
const { tagValidator } = require('../validators/tag');
const { requireSignin, adminMiddleware } = require('../controllers/auth');
const { create, read, list, remove } = require('../controllers/tag');


router.post('/tag', tagValidator, runValidation, requireSignin, adminMiddleware, create);
router.get('/tag/:slug', read);
router.get('/tags', list);
router.delete('/tag/:slug', requireSignin, adminMiddleware, remove);


module.exports = router;
