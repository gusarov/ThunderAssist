const https = require('https');
const fs = require('fs');
const extract = require('extract-zip');
const path = require('path');
const util = require('util');
const copydir = require('copy-dir');
const exec = require('child_process').exec;

const zipPath = process.env.tmp + '\\master.zip';
const extractPath = process.env.tmp + '\\masterzip';

/**
@param {string|URL} url
@param {string} dest
@param {function} cb
*/
function downloadSync(url, dest, cb) {
	const file = fs.createWriteStream(dest);
	const request = https.get(url, function(response) {
		response.pipe(file);
		file.on('finish', function() {
			file.close(cb);
		});
	});
}

if (fs.existsSync(zipPath)) {
	fs.unlinkSync(zipPath);
}

/** @param {string} path */
function cut(path) {
	return path.replace(process.env.temp, '%tmp%');
}

/** @param {string} str */
function log(str) {
	console.log(util.inspect(new Date()) + ' '+ cut(str));
}

module.exports = function(){
	log(`Downloading to ${zipPath} ...`);
	downloadSync('https://codeload.github.com/gusarov/ThunderAssist/zip/master', zipPath, ()=>{
		log(`Extracting to ${extractPath} ...`);
		extract(zipPath, {dir: extractPath}, function (err) {
			if (err) console.error(err);
			var from = extractPath+'\\ThunderAssist-master';
			var to = __dirname;
			log(`Copying from ${from} to ${to} ...`);
			if (fs.existsSync(path.join(to, '.git'))) {
				log('Protection: This folder have a git repo. Script would only work to update standalone deployments.');
			} else {
				copydir.sync(extractPath+'\\ThunderAssist-master', __dirname);
			}
			log('Done');
		});
	});
	
};
