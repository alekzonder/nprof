var fs = require('fs');

var profiler = require('v8-profiler');

var saveMemorySnapshot = function (snapshot, filepath) {

    return new Promise(function (resolve, reject) {

        snapshot.export()
            .pipe(fs.createWriteStream(filepath))
            .on('error', function(error) {
                snapshot.delete();
                reject(error);
            })
            .on('finish', function() {

                snapshot.delete();

                var header = snapshot.getHeader();

                header.filepath = filepath;

                resolve(header);
            });

    });

};

var takeMemorySnapshot = function(snapshotPath, options) {

    return new Promise(function(resolve, reject) {
        var date = (new Date()).toJSON();

        var snapshot = profiler.takeSnapshot(date);

        var filepath = snapshotPath + '/v8.mem.' + date + '.heapsnapshot';

        if (options && options.filepath) {
            filepath = options.filepath;
        }

        saveMemorySnapshot(snapshot, filepath)
            .then(function (header) {
                resolve(header);
            })
            .catch(function (error) {
                reject(error);
            });

    });

};

var startCpuProfile = function() {
    var date = (new Date()).toJSON();
    profiler.startProfiling(date, true);
};

var stopCpuProfile = function() {
    return profiler.stopProfiling();
};

var saveCpuProfile = function(profile, snapshotPath, options) {

    return new Promise(function (resolve, reject) {

        var filepath = snapshotPath + '/v8.cpu.' + profile.title;

        if (options && options.timeout) {
            filepath += '.timeout.' + options.timeout;
        }

        filepath += '.cpuprofile';

        if (options && options.filepath) {
            filepath = options.filepath;
        }

        profile.export()
            .pipe(fs.createWriteStream(filepath))
            .on('error', function(error) {
                profile.delete();
                reject(error);
            })
            .on('finish', function() {

                profile.delete();

                var header = profile.getHeader();

                header.filepath = filepath;

                resolve(header);
            });
    });

};

var cpuProfile = function(snapshotPath, timeout, options) {

    return new Promise(function (resolve, reject) {

        if (!timeout) {
            return reject(new Error('timeout param required'));
        }

        startCpuProfile();

        if (!options) {
            options = {};
        }

        options.timeout = timeout;

        setTimeout(function() {
            var profile = stopCpuProfile();

            saveCpuProfile(profile, snapshotPath, options)
                .then(function (header) {
                    resolve(header);
                })
                .catch(function (error) {
                    reject(error);
                });

        }, timeout);

    });

};

module.exports = {
    takeMemorySnapshot: takeMemorySnapshot,
    cpuProfile: cpuProfile,
    startCpuProfile: startCpuProfile,
    stopCpuProfile: stopCpuProfile,
    saveCpuProfile: saveCpuProfile
};
