var nprof = require('./index.js');

setInterval(function () {
    console.log((new Date()).toJSON());
}, 1000);


var f = function () {
    var s = 0;

    for (var i = 0; i < 10000000; i++) {
        s += i;
    }
};

setTimeout(function () {
    nprof.takeMemorySnapshot('.')
        .then((info) => {
            console.log('snapshoted to ', info);
        })
        .catch(function (error) {
            console.log(error);
        });

    nprof.cpuProfile('.', 2000)
        .then((info) => {
            console.log(info);
            process.exit(0);
        })
        .catch((error) => {
            console.log(error);
        });

        f();

}, 2000);