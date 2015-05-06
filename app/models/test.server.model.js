'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var TestSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date
	},
	questions: [
		{
		   question: String,
		   answer: String,
		   isCorrect: Boolean
		}			
	],
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Test', TestSchema);