var MongoClient = require( 'mongodb' ).MongoClient;
var _db;


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
		console.log('db upgrade done. %dms', new Date() - start);
		resolve();
	});
}

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
		.then(()=>console.log('db setup done. %dms', new Date() - start))
	;
}

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

module.exports = {
	connect: function( callback ) {
		MongoClient.connect( process.env.CUSTOMCONNSTR_mongo, function( err, db ) {
			_db = db;
			return callback( err );
		} );
	},
	getDb: function() {
		return _db;
	}
};