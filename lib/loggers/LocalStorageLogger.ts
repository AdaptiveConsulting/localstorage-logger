import {ILogger} from './ILogger';
import {ILogEntry} from '../core/ILogEntry';
import {ILocalStorageLoggerConfiguration} from './ILocalStorageLoggerConfiguration';
import {LimitedSizeQueue} from '../queue/LimitedSizeQueue';

/**
 * Logger that logs to a queue in local storage. Will overwrite oldest entries
 * when desired size is exceeded.
 */
export class LocalStorageLogger implements ILogger {
  private _queue: LimitedSizeQueue<ILogEntry>;

  /**
   * Constructs a new local storage logger.
   * @param config The configuration defining the unique queue name, desired size etc.
   * @param _nextLogger The next logger in the "log chain"
   */
  constructor(config: ILocalStorageLoggerConfiguration, private _nextLogger: ILogger) {
    this._queue = new LimitedSizeQueue<ILogEntry>({
      keyPrefix: config.logName,
      maxSizeInBytes: config.maxLogSizeInBytes
    });
  }

  /**
   * Logs an entry to local storage.
   */
  log(entry: ILogEntry) {
    try {
      this._queue.enqueue(entry);
    } catch (error) {
      console.error('Failed to log to local storage.', error);
    } finally {
      this._nextLogger.log(entry);
    }
  }

  /**
   * Returns all log entries that are still held in local storage.
   */
  allEntries() : Array<ILogEntry> {
    const entries = new Array<ILogEntry>();
    this._queue.iterate(entry => entries.push(entry));
    return entries;
  }
}
