module LSL {
  /**
   * A logger that doesn't actually do anything. Used for terminating a chain of loggers.
   */
  export class NullLogger implements ILogger {
    /**
     * Constructs a no-op logger.
     */
    constructor() { }

    /**
     * No-op
     */
    log(entry) {
    }
  }
}
