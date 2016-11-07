var path = require('path');
var express = require('express');

var app = express();

var expressNprofRegister = require(path.resolve(__dirname + '/../../express/register'));

var requestCount = 0;

var statusFn = function (status) {
    status.requestCount = requestCount;
    return status;
};

expressNprofRegister(null, app, {snapshotPath: '/tmp/snapshots', statusFn: statusFn});

app.get('/', function (req, res) {
    requestCount++;
    res.json(1);
});

app.listen(5005, () => {
    console.log(`listen on null:5006`);
});