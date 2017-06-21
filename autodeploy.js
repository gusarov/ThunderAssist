console.log("Downloading...");
var zipPath = process.env.tmp + "\\master.zip";
var extractPath = process.env.tmp + "\\masterzip";
var http = require('https');
var fs = require('fs');

var download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);
    });
  });
};

download("https://codeload.github.com/gusarov/ThunderAssist/zip/master", zipPath, function() {
    console.log("Extracting...");
    var extract = require('extract-zip');
    extract(zipPath, {dir: extractPath}, function (err) {
        if (err)
            console.error(err);
        var copydir = require('copy-dir');
        console.log("Copying...");
        copydir.sync(extractPath+'\\ThunderAssist-master', 'C:\\inetpub\\wwwroot');
        console.log("Done");
    });
});

