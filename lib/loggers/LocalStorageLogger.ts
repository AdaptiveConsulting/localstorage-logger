import {ILocalStorageLoggerConfiguration} from './ILocalStorageLoggerConfiguration';
import {LogLevel} from './LogLevel';
import {ILogEntry} from './ILogEntry';
import {ILogger} from './ILogger';
import {LimitedSizeQueue} from '../queue/LimitedSizeQueue';

export class LocalStorageLogger implements ILogger {
  private _queue: LimitedSizeQueue<ILogEntry>;

  constructor(config: ILocalStorageLoggerConfiguration, private _nextLogger: ILogger) {
    this._queue = new LimitedSizeQueue<ILogEntry>({
      keyPrefix: config.logName,
      maxSizeInBytes: config.maxLogSizeInBytes
    });
  }

  log(level: LogLevel, message: string) {
    try {
      const time = new Date();
      this._queue.enqueue({level, message, time});
    } catch (error) {
      console.error('Failed to log to local storage.', error);
    } finally {
      this._nextLogger.log(level, message);
    }
  }
}
