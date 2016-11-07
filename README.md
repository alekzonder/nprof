# nprof

[![NPM](https://nodei.co/npm/nprof.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/nprof/)

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
${snapshotPath}/v8.cpu.2016-09-20T13-56-53-936.cpuprofile'
```

## cpuProfile(snapshotPath, timeout, options) : Promise

- **snapshotPath** - path to directory (nprof generate filenames, see)
- **timeout**      - timeout in ms
- **options**
    - **filepath** - set this option with filepath, if you need your own filepath and filename

start cpu profiling, stop after timeout and save to snapshotPath

### filename mask

```
${snapshotPath}/v8.cpu.2016-09-20T13-56-53-93.timeout.' + timeout + '.cpuprofile'
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


# express.js helper

express.js profiling helper

## usage

```js

// logger is you logger with info, warn and error methods

var nprofRegister = require('nprof/express/register');

var app = express();

var nprofConfig = {
    snapshotPath: '/tmp/snapshots'
};

nprofRegister(logger, app, nprofConfig);

```

## REST API

## POST /_profile/cpu?timeout={int}

- **timeout** - profile timeout, length of profiling in ms, default = 5000

profile CPU, save to `nprofConfig.snapshotPath`

## POST /_profile/cpu/start

start cpu profiling until POST /_profile/cpu/stop not executed

## POST /_profile/cpu/stop

stop cpu profiling and save to `nprofConfig.snapshotPath`

## POST /_profile/mem

take memory snapshot and save to `nprofConfig.snapshotPath`

## GET /_profile/mem/usage

get actual memory usage via `process.memoryUsage`

## POST /_profile/gc/start

exec global.gc() if process started with `--expose-gc` option

return before and after `process.memoryUsage`

## GET /_status

return memory usage and event loop delay

you can add your own status metrics via config.statusFn hook function

see examples/status for more information



# LICENSE

MIT

