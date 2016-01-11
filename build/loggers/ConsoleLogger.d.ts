import { ILogger } from './ILogger';
import { LogLevel } from './LogLevel';
import { ILogEntryFormatter } from './ILogEntryFormatter';
export declare class ConsoleLogger implements ILogger {
    private _formatter;
    constructor(_formatter: ILogEntryFormatter);
    log(level: LogLevel, message: string): void;
}
