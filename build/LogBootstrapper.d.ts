import { ILocalStorageLoggerConfiguration } from './loggers/ILocalStorageLoggerConfiguration';
import { ILog } from './ILog';
/**
 * Bootstraps the log chain setup.
 */
export declare class LogBootstrapper {
    private _timestampProvider;
    constructor(_timestampProvider?: () => Date);
    /**
     * Returns a logging interface that has been set up with default loggers and formatters.
     */
    bootstrap(config: ILocalStorageLoggerConfiguration): ILog;
}
