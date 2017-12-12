const {Db, MongoClient} = require('mongodb');

const mongoose = require('mongoose');
const {Connection} = mongoose;


mongoose.Promise = global.Promise;

/** @type {Db} */
let _db;

/** @param {Db} [db] @returns {Promise<Db>} */
module.exports.upgrade = function upgrade(db) {
	if (db === null) db = _db;
	if (db === undefined) db = _db;

	console.log('db upgrade...');
	var start = new Date();
	
	//.then(()=>mongo.getDb().collection('users').createIndex({telegram_id: 1}, {unique: true}))
	//.then(()=>mongo.getDb().collection('chat').createIndex({message_id: 1}, {unique: true}))
	//mongo.getDb().collection('tran_btc_conf').createIndex({singletone: 1}, {unique: true});
	
	//db.collection('users')
	return new Promise(function(resolve){
		console.log('db upgrade done. %dms', (new Date() - start));
		resolve(db);
	});
};

/** @param {Db} [db] @returns {Promise<Db>} */
module.exports.setup = function setup(db) {
	if (db === null) db = _db;
	if (db === undefined) db = _db;

	console.log('db setup...');
	var start = new Date();
	
	//.then(()=>mongo.getDb().collection('users').createIndex({telegram_id: 1}, {unique: true}))
	//.then(()=>mongo.getDb().collection('chat').createIndex({message_id: 1}, {unique: true}))
	//mongo.getDb().collection('tran_btc_conf').createIndex({singletone: 1}, {unique: true});
	
	//db.collection('users')
	return Promise.resolve(_db)
		.then(()=>db.collection('tasks').ensureIndex({id: 1}, {unique: true}))
		//.then(()=>db.collection('tran_btc_conf').ensureIndex({singletone: 1}, {unique: true}))
		//.then(()=>db.collection('transaction_log').ensureIndex({'changes.accountId': 1, 'changes.seqId': 1}, {unique: true}))
		//.then(()=>db.collection('transaction_log').ensureIndex({'changes.syncing': 1}, {sparse: true}))
		.then(()=> {
			console.log('db setup done. %dms', new Date() - start)
			return _db;
		})
	;
};

/** @param {string} url @returns {Promise<Db>} */
module.exports.connectAsync_ = function connectAsync(url) {
	var start = new Date();
	console.log('mongo connecting...');
	return new Promise((resolve,reject)=>{
		MongoClient.connect(url, (err, db)=>{
			console.log('mongo connected. %dms', new Date() - start);
			if (err) {
				reject(err);
			} else {
				resolve(db);
			}
		});
	});
};

/** @returns {Db} */
module.exports.getDb = function getDb() {
	return _db;
};

/** @param {string} [constr] @returns {Promise<Db>} */
module.exports.connect = async function connect(constr) {
	if (!constr) constr = process.env.CUSTOMCONNSTR_mongo || 'mongodb://localhost/ta_dev';
	//_db = await MongoClient.connect(constr);
	mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
	await mongoose.connect(constr, {useMongoClient: true});
	_db = mongoose.connection.db;

	return _db;
};

/** @param {string} name @returns {Promise<number>} */
module.exports.getNextSequence = function getNextSequence(name) {
	return _db.collection('counters').findAndModify(
		{ _id: name },
		[],
		{ $inc: { seq: 1 } },
		{ upsert: true, new: true }
	)
		.then(v=>v.value.seq)
	;
};

module.exports.schemaTask = mongoose.Schema({
	name: String,
	id: Number,
});

module.exports.modelTask = mongoose.model('Task', module.exports.schemaTask);

