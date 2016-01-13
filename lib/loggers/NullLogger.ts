import {ILogger} from './ILogger';

/**
 * A logger that doesn't actually do anything. Used for terminating a chain of loggers.
 */
export class NullLogger implements ILogger {
  /**
   * No-op
   */
  log(entry) {
  }
}
