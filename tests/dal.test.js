'use strict';

//var chai = require('chai');
var assert = require('assert');
var dal = require('./../dal');

require('./../secret/secret.js')();

/** @type {string} */
var constr = process.env.CUSTOMCONNSTR_mongo_test || 'mongodb://localhost/ta_unittests';

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
		assert(await _db.collection('counters').count() > 0);
	});
	
	it('Should auto increment counters', async function() {
		//console.log('the log');
		//console.log(dal.getNextSequence('test'));
		//console.log(await dal.getNextSequence('test'));
		var cur = await dal.getNextSequence('test');
		var next = await dal.getNextSequence('test');
		assert(cur < next, 'data: ' + cur + ' ' + next);
	});

	it('Should manual test counters', async function() {
		await _db.collection('counters').updateOne({_id: 'testm'}, {$set: {seq: 4}});
		assert.equal(await dal.getNextSequence('testm'), 5);
	});

	it('Should start from 1', async function() {
		await _db.collection('counters').deleteOne({_id: 'testf'});
		assert.equal(await dal.getNextSequence('testf'), 1);
	});

});