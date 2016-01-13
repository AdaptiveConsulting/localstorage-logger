/**
 * Allows logging and exporting of the log.
 */
export interface ILog {
    debug(...args: any[]): any;
    info(...args: any[]): any;
    warn(...args: any[]): any;
    error(...args: any[]): any;
    exportToArray(): string[];
}
