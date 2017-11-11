var MongoClient = require( 'mongodb' ).MongoClient;
var _db;

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