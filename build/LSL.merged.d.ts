declare module LSL {
    /**
     * Represents an entry in an application log.
     */
    interface ILogEntry {
        /**
         * The time the log entry was created.
         */
        time: Date;
        /**
         * The log message.
         */
        message: string;
        /**
         * The log level
         */
        level: LogLevel;
    }
}
declare module LSL {
    /**
     * Represents various levels of logging.
     */
    enum LogLevel {
        TRACE = 0,
        DEBUG = 1,
        INFO = 2,
        WARN = 3,
        ERROR = 4,
        FATAL = 5,
    }
}
declare module LSL {
    /**
     * Provides the default formatting for a log entry. E.g., "[2015-01-12 00:01:08] [INFO] Message blah blah..."
     */
    class DefaultFormatter implements ILogEntryFormatter {
        /**
         * Formats a log entry as [TIME] [LEVEL] MESSAGE
         * @param entry The log entry
         */
        format(entry: ILogEntry): string;
    }
}
declare module LSL {
    /**
     * Interface for formatting log entries for presentation.
     */
    interface ILogEntryFormatter {
        /**
         * Takes a log entry and returns a formatted string.
         * @param entry The log entry
         */
        format(entry: ILogEntry): string;
    }
}
declare module LSL {
    /**
     * Logger that logs to the console.
     */
    class ConsoleLogger implements ILogger {
        private _formatter;
        private _nextLogger;
        /**
         * Constructs a console logger.
         * @param _formatter The formatter used to format the entry for the console
         * @param _nextLogger The next logger in the "log chain"
         */
        constructor(_formatter: ILogEntryFormatter, _nextLogger: ILogger);
        /**
         * Logs an entry to the console.
         * @param entry The entry to log
         */
        log(entry: ILogEntry): void;
    }
}
declare module LSL {
    /**
     * Defines settings for a local storage logger instance.
     */
    interface ILocalStorageLoggerConfiguration {
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
declare module LSL {
    /**
     * Interface for logging individual log entries.
     */
    interface ILogger {
        /**
         * Logs a log entry.
         * @param entry The log entry
         */
        log(entry: ILogEntry): any;
    }
}
declare module LSL {
    /**
     * Logger that logs to a queue in local storage. Will overwrite oldest entries
     * when desired size is exceeded.
     */
    class LocalStorageLogger implements ILogger {
        private _nextLogger;
        private _queue;
        /**
         * Constructs a new local storage logger.
         * @param config The configuration defining the unique queue name, desired size etc.
         * @param _nextLogger The next logger in the "log chain"
         */
        constructor(config: ILocalStorageLoggerConfiguration, _nextLogger: ILogger);
        /**
         * Logs an entry to local storage.
         */
        log(entry: ILogEntry): void;
    }
}
declare module LSL {
    /**
     * A logger that doesn't actually do anything. Used for terminating a chain of loggers.
     */
    class NullLogger implements ILogger {
        /**
         * Constructs a no-op logger.
         */
        constructor();
        /**
         * No-op
         */
        log(entry: any): void;
    }
}
declare module LSL.LSQ {
    /**
     * This class keeps track of the start, end and size of the queue
     * stored in local storage. It allows nodes to be created and removed.
     */
    class Bookkeeper<T> {
        private _config;
        private _info;
        private _added;
        private _removed;
        /**
         * Creates a new Bookkeeper for a queue. It should be initialized using reset method.
         */
        constructor(_config: IQueueConfiguration);
        /**
         * Stores the current state of the queue to local storage.
         */
        store(): void;
        /**
         * Resets the start, end and size counts to what was last persisted to
         * local storage.
         */
        reset(): void;
        /**
         * Returns true if the queue has no elements.
         */
        isEmpty(): boolean;
        /**
         * Calculates the projected free space. This takes into account modifications.
         */
        remainingSpace(): number;
        /**
         * Creates a new node at the end of the queue.
         * @param value The value to store as an element of the queue.
         */
        createNextNode(value: T): Node<T>;
        /**
         * Removes and returns the first stored node. The consumer should check that there is a node to remove first.
         */
        deleteFirstNode(): Node<T>;
        /**
         * Iterates through the index values of the elements in the queue. These can be used to retrieve the elements.
         * @param callback The function that will be invoked once for each index value used in the queue.
         */
        iterateIndexValues(callback: (index: number) => void): void;
        /**
         * Returns the next index value (modulo MAX_SAFE_INTEGER).
         * @param index The previous index value.
         */
        _nextIndex(index: number): number;
    }
}
declare module LSL.LSQ {
    /**
     * This interfaces is serialized and stored in local storage.
     * It provides the high-level information needed to access
     * the first and last elements in the queue. It also keeps
     * track of the current size of all the elements stored in
     * local storage.
     */
    interface IBookkeepingInfo {
        sizeInBytes: number;
        startIndex: number;
        nextFreeIndex: number;
    }
}
declare module LSL.LSQ {
    /**
     * This describes the settings for the limited size queue.
     */
    interface IQueueConfiguration {
        /**
         * This defines the prefix the queue should use for all local storage entries.
         * There should be a unique prefix for each queue.
         */
        keyPrefix: string;
        /**
         * This defines a (rough) limit for the size of the queue in local storage.
         * Once this size is met, the oldest elements in the queue will be removed
         * to make space for newer elements.
         */
        maxSizeInBytes: number;
    }
}
declare module LSL.LSQ {
    /**
     * A limited-size queue that is persisted to local storage. Enqueuing
     * elements can remove the oldest elements in order to free up space.
     */
    class LimitedSizeQueue<T> {
        private _config;
        private _bookkeeper;
        /**
         * Creates/restores a queue based on the configuration provided.
         * @param _config The settings for the queue
         */
        constructor(_config: IQueueConfiguration);
        /**
         * Enqueues an item in the queue. Throws if the value is too big to fit in local storage
         * based on the maximum sized defined in the queue configuration. May also throw
         * if local storage is out of space or corrupted.
         */
        enqueue(value: T): void;
        /**
         * If the queue has at least 1 item, it removes and returns the oldest item from the queue.
         * Otherwise, it will return nothing.
         */
        dequeue(): T | void;
        /**
         * Returns true if the queue is empty.
         */
        isEmpty(): boolean;
        /**
         * Iterates (without removal) through all items stored in the queue.
         */
        iterate(callback: (item: T) => void): void;
    }
}
declare module LSL.LSQ {
    /**
     * Each node corresponds to an entry within the queue. This helps with
     * storage and removal from local storage.
     */
    class Node<T> {
        value: T;
        private _key;
        private _serializedNode;
        /**
         * Constructs a node representing an entry in the queue.
         * @param config The queue configuration. This is used to provide the prefix for the key.
         * @param index The index within the queue
         * @param value The value of the entry
         */
        constructor(config: IQueueConfiguration, index: number, value: T);
        /**
         * Returns an estimate of the size this will take up in local storage.
         */
        estimatedSize(): number;
        /**
         * Stores the serialized entry in local storage.
         */
        store(): void;
        /**
         * Removes the entry from local storage if it exists.
         */
        remove(): void;
        /**
         * Creates a key for an entry.
         * @param config The configuration containing the key prefix
         * @param index The index of the entry in the queue
         */
        static createKey(config: IQueueConfiguration, index: number): string;
        /**
         * Loads an entry from local storage and deserializes it. Returns the associated node.
         * @param config The configuration containing the key prefix
         * @param index The index of the entry in the queue
         */
        static fromLocalStorage<T>(config: IQueueConfiguration, index: number): Node<T>;
    }
}
