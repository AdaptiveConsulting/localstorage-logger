import { LogLevel } from './LogLevel';
/**
 * Represents an entry in an application log.
 */
export interface ILogEntry {
    /**
     * The time the log entry was created.
     */
    time: string;
    /**
     * The log message.
     */
    message: string;
    /**
     * The log level
     */
    level: LogLevel;
}
