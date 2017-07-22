'use strict';

// references
var fs = require('fs');
var express = require('express');
var serveFavicon = require('serve-favicon');
//var createWebhookHandler = require('github-webhook-handler');

var socketio = require('socket.io');
var mongoDb = require('mongodb');
var assert = require('assert');

if (process.env.PORT === undefined) {
	process.env.PORT = 3000;
}

// read secure part that may contain some specific overrides and not stored in source control (connection strings, passwords)
if (fs.existsSync('./secret/secret.js')) {
	console.log('execute overrides...');
	require('./secret/secret')();
} else {
	console.log('no overrides');
}

// environment
var mongo_constr = process.env.CUSTOMCONNSTR_mongo;
// var deployment_branch = (process.env.deployment_branch === undefined ? '_dev_machine' : process.env.deployment_branch);
// var test = (process.env.deployment_branch === undefined ? 'test' : process.env.deployment_branch).includes('test');
var mongo_layer = process.env.mongo_layer === undefined ? 0 : process.env.mongo_layer | 0;


// Connect
var mongoClient = mongoDb.MongoClient;

mongoClient.connect(mongo_constr, function (err, db) {
	assert.equal(null, err);
	console.log('Mongo connected');
	// db.collection('users').createIndex({_layer: 1});
	db.close();
});

//var webhookHandler = createWebhookHandler({ path: '/githook', secret: process.env.secure_hook });

var app = express();
 
var options = {
	index: "index.htm"
};

app.use(express.static(__dirname + '/public', options));
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

	mongoClient.connect(mongo_constr, function (err, db) {
		assert.equal(null, err);

		// client.emit('update', {a: 100});

		/*    
		// report
		findUsers(db, function(users) {
			for (var key in users) { 
				client.emit('update', users[key]);
			}
			db.close();
		});
		*/
	});

	client.on('report', function(data) {
		console.log('Reported ' + JSON.stringify(data));
		client.broadcast.emit('update', data);
		client.emit('update', data);
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
