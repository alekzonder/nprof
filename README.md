# nprof

small promise interface to [v8-profiler](https://github.com/node-inspector/v8-profiler) functions

# install

```
npm i --save nprof
```

# usage

```js
var nprof = require('nprof');

nprof.takeMemorySnapshot('.')
    .then((info) => {

    })
    .catch(function (error) {
        console.log(error);
    });

```

# api

## cpuProfile(snapshotPath, timeout, options) : Promise

- **snapshotPath** - path to directory (nprof generate filenames, see)
- **timeout**      - timeout in ms
- **options**
    - **filepath** - set this option with filepath, if you need your own filepath and filename

start cpu profiling, stop after timeout and save to snapshotPath

### filename mask

```
${snapshotPath}/v8.cpu.' + (new Date()).tJSON() + '.timeout.' + timeout + '.cpuprofile'
```

## takeMemorySnapshot(snapshotPath, options) : Promise

- **snapshotPath** - path to directory (nprof generate filenames)
- **options**
    - **filepath** - set this option with filepath, if you need your own filename

take memory snapshot and save to snapshotPath

### filename mask

```
${snapshotPath}/v8.cpu.' + (new Date()).tJSON() + '.cpuprofile'
```

# LICENSE

MIT

