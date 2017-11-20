const {Db, MongoClient} = require('mongodb');

/** @type {Db} */
let _db;

/** @param {Db} db @returns {Promise<Db>} */
function upgrade(db) {
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
		resolve();
	});
}

/** @param {Db} db @returns {Promise<Db>} */
function setup(db) {
	if (db === null) db = _db;
	if (db === undefined) db = _db;

	console.log('db setup...');
	var start = new Date();
	
	//.then(()=>mongo.getDb().collection('users').createIndex({telegram_id: 1}, {unique: true}))
	//.then(()=>mongo.getDb().collection('chat').createIndex({message_id: 1}, {unique: true}))
	//mongo.getDb().collection('tran_btc_conf').createIndex({singletone: 1}, {unique: true});
	
	//db.collection('users')
	return Promise.resolve(null)
		//.then(()=>db.collection('chat').ensureIndex({message_id: 1}, {unique: true}))
		//.then(()=>db.collection('tran_btc_conf').ensureIndex({singletone: 1}, {unique: true}))
		//.then(()=>db.collection('transaction_log').ensureIndex({'changes.accountId': 1, 'changes.seqId': 1}, {unique: true}))
		//.then(()=>db.collection('transaction_log').ensureIndex({'changes.syncing': 1}, {sparse: true}))
		.then(()=> {
			console.log('db setup done. %dms', new Date() - start)
			return _db;
		})
	;
}

/** @param {string} url @returns {Promise<Db>} */
function connectAsync(url) {
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
}

/** @returns {Db} */
function getDb() {
	return _db;
}

/** @param {string} constr @returns {Promise<Db>} */
async function connect(constr) {
	if (!constr) constr = process.env.CUSTOMCONNSTR_mongo;
	_db = await MongoClient.connect(constr);
	return _db;
}

module.exports = {
	getDb: getDb,
	setup: setup,
	upgrade: upgrade,
	connect: connect
};



