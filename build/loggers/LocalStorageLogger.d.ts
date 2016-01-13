import { ILogger } from './ILogger';
import { ILogEntry } from '../core/ILogEntry';
import { ILocalStorageLoggerConfiguration } from './ILocalStorageLoggerConfiguration';
/**
 * Logger that logs to a queue in local storage. Will overwrite oldest entries
 * when desired size is exceeded.
 */
export declare class LocalStorageLogger implements ILogger {
    private _nextLogger;
    private _queue;
    /**
     * Constructs a new local storage logger.
     * @param config The configuration defining the unique queue name, desired size etc.
     * @param _nextLogger The next logger in the "log chain"
     */
    constructor(config: ILocalStorageLoggerConfiguration, _nextLogger: ILogger);
    /**
     * Logs an entry to local storage.
     */
    log(entry: ILogEntry): void;
}
