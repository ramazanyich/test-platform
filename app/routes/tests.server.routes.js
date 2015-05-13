'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	tests = require('../../app/controllers/tests.server.controller');

module.exports = function(app) {
	// Test Routes
	app.route('/tests')
		.get(tests.list)
		.post(users.requiresLogin, tests.create);

	app.route('/tests/:testId')
		.get(tests.read)
		.put(users.requiresLogin, tests.hasAuthorization, tests.update)
		.delete(users.requiresLogin, tests.hasAuthorization, tests.delete);

	// Finish by binding the article middleware
	app.param('testId', tests.testByID);
};
