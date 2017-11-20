'use strict';

//var chai = require('chai');
var assert = require('assert');
var dal = require('./../dal');

require('./../secret/secret.js')();

/** @type {string} */
var constr = process.env.CUSTOMCONNSTR_mongo_test;

var mongodb = require('mongodb');
var {Db} = mongodb;

describe('Database Access Layer', () => {
	/** @type {Db} */
	var _db;

	before(async ()=>{
		_db = await dal.connect(constr);
	});

	after(()=>{
	});


	it('Should connect to db', async function() {
		assert(await _db.collection('users').count() > 0);
	});

});