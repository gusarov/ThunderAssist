if (process.env.PORT === undefined) {
  process.env.PORT = 3000;
}

var express = require('express');
var app = express();
 
var options = {
  index: "index.htm"
};

app.use(express.static('public', options));

app.get('/', function (req, res) {
  res.send('Express1: /');
});

app.get('/server.js', function (req, res) {
  res.send('Express2: /server.js');
});

app.get('/server.js/test', function (req, res) {
  res.send('Express3: /server.js/test: ' + process.env.PORT);
});

app.listen(process.env.PORT);