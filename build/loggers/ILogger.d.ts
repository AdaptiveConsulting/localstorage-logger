import { LogLevel } from './LogLevel';
export interface ILogger {
    log(level: LogLevel, message: string): any;
}
