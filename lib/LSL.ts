export {IQueueConfiguration} from './queue/IQueueConfiguration';
export {LimitedSizeQueue} from './queue/LimitedSizeQueue';

export {ILocalStorageLoggerConfiguration} from './loggers/ILocalStorageLoggerConfiguration';
export {LocalStorageLogger} from './loggers/LocalStorageLogger';
export {ConsoleLogger} from './loggers/ConsoleLogger';
export {NullLogger} from './loggers/NullLogger';

export {DefaultFormatter} from './formatters/DefaultFormatter';

export {LogBootstrapper} from './LogBootstrapper';

import {ILocalStorageLoggerConfiguration} from './loggers/ILocalStorageLoggerConfiguration';
import {LogBootstrapper} from './LogBootstrapper';
import {ILog} from './ILog';
const defaultBootstrapper = new LogBootstrapper();
export default function (config:ILocalStorageLoggerConfiguration) : ILog {
  return defaultBootstrapper.bootstrap(config);
}
