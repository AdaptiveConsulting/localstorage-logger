module LSL {
  /**
   * Logger that logs to a queue in local storage. Will overwrite oldest entries
   * when desired size is exceeded.
   */
  export class LocalStorageLogger implements ILogger {
    private _queue: LSQ.LimitedSizeQueue<ILogEntry>;

    /**
     * Constructs a new local storage logger.
     * @param config The configuration defining the unique queue name, desired size etc.
     * @param _nextLogger The next logger in the "log chain"
     */
    constructor(config: ILocalStorageLoggerConfiguration, private _nextLogger: ILogger) {
      this._queue = new LSQ.LimitedSizeQueue<ILogEntry>({
        keyPrefix: config.logName,
        maxSizeInBytes: config.maxLogSizeInBytes
      });
    }

    /**
     * Logs an entry to local storage.
     */
    log(entry: ILogEntry) {
      try {
        const time = new Date();
        this._queue.enqueue(entry);
      } catch (error) {
        console.error('Failed to log to local storage.', error);
      } finally {
        this._nextLogger.log(entry);
      }
    }
  }
}
