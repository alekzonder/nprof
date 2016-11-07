var express = require('express');

var app = express();

var expressNprofRegister = require(__dirname + '/../../express/register');

expressNprofRegister(null, app, {snapshotPath: '/tmp/snapshots'});

app.get('/', function (req, res) {
    res.json(1);
});

app.listen(5005, () => {
    console.log(`listen on null:5005`);
});