# nprof

small promise interface to [v8-profiler](https://github.com/node-inspector/v8-profiler) functions

# install

```
npm i --save nprof
```

# usage

```js
var nprof = require('nprof');

nprof.takeMemorySnapshot('/tmp/snapshots')
    .then((info) => {})
    .catch((error) => {});

nprof.cpuProfile('/tmp/snapshots', 2000)
    .then((info) => {})
    .catch((error) => {});

```

# api

## takeMemorySnapshot(snapshotPath, options) : Promise

- **snapshotPath** - path to directory (nprof generate filenames)
- **options**
    - **filepath** - set this option with filepath, if you need your own filename

take memory snapshot and save to snapshotPath

### filename mask

```
${snapshotPath}/v8.cpu.' + (new Date()).tJSON() + '.cpuprofile'
```

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

## startCpuProfile()

start cpu profiling

## stopCpuProfile() : CpuProfile

stop cpu proflile

## saveCpuProfile(profile, snapshotPath, options) : Promise

save profile to file

- **profile** - profile object
- **snapshotPath** - path to directory (nprof generate filenames)
- **options**
    - **filepath** - set this option with filepath, if you need your own filename



# LICENSE

MIT

