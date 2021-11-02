const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const stats = require('../controllers/stats');


router.get('/', catchAsync( stats.getUserStats ));

module.exports = router;