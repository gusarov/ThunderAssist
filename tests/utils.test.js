'use strict';

//var chai = require('chai');
var assert = require('assert');

//require('./../secret/secret.js')();

/** @type {string} */
var constr = process.env.CUSTOMCONNSTR_mongo_test || 'mongodb://localhost/ta_unittests';

describe('Database Access Layer', () => {
	before(async ()=>{
	});

	after(()=>{
	});

	it('Should convert date to ISO UTC', function() {
		assert.equal(new Date('2017-12-15T12:39:16+03:00').toISOString().replace('.000',''), '2017-12-15T09:39:16Z');
	});

});