module LSL {
  /**
   * Interface for logging individual log entries.
   */
  export interface ILogger {
    /**
     * Logs a log entry.
     * @param entry The log entry
     */
    log(entry: ILogEntry);
  }
}
