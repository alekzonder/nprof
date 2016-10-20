var nprof = require('./index.js');

setInterval(function () {
    console.log((new Date()).toJSON());
}, 1000);


var arr = [];

var f = function () {
    arr.push([].fill(1, 1000));
};

setInterval(function () {

    nprof.takeMemorySnapshot('./snap')
        .then((info) => {
            console.log('snapshoted to ', info);
        })
        .catch(function (error) {
            console.log(error);
        });

    // nprof.cpuProfile('.', 2000)
    //     .then((info) => {
    //         console.log(info);
    //
    //         nprof.startCpuProfile();
    //
    //         f();
    //
    //         var profile = nprof.stopCpuProfile();
    //
    //         return nprof.saveCpuProfile(profile, '.');
    //     })
    //     .then((info) => {
    //         console.log(info);
    //         process.exit();
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });
    f();

}, 1000);


setTimeout(function () {
    process.exit();
}, 10000);