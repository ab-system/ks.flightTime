var express = require('express');

var app = express();
var port = 8090;

process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log(err)
})

app.use(express.static(__dirname + '/'));

app.listen(port);

console.log("App listening on port " + port);
