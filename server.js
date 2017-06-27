'use strict';

// references
var fs = require('fs');
var express = require('express');
var serveFavicon = require('serve-favicon');
//var createWebhookHandler = require('github-webhook-handler');

// var socketio = require('socket.io');
var mongoDb = require('mongodb');
// var assert = require('assert');

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

//var webhookHandler = createWebhookHandler({ path: '/githook', secret: process.env.secure_hook });

var app = express();
 
var options = {
  index: "index.htm"
};

app.use(express.static(__dirname + '/public', options));
app.use(serveFavicon(__dirname + '/public/favicon.ico'));

app.listen(process.env.PORT);

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

app.get('/', function (req, res) {
  res.send('PROBLEM Express1: /');
});
app.get('/a', function (req, res) {
  res.send('PROBLEM Express1: /a');
});
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

