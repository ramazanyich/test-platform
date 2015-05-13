'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Test = mongoose.model('Test'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, test;

/**
 * Article routes tests
 */
describe('Test CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new article
		user.save(function() {
			test = {
				questions: [
					{
						question: "User",
						answer: "",
						isCorrect: false
					}
				],
				status: "CREATED",
				score: 0

			};

			done();
		});
	});

	it('should be able to save a test if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new test
				agent.post('/tests')
					.send(test)
					.expect(200)
					.end(function(testSaveErr, testSaveRes) {
						// Handle test save error
						if (testSaveErr) done(testSaveErr);

						// Get a list of tests
						agent.get('/tests')
							.end(function(testsGetErr, testsGetRes) {
								// Handle test save error
								if (testsGetErr) done(testsGetErr);

								// Get tests list
								var tests = testsGetRes.body;

								// Set assertions
								(tests[0].user._id).should.equal(userId);
								(tests[0].status).should.match('CREATED');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save a test if not logged in', function(done) {
		agent.post('/tests')
			.send(test)
			.expect(401)
			.end(function(testSaveErr, testSaveRes) {
				// Call the assertion callback
				done(testSaveErr);
			});
	});

	it('should not be able to save a test if no status is provided', function(done) {
		// Invalidate status field
		test.status = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new test
				agent.post('/tests')
					.send(test)
					.expect(400)
					.end(function(testSaveErr, testSaveRes) {
						// Set message assertion
						(testSaveRes.body.message).should.match('Status cannot be blank');
						
						// Handle article save error
						done(testSaveErr);
					});
			});
	});

/*	it('should be able to update an article if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new article
				agent.post('/articles')
					.send(article)
					.expect(200)
					.end(function(articleSaveErr, articleSaveRes) {
						// Handle article save error
						if (articleSaveErr) done(articleSaveErr);

						// Update article title
						article.title = 'WHY YOU GOTTA BE SO MEAN?';

						// Update an existing article
						agent.put('/articles/' + articleSaveRes.body._id)
							.send(article)
							.expect(200)
							.end(function(articleUpdateErr, articleUpdateRes) {
								// Handle article update error
								if (articleUpdateErr) done(articleUpdateErr);

								// Set assertions
								(articleUpdateRes.body._id).should.equal(articleSaveRes.body._id);
								(articleUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of articles if not signed in', function(done) {
		// Create new article model instance
		var articleObj = new Article(article);

		// Save the article
		articleObj.save(function() {
			// Request articles
			request(app).get('/articles')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single article if not signed in', function(done) {
		// Create new article model instance
		var articleObj = new Article(article);

		// Save the article
		articleObj.save(function() {
			request(app).get('/articles/' + articleObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('title', article.title);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete an article if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new article
				agent.post('/articles')
					.send(article)
					.expect(200)
					.end(function(articleSaveErr, articleSaveRes) {
						// Handle article save error
						if (articleSaveErr) done(articleSaveErr);

						// Delete an existing article
						agent.delete('/articles/' + articleSaveRes.body._id)
							.send(article)
							.expect(200)
							.end(function(articleDeleteErr, articleDeleteRes) {
								// Handle article error error
								if (articleDeleteErr) done(articleDeleteErr);

								// Set assertions
								(articleDeleteRes.body._id).should.equal(articleSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete an article if not signed in', function(done) {
		// Set article user 
		article.user = user;

		// Create new article model instance
		var articleObj = new Article(article);

		// Save the article
		articleObj.save(function() {
			// Try deleting article
			request(app).delete('/articles/' + articleObj._id)
			.expect(401)
			.end(function(articleDeleteErr, articleDeleteRes) {
				// Set message assertion
				(articleDeleteRes.body.message).should.match('User is not logged in');

				// Handle article error error
				done(articleDeleteErr);
			});

		});
	});
  */
	afterEach(function(done) {
		User.remove().exec();
		Test.remove().exec();
		done();
	});
});
