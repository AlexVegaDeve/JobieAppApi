const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const applications = require('../controllers/applications');

router.route('/')
    .get( applications.index )
    .post( catchAsync(applications.newApplication))

router.route('/stats')
    .get( applications.getUserStats)

router.route('/:id')
    .get(catchAsync(applications.displayApplication))
    .put( catchAsync(applications.editApplication))
    .delete(catchAsync(applications.deleteApplication))

router.get('/:id/edit', catchAsync(applications.renderEditForm));

module.exports = router;