/**
 * Allows logging and exporting of the log.
 */
export interface ILog {
  debug(...args: any[]);
  info(...args: any[]);
  warn(...args: any[]);
  error(...args: any[]);

  exportToArray(): string[];
}
