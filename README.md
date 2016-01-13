# localstorage-logger
Logging library for writing to and exporting from local storage.

## What is it?

This JavaScript library provides a mechanism to log to local storage and export the most recent entries. It will overwrite the oldest entries when writing a new entry if adding the entry makes the log bigger than `maxLogSizeInBytes`.

## Motivation
At the time of writing, all the libraries we could find that provide logging or queuing in local storage used a single storage key. This means that they had to serialize the whole log/queue on any modification. This resulted in worse performance as the log got bigger.

Instead of a single key, we use many keys. Therefore, the cost of serialization on each modification is much lower than in the other libraries we found. However, this means we lose atomicity when making modifications to the underlying data structure. JavaScript is single-threaded so this doesn't pose much of a problem but theoretically a browser crash at exactly the right moment could courrpt the underlying data structure built on top of local storage.

## Usage

This is how you can use the logging functionality:

```
import {LogBootstrapper} from 'localstorage-logger';

const bootstrapper = new LogBootstrapper();
const log = bootstrapper.bootstrap({
  logName: 'my-app-log-name',
  maxLogSizeInBytes: 500 * 1024 // 500KB
});

// Log something
// debug | info | warn | error
log.info('something', {
  foo: 'bar'
}, 42);

// Export the log entries
const logEntries = log.exportToArray();
```
