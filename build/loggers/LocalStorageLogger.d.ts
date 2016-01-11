import { ILocalStorageLoggerConfiguration } from './ILocalStorageLoggerConfiguration';
import { LogLevel } from './LogLevel';
import { ILogger } from './ILogger';
export declare class LocalStorageLogger implements ILogger {
    private _nextLogger;
    private _queue;
    constructor(config: ILocalStorageLoggerConfiguration, _nextLogger: ILogger);
    log(level: LogLevel, message: string): void;
}
