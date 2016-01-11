// Generated by dts-bundle v0.3.0

declare module 'localstorage-logger' {
    export { LogLevel } from '__localstorage-logger/loggers/LogLevel';
    export { ILogger } from '__localstorage-logger/loggers/ILogger';
    export { NullLogger } from '__localstorage-logger/loggers/NullLogger';
    export { ILocalStorageLoggerConfiguration } from '__localstorage-logger/loggers/ILocalStorageLoggerConfiguration';
    export { LocalStorageLogger } from '__localstorage-logger/loggers/LocalStorageLogger';
}

declare module '__localstorage-logger/loggers/LogLevel' {
    /**
      * Represents various levels of logging.
      */
    export enum LogLevel {
        TRACE = 0,
        DEBUG = 1,
        INFO = 2,
        WARN = 3,
        ERROR = 4,
        FATAL = 5,
    }
}

declare module '__localstorage-logger/loggers/ILogger' {
    import { LogLevel } from '__localstorage-logger/loggers/LogLevel';
    export interface ILogger {
        log(level: LogLevel, message: string): any;
    }
}

declare module '__localstorage-logger/loggers/NullLogger' {
    import { ILogger } from '__localstorage-logger/loggers/ILogger';
    /**
        * A logger that doesn't actually do anything. Used for terminating a chain of loggers.
        */
    export class NullLogger implements ILogger {
            /**
                * Constructs a no-op logger.
                */
            constructor();
            /**
                * No-op
                */
            log(level: any, message: any): void;
    }
}

declare module '__localstorage-logger/loggers/ILocalStorageLoggerConfiguration' {
    /**
        * Defines settings for a local storage logger instance.
        */
    export interface ILocalStorageLoggerConfiguration {
            /**
                * The name of the log. Must be unique for each instance.
                */
            logName: string;
            /**
                * The approximate maximum size of the log in bytes.
                */
            maxLogSizeInBytes: number;
    }
}

declare module '__localstorage-logger/loggers/LocalStorageLogger' {
    import { ILocalStorageLoggerConfiguration } from '__localstorage-logger/loggers/ILocalStorageLoggerConfiguration';
    import { LogLevel } from '__localstorage-logger/loggers/LogLevel';
    import { ILogger } from '__localstorage-logger/loggers/ILogger';
    export class LocalStorageLogger implements ILogger {
        constructor(config: ILocalStorageLoggerConfiguration, _nextLogger: ILogger);
        log(level: LogLevel, message: string): void;
    }
}
