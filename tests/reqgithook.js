var http = require('http');
var https = require('https');

var postData = JSON.stringify({
	'compilation_level' : 'ADVANCED_OPTIMIZATIONS',
	'output_format': 'json',
	'output_info': 'compiled_code',
	'warning_level' : 'QUIET',
});

/** @type {Buffer} */
var postBuffer = new Buffer(postData);

console.log('request...');
var response = '';
var req = http.request({
	host: '127.0.0.1',
	port: '3000',
	path: '/api/githook/',
	method: 'POST',
	headers: {
		'X-Hub-Signature': 'asdsa',
		'Content-Type': 'application/json',
		'Content-Length': postBuffer.byteLength
	}
}, function(res) {
	res.setEncoding('utf8');
	res.on('data', function (chunk) {
		response = response + chunk;
		console.log('Response [CHUNK!]: ' + chunk);
	});
	res.on('end', function(){
		console.log('Response: ' + response);
	});
});

console.log('write...');
req.write(postBuffer);

console.log('end...');
req.end();
