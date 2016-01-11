import {ILogger} from './ILogger';
import {LogLevel} from './LogLevel';
import {ILogEntryFormatter} from './ILogEntryFormatter';

export class ConsoleLogger implements ILogger {
  constructor(private _formatter: ILogEntryFormatter) {
  }

  log(level: LogLevel, message: string) {
    const formattedMessage = this._formatter.format({

    });
    console.log(
  }
}
