import { ILogger } from './ILogger';
/**
 * A logger that doesn't actually do anything. Used for terminating a chain of loggers.
 */
export declare class NullLogger implements ILogger {
    /**
     * Constructs a no-op logger.
     */
    constructor();
    /**
     * No-op
     */
    log(level: any, message: any): void;
}
