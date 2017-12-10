const http = require('https');
const fs = require('fs');
const extract = require('extract-zip');
const path = require('path');
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
			console.log(new Date(), 'FINISH');
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
		console.log(new Date(), 'waiting finish...');
		file.on('finish', ()=>{
			console.log(new Date(), 'FINISH');
			resolve();
		});
	});
	const request = http.get(url);
	const response = request.

	response.pipe(file);
	await p;
	file.close();
	console.log(new Date(), 'Done...');
}


if (fs.existsSync(zipPath)) {
	fs.unlinkSync(zipPath);
}

//*
module.exports = async function(){
	console.log(new Date(), 'Downloading...');
	if (fs.existsSync(path.join(__dirname, '.git'))) {
		console.log(new Date(), 'Protection: This folder have a git repo. Script would only work to update standalone deployments.');
		return;
	}
	// await downloadAsync('https://codeload.github.com/gusarov/ThunderAssist/zip/master', zipPath);
	// exec(zipPath);

	console.log(new Date(), 'Extracting...');
	/*
	extract(zipPath, {dir: extractPath}, function (err) {
		if (err)
			console.error(err);
		console.log('Copying...');
		copydir.sync(extractPath+'\\ThunderAssist-master', 'C:\\inetpub\\wwwroot');
		console.log('Done');
	});
	*/
};
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
