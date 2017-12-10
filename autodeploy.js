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
function downloadSync(url, dest, cb) {
	const file = fs.createWriteStream(dest);
	const request = http.get(url, function(response) {
		response.pipe(file);
		file.on('finish', function() {
			console.log(new Date(), 'FINISH');
			file.close(cb);
		});
	});
}

if (fs.existsSync(zipPath)) {
	fs.unlinkSync(zipPath);
}

//*
module.exports = function(){
	console.log(new Date(), 'Downloading...');
	if (fs.existsSync(path.join(__dirname, '.git'))) {
		console.log(new Date(), 'Protection: This folder have a git repo. Script would only work to update standalone deployments.');
		return;
	}
	
	downloadSync('https://codeload.github.com/gusarov/ThunderAssist/zip/master', zipPath, ()=>{

		console.log(new Date(), 'Extracting...');

		extract(zipPath, {dir: extractPath}, function (err) {
			if (err)
				console.error(err);
			console.log(new Date(), 'Copying...');
			copydir.sync(extractPath+'\\ThunderAssist-master', __dirname);
			console.log(new Date(), 'Done');
		});
	});
	
};
