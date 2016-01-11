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
