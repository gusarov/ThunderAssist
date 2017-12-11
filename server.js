'use strict';

// unhandledRejection are going to become critical anyway
process.addListener('unhandledRejection', (promise)=>{
	console.error('unhandledRejection', promise);
	process.exit(1);
});

/* FS & Secure */
const fs = require('fs');

// read secure part that may contain some specific overrides and not stored in source control (connection strings, passwords)
if (fs.existsSync('./secret/secret.js')) {
	console.log('execute overrides...');
	require('./secret/secret')();
} else {
	console.log('no overrides');
}

/* REFERENCES */
const crypto = require('crypto');
const express = require('express');
const Request = express.request;
const Response = express.response;
//const serveFavicon = require('serve-favicon');
//const directory = require('serve-index');
const socketio = require('socket.io');
//const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const path = require('path');
const bodyParser = require('body-parser');
// const spdy = require('spdy');
const exec = require('child_process').exec;
const auth = new (require('google-auth-library'));

/* CUSTOM */
const dal = require('./dal');

/* CONFIGURE */

const googleClientId = '521830143322-shvg9lc373l28r4etj4u25i3gi34hkjg.apps.googleusercontent.com';
const authClient = new auth.OAuth2(googleClientId, '', '');

if (process.env.PORT === undefined) {
	process.env.PORT = '3000';
}

// environment
//var mongo_dbname = 'ta';
const mongo_constr = process.env.CUSTOMCONNSTR_mongo || 'mongodb://localhost/ta_dev';
// var deployment_branch = (process.env.deployment_branch === undefined ? '_dev_machine' : process.env.deployment_branch);
// var test = (process.env.deployment_branch === undefined ? 'test' : process.env.deployment_branch).includes('test');
if (process.env.mongo_layer === undefined) {
	process.env.mongo_layer = '0';
}

if (process.env.git_hook_key === undefined) {
	// process.env.git_hook_key = Math.random().toString();
}

// const mongo_layer = parseInt(process.env.mongo_layer || '100');


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

var con = async function (){
	await dal.connect(mongo_constr);
	console.log('Mongo connected. Database = ' + dal.getDb().databaseName);
	var n = await dal.getDb().collection('users').count({});
	console.log('Mongo connected. Users count = ' + n);
	console.log('Record this start of service...');
	await dal.getDb().collection('app_log').insert({time: new Date(), message: 'node started'});
	console.log('Recorded');
}();



//var webhookHandler = createWebhookHandler({ path: '/githook', secret: process.env.secure_hook });

var app = express();

//app.get();

var options = {
	index: 'index.htm',
};

app.use(bodyParser.json({verify: (req,res,buf) => req.rawBody=buf}));

// app.use(express.static(__dirname + '/public', options));
// app.use('/files', directory(__dirname + '/public/files', {'icons': true}));
//app.use(serveFavicon(__dirname + '/public/favicon.ico'));

// Add an error-handling Express middleware function to prevent returning sensitive information.
/*
app.use(function abortOnError(err, req, res, next) {
	if (err) {
		console.log(err);
		res.status(400).send({ error: 'Invalid signature.' });
	} else {
		next();
	}
});
*/

var tasks = [
	{ id: 1, name: 'Go to shop' },
	{ id: 2, name: 'Milk' },
	{ id: 3, name: 'Screws' },
	{ id: 4, name: 'Charger for screwdriver' }
];

var nextid = 5;

var map = {};

tasks.forEach(element => {
	map[element.id] = element;
});

console.log('start');
/*
app.set('etag', false);
app.use(function(req, res, next) {
	console.log('request');
	//delete all headers related to cache
	req.headers['if-none-match'] = '';
	req.headers['if-modified-since'] = '';
	next();
});
*/
app.get('/api/tasks', (req, res) => {
	res.send(JSON.stringify(tasks));
});

app.get('/api/tasks/:id', (req, res) => {
	// console.log('get', req.params.id);
	res.send(JSON.stringify(map[req.params.id]));
});

app.put('/api/tasks', (req, res) => {
	// console.log('put', req.baseUrl);
	// console.log(req.body);
	//res.send(JSON.stringify(map[req.params.id]));
	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].id === req.body.id) {
			tasks[i] = req.body;
		}
	}
	map[req.body.id] = req.body;
	res.sendStatus(204);
});

app.delete('/api/tasks/:id', (req, res) => {
	console.log('delete', req.baseUrl);
	var id = parseInt(req.params.id);
	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].id === id) {
			tasks.splice(i, 1);
			break;
		}
	}
	delete map[req.params.id];
	console.log(tasks);
	console.log(map);
	res.sendStatus(204);
});

app.post('/api/tasks', (req, res) => {
	req.body.id = nextid++;
	map[req.body.id] = req.body;
	tasks.push(req.body);
	res.send(req.body);
});

/*
// application middleware
app.use(function (req, res, next) {
	// google auth is not working with 127.0.0
	if (req.headers.host.includes('127.0.0')) {
		const prot = req.secure ? 'https' : 'http';
		const port = parseInt(/:(\d+)/.exec(req.headers.host)[1]);
		res.redirect(`${prot}://localhost:${port}${req.originalUrl}`);
		return;
	}
	next();
});
*/

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
			dal.getDb().collection('users').update({_id:data.taUserId}, {_id:data.taUserId}, {upsert:true});
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

if (process.env.git_hook_sec_adr != undefined) {
	app.post('/api/githook/'+process.env.git_hook_sec_adr, redeploy);
}

/** @param {Request} req @param {Response} res */
function redeploy(req, res) {
	console.log('redeploy called');
	/** @param {string} msg */
	function hasError (msg) {
		res.writeHead(400, { 'content-type': 'application/json' });
		res.end(JSON.stringify({ error: msg }));
	}

	var hmac = crypto.createHmac('sha1', process.env.git_hook_sec_key || '');
	hmac.update(req.rawBody, 'utf-8');
	var shouldSig = 'sha1=' + hmac.digest('hex');

	var requestSig = req.headers['x-hub-signature'];
	if (!requestSig)
		return hasError('Access denied. Signature is not provided');

	if (requestSig !== shouldSig) {
		return hasError('Access denied. Wrong signature.');
	}
	
	res.send('OK...');
	console.log('OK...');
	exec('schtasks /run /tn:_custom/deploy_ta'); // delegate to priviledged task
	//require('./autodeploy.js')();
}

app.get('/api', /** @param {Request} req @param {Response} res */ function (req, res) {
	res.send('Express: /api');
});

app.get('/api/test', /** @param {Request} req @param {Response} res */ function (req, res) {
	res.send('Express: /api/test: ' + process.env.PORT);
});

app.get('/api/*', /** @param {Request} req @param {Response} res */ function (req, res) {
	res.send('Express: api call unknown');
});

/** Dev Server - Host Angular & assets from node server too */
app.use(express.static(path.join(__dirname, 'dist')));
app.get('/*', /** @param {Request} req @param {Response} res */ function(req, res) {
	res.sendFile(path.join(__dirname + '/dist/index.html'));
});
