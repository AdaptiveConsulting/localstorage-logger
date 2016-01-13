import {DefaultFormatter} from './formatters/DefaultFormatter';
import {NullLogger} from './loggers/NullLogger';
import {ConsoleLogger} from './loggers/ConsoleLogger';
import {ILocalStorageLoggerConfiguration} from './loggers/ILocalStorageLoggerConfiguration';
import {LocalStorageLogger} from './loggers/LocalStorageLogger';
import {ILog} from './ILog';
import {LogLevel} from './core/LogLevel';

/**
 * Bootstraps the log chain setup.
 */
export class LogBootstrapper {
  constructor(private _timestampProvider: () => Date = () => new Date()) {
  }
  /**
   * Returns a logging interface that has been set up with default loggers and formatters.
   */
  bootstrap(config: ILocalStorageLoggerConfiguration) : ILog {
    const formatter = new DefaultFormatter();
    // Chain of responsibility style pattern here...
    const chainTerminal = new NullLogger();
    const consoleLogChain = new ConsoleLogger(formatter, chainTerminal);
    const localStorageLogChain = new LocalStorageLogger(config, consoleLogChain);
    // Writes a message of a given log level to the start of the chain
    const write = (level, args: any[]) => {
      const time = this._timestampProvider().toISOString();
      const jsonMessage = JSON.stringify(args);
      const jsonMessageWithoutBrackets = jsonMessage.slice(1, jsonMessage.length - 1);
      localStorageLogChain.log({
        level, time, message: jsonMessageWithoutBrackets
      });
    }
    // Returns the logging interface for consumers
    return {
      debug(...args) { write(LogLevel.DEBUG, args); },
      info(...args) { write(LogLevel.INFO, args); },
      warn(...args) { write(LogLevel.WARN, args); },
      error(...args) { write(LogLevel.ERROR, args); },
      exportToArray() { return localStorageLogChain.allEntries().map(entry => formatter.format(entry)); }
    };
  }
}

