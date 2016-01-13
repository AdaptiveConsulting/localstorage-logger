import {ILogEntry} from '../core/ILogEntry';

/**
 * Interface for formatting log entries for presentation.
 */
export interface ILogEntryFormatter {
  /**
   * Takes a log entry and returns a formatted string.
   * @param entry The log entry
   */
  format(entry: ILogEntry) : string;
}
