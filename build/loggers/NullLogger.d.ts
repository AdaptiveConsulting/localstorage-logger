import { ILogger } from './ILogger';
/**
 * A logger that doesn't actually do anything. Used for terminating a chain of loggers.
 */
export declare class NullLogger implements ILogger {
    /**
     * No-op
     */
    log(entry: any): void;
}
