var path = require('path');
var nprof = require(path.join(__dirname, '..', 'index.js'));
var blocked = require('blocked');

var blockedFor = 0;

blocked(function(ms) {
    blockedFor = ms | 0;
});

module.exports = function(logger, app, config) {

    var log = function (type, message) {
        if (logger && typeof logger[type] === 'function') {
            logger[type](message);
        } else {
            console.log(message);
        }
    };

    var logInfo = function(message) {
        log('info', message);
    };

    var logWarn = function(message) {
        log('warn', message);
    };

    var logError = function(message) {
        log('error', message);
    };

    app.post('/_service/profile/cpu', function(req, res) {

        var timeout = 5000;

        if (req.query.timeout && !isNaN(req.query.timeout)) {
            timeout = parseInt(req.query.timeout, 10);
        }

        logInfo('[POST /_service/profile/cpu] starting cpu profile with timeout = ' + timeout + 'ms');

        nprof.cpuProfile(config.snapshotPath, timeout)
            .then((info) => {
                logInfo('[POST /_service/profile/cpu] profile saved to ' + info.filepath);
                res.json({
                    result: info
                });
            })
            .catch((error) => {
                logError(error);
                res.status(500).json({
                    error: error.message
                });
            });
    });

    app.post('/_service/profile/cpu/start', function(req, res) {

        logInfo('[POST /_service/profile/cpu/start] starting cpu profile');

        nprof.startCpuProfile();
        res.json({
            result: 'started'
        });
    });

    app.post('/_service/profile/cpu/stop', function(req, res) {

        logInfo('[POST /_service/profile/cpu/stop] stopping cpu profile');

        var profile = nprof.stopCpuProfile();

        nprof.saveCpuProfile(profile, config.snapshotPath)
            .then((info) => {
                logInfo('[POST /_service/profile/cpu/stop] profile saved to ' + info.filepath);
                res.json({
                    result: info
                });
            })
            .catch((error) => {
                logError(error);
                res.status(500).json({
                    error: error.message
                });
            });

    });

    app.post('/_service/profile/mem', function(req, res) {

        logInfo('[POST /_service/profile/mem] taking memory snapshot');

        nprof.takeMemorySnapshot(config.snapshotPath)
            .then((info) => {
                logInfo('[POST /_service/profile/mem] memory snapshot saved to ' + info.filepath);
                res.json({
                    result: info
                });
            })
            .catch((error) => {
                logError(error);
                res.status(500).type('json').json({
                    error: error.message
                });
            });
    });

    app.get('/_service/profile/mem/usage', function(req, res) {
        var raw = process.memoryUsage();

        var mem = {};

        if (req.query.scale) {

            var scale = parseInt(req.query.scale, 10);

            for (var key in raw) {
                mem[key] = raw[key] / scale;
            }

        } else {
            mem = raw;
        }

        res.json({
            result: mem
        });
    });

    app.post('/_service/profile/gc/start', function(req, res) {

        if (!global.gc) {
            logWarn('no global.gc');
            return res.status(400).json({
                error: 'no global.gc'
            });
        }

        logInfo('[/_service/profile/gc/start] starting gc');

        var before = process.memoryUsage();

        global.gc();

        var after = process.memoryUsage();

        res.json({
            result: {
                before: before,
                after: after
            }
        });

    });

    app.get('/_service/profile/status', function(req, res) {
        var raw = process.memoryUsage();

        var scale = 1024 * 1024;

        if (req.query.scale) {
            scale = parseInt(req.query.scale, 10);
        }

        var mem = {};

        for (var key in raw) {
            mem[key] = raw[key] / scale;
        }

        var status = {
            mem: mem,
            loop: blockedFor
        };

        if (config && typeof config.statusFn === 'function') {
            status = config.statusFn(status);
        }

        res.json({
            result: status
        });
    });
};
