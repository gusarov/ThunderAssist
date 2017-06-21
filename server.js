'use strict';

// references
var fs = require('fs');
var express = require('express');
var serveFavicon = require('serve-favicon');
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

var app = express();
 
var options = {
  index: "index.htm"
};

app.use(express.static(__dirname + '/public', options));
app.use(serveFavicon(__dirname + '/public/favicon.ico'));

app.listen(process.env.PORT);

app.post('/api/githook', function (req, res) {
  console.log(JSON.stringify(req));
  res.send('OK...');
  // require('./autodeploy.js');
});

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

