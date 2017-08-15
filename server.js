'use strict';

// references
var fs = require('fs');

// read secure part that may contain some specific overrides and not stored in source control (connection strings, passwords)
if (fs.existsSync('./secret/secret.js')) {
	console.log('execute overrides...');
	require('./secret/secret')();
} else {
	console.log('no overrides');
}

console.log('Load other libraries...');

console.log(' express');
var express = require('express');
console.log(' serve-favicon');
var serveFavicon = require('serve-favicon');
console.log(' serve-index');
var directory = require('serve-index');
//var createWebhookHandler = require('github-webhook-handler');

console.log(' socket.io');
var socketio = require('socket.io');
// var mongoClient = require('mongodb').MongoClient;
console.log(' mongoUtils');
var mongo = require('./mongoUtils');
console.log(' assert');
var assert = require('assert');
console.log(' google-auth-library');
var auth = new (require('google-auth-library'));

var googleClientId = '521830143322-shvg9lc373l28r4etj4u25i3gi34hkjg.apps.googleusercontent.com';
var authClient = new auth.OAuth2(googleClientId, '', '');

if (process.env.PORT === undefined) {
	process.env.PORT = 3000;
}

// environment
var mongo_dbname = 'ta';
var mongo_constr = process.env.CUSTOMCONNSTR_mongo;
// var deployment_branch = (process.env.deployment_branch === undefined ? '_dev_machine' : process.env.deployment_branch);
// var test = (process.env.deployment_branch === undefined ? 'test' : process.env.deployment_branch).includes('test');
var mongo_layer = process.env.mongo_layer === undefined ? 0 : process.env.mongo_layer | 0;


// Test Connection
/*
mongoClient.connect(mongo_constr, function (err, conn) {
	assert.equal(null, err);
	console.log('Mongo connected');
	// db.collection('users').createIndex({_layer: 1});
	conn.close();
});
*/

console.log('Connecting mongo...');

mongo.connect(err=>{
	console.log('Mongo connected. Database = ' + mongo.getDb().databaseName);
	var n = mongo.getDb().collection('users').count();
	n.then(n=>console.log('Mongo connected. Users count = ' + n));
});


//var webhookHandler = createWebhookHandler({ path: '/githook', secret: process.env.secure_hook });

var app = express();
 
var options = {
	index: "index.htm"
};

app.use(express.static(__dirname + '/public', options));
app.use('/files', directory(__dirname + '/public/files', {'icons': true}));
app.use(serveFavicon(__dirname + '/public/favicon.ico'));

var server = app.listen(process.env.PORT, function () {
	var port = server.address().port;
	console.log('Server running at port %s', port);
});

var io = socketio(server, {
	transports: [ 'websocket' ],
});

/*
io.configure(function() {  
		io.set('transports', [ 'websocket' ]);
		if (process.env.IISNODE_VERSION) {
				io.set('resource', '/dante/socket.io');
		}
});
*/

// var redis = require('socket.io-redis');
// io.adapter(redis({ host: 'localhost', port: 6379 }));

//io.set('origins', '*');

io.on('connection', function(client) {
	console.log('IO connected');

		/*    
	mongoClient.connect(mongo_constr, function (err, db) {
		assert.equal(null, err);

		// client.emit('update', {a: 100});

		// report
		findUsers(db, function(users) {
			for (var key in users) { 
				client.emit('update', users[key]);
			}
			db.close();
		});
	});
		*/

	client.on('report', function(data) {
		console.log('Reported ' + JSON.stringify(data));
		var sender_token = data.id_token;
		data.id_token = undefined;

		//console.log('sender_token='+sender_token);
		//console.log('googleClientId='+googleClientId);

		console.log('token = ' + sender_token);

		var continuation = function() {
			// db - upsert user
			mongo.getDb().collection('users').update({_id:data.taUserId}, {_id:data.taUserId}, {upsert:true});
			client.broadcast.emit('update', data);
			// just to test:
			client.emit('update', data);
		};

		if (sender_token[0] == '#') {
			data.taUserId = sender_token;
			continuation();
		} else {
			authClient.verifyIdToken(
				sender_token,
				googleClientId,
				function(e, login) {
					var payload = login.getPayload();
					var aud = payload.aud;
					var userid = payload.sub;
					//var iat = payload['iat'];
					//var exp = payload['exp'];
					// var domain = payload['hd'];
					console.log('PAYLOAD');
					console.log(JSON.stringify(payload));
					//console.log('iat = ' + new Date(iat).toLocaleDateString());
					//console.log('exp = ' + new Date(exp).toLocaleDateString());

					if (aud==googleClientId && userid>0) {
						data.taUserId = 'google_' + userid;
						// continue
						continuation();
					}
				}
			);
		}

	});

});


app.post('/api/githook', function (req, res) {
	update(req, res);
});

function update(req, res) {
 
	function hasError (msg) {
		res.writeHead(400, { 'content-type': 'application/json' });
		res.end(JSON.stringify({ error: msg }));
	}

	var sig   = req.headers['x-hub-signature'];
	if (!sig)
			return hasError('access denied'); // No X-Hub-Signature found on request

	res.send('OK...');
	console.log("OK...");
	require('./autodeploy.js');
}
/*
app.get('/', function (req, res) {
	res.send('PROBLEM Express1: /');
});

app.get('/a', function (req, res) {
	res.send('PROBLEM Express1: /a');
});
*/
app.get('/api', function (req, res) {
	res.send('Express2: /api');
});

/*
app.get('/server.js', function (req, res) {
	res.send('Express2: /server.js');
});

app.get('/server.js/test', function (req, res) {
	res.send('Express3: /server.js/test: ' + process.env.PORT);
});
*/
app.get('/api/test', function (req, res) {
	res.send('Express3: /api/test: ' + process.env.PORT);
});
