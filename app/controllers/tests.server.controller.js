'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Test = mongoose.model('Test'),
	_ = require('lodash');

/**
 * Create a test
 */
exports.create = function(req, res) {
	var test = new Test(req.body);
	test.user = req.user;

	test.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(test);
		}
	});
};

/**
 * Show the current test
 */
exports.read = function(req, res) {
	res.json(req.test);
};

/**
 * Update a test
 */
exports.update = function(req, res) {
	var test = req.test;

	test = _.extend(test, req.body);

	test.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(test);
		}
	});
};

/**
 * Delete a test
 */
exports.delete = function(req, res) {
	var test = req.test;

	test.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(test);
		}
	});
};

/**
 * List of tests
 */
exports.list = function(req, res) {
	Test.find().sort('-created').populate('user', 'displayName').exec(function(err, tests) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(tests);
		}
	});
};

/**
 * Tests middleware
 */
exports.testByID = function(req, res, next, id) {
	Test.findById(id).populate('user', 'displayName').exec(function(err, test) {
		if (err) return next(err);
		if (!test) return next(new Error('Failed to load test ' + id));
		req.test = test;
		next();
	});
};

/**
 * Test authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.test.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
