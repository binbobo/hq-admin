var express = require('express');
var app = express();

app.use("/", express.static(__dirname + "/"));

app.get('*', function (req, res) {
    res.sendFile('index.html', { root: __dirname });
});

var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('app listening at http://%s:%s', host, port);
});