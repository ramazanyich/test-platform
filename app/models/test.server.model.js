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
	status:  {
		type: String,
		default: '',
		trim: true,
		required: 'Status cannot be blank'
	},
	score: {
		type: Number
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Test', TestSchema);
