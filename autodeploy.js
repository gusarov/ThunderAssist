const http = require('https');
const fs = require('fs');
const extract = require('extract-zip');
const copydir = require('copy-dir');
const exec = require('child_process').exec;

const zipPath = process.env.tmp + '\\master.zip';
const extractPath = process.env.tmp + '\\masterzip';

/**
@param {string|URL} url
@param {string} dest
@param {function} cb
*/
const download = function(url, dest, cb) {
	const file = fs.createWriteStream(dest);
	const request = http.get(url, function(response) {
		response.pipe(file);
		file.on('finish', function() {
			console.log('FINISH');
			file.close(cb);
		});
	});
};

/**
@param {string|URL} url
@param {string} dest
*/
async function downloadAsync(url, dest) {
	const file = fs.createWriteStream(dest);
	const p = new Promise(resolve => {
		console.log('waiting finish...');
		file.on('finish', ()=>{
			console.log('FINISH');
			resolve();
		});
	});
	const request = http.get(url);
	const response = request.

	response.pipe(file);
	await p;
	file.close();
	console.log('Done...');
}


if (fs.existsSync(zipPath)) {
	fs.unlinkSync(zipPath);
}

console.log('Downloading...');
//*
var d = async function(){
	await downloadAsync('https://codeload.github.com/gusarov/ThunderAssist/zip/master', zipPath);
	exec(zipPath);

	console.log('Extracting...');
	/*
	extract(zipPath, {dir: extractPath}, function (err) {
		if (err)
			console.error(err);
		console.log('Copying...');
		copydir.sync(extractPath+'\\ThunderAssist-master', 'C:\\inetpub\\wwwroot');
		console.log('Done');
	});
	*/
}();
//*/
/*
download('https://codeload.github.com/gusarov/ThunderAssist/zip/master', zipPath, function() {
	console.log('Extracting...');
	extract(zipPath, {dir: extractPath}, function (err) {
		if (err)
			console.error(err);
		//console.log('Copying...');
		//copydir.sync(extractPath+'\\ThunderAssist-master', 'C:\\inetpub\\wwwroot');
		//console.log('Done');
	});
});
*/
