var LSL;
(function (LSL) {
    /**
     * Represents various levels of logging.
     */
    (function (LogLevel) {
        LogLevel[LogLevel["TRACE"] = 0] = "TRACE";
        LogLevel[LogLevel["DEBUG"] = 1] = "DEBUG";
        LogLevel[LogLevel["INFO"] = 2] = "INFO";
        LogLevel[LogLevel["WARN"] = 3] = "WARN";
        LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
        LogLevel[LogLevel["FATAL"] = 5] = "FATAL";
    })(LSL.LogLevel || (LSL.LogLevel = {}));
    var LogLevel = LSL.LogLevel;
})(LSL || (LSL = {}));
var LSL;
(function (LSL) {
    /**
     * Provides the default formatting for a log entry. E.g., "[2015-01-12 00:01:08] [INFO] Message blah blah..."
     */
    var DefaultFormatter = (function () {
        function DefaultFormatter() {
        }
        /**
         * Formats a log entry as [TIME] [LEVEL] MESSAGE
         * @param entry The log entry
         */
        DefaultFormatter.prototype.format = function (entry) {
            return "[" + entry.time + "] [" + entry.level + "] " + entry.message;
        };
        return DefaultFormatter;
    })();
    LSL.DefaultFormatter = DefaultFormatter;
})(LSL || (LSL = {}));
var LSL;
(function (LSL) {
    /**
     * Logger that logs to the console.
     */
    var ConsoleLogger = (function () {
        /**
         * Constructs a console logger.
         * @param _formatter The formatter used to format the entry for the console
         * @param _nextLogger The next logger in the "log chain"
         */
        function ConsoleLogger(_formatter, _nextLogger) {
            this._formatter = _formatter;
            this._nextLogger = _nextLogger;
        }
        /**
         * Logs an entry to the console.
         * @param entry The entry to log
         */
        ConsoleLogger.prototype.log = function (entry) {
            var formattedMessage = this._formatter.format(entry);
            console.log(entry);
            this._nextLogger.log(entry);
        };
        return ConsoleLogger;
    })();
    LSL.ConsoleLogger = ConsoleLogger;
})(LSL || (LSL = {}));
var LSL;
(function (LSL) {
    /**
     * Logger that logs to a queue in local storage. Will overwrite oldest entries
     * when desired size is exceeded.
     */
    var LocalStorageLogger = (function () {
        /**
         * Constructs a new local storage logger.
         * @param config The configuration defining the unique queue name, desired size etc.
         * @param _nextLogger The next logger in the "log chain"
         */
        function LocalStorageLogger(config, _nextLogger) {
            this._nextLogger = _nextLogger;
            this._queue = new LSL.LSQ.LimitedSizeQueue({
                keyPrefix: config.logName,
                maxSizeInBytes: config.maxLogSizeInBytes
            });
        }
        /**
         * Logs an entry to local storage.
         */
        LocalStorageLogger.prototype.log = function (entry) {
            try {
                var time = new Date();
                this._queue.enqueue(entry);
            }
            catch (error) {
                console.error('Failed to log to local storage.', error);
            }
            finally {
                this._nextLogger.log(entry);
            }
        };
        return LocalStorageLogger;
    })();
    LSL.LocalStorageLogger = LocalStorageLogger;
})(LSL || (LSL = {}));
var LSL;
(function (LSL) {
    /**
     * A logger that doesn't actually do anything. Used for terminating a chain of loggers.
     */
    var NullLogger = (function () {
        /**
         * Constructs a no-op logger.
         */
        function NullLogger() {
        }
        /**
         * No-op
         */
        NullLogger.prototype.log = function (entry) {
        };
        return NullLogger;
    })();
    LSL.NullLogger = NullLogger;
})(LSL || (LSL = {}));
var LSL;
(function (LSL) {
    var LSQ;
    (function (LSQ) {
        /**
         * This class keeps track of the start, end and size of the queue
         * stored in local storage. It allows nodes to be created and removed.
         */
        var Bookkeeper = (function () {
            /**
             * Creates a new Bookkeeper for a queue. It should be initialized using reset method.
             */
            function Bookkeeper(_config) {
                this._config = _config;
                this._added = [];
                this._removed = [];
            }
            /**
             * Stores the current state of the queue to local storage.
             */
            Bookkeeper.prototype.store = function () {
                try {
                    var serializedInfo = JSON.stringify(this._info);
                    // Ideally this would all be inside a transaction {
                    this._removed.forEach(function (node) { return node.remove(); });
                    this._added.forEach(function (node) { return node.store(); });
                    localStorage.setItem(this._config.keyPrefix, serializedInfo);
                }
                finally {
                    this._added = [];
                    this._removed = [];
                }
            };
            /**
             * Resets the start, end and size counts to what was last persisted to
             * local storage.
             */
            Bookkeeper.prototype.reset = function () {
                this._added = [];
                this._removed = [];
                var serializedInfo = localStorage.getItem(this._config.keyPrefix);
                if (serializedInfo === undefined) {
                    this._info = {
                        sizeInBytes: 0,
                        startIndex: 0,
                        nextFreeIndex: 0
                    };
                    this.store();
                }
                else {
                    this._info = JSON.parse(serializedInfo);
                }
            };
            /**
             * Returns true if the queue has no elements.
             */
            Bookkeeper.prototype.isEmpty = function () {
                return this._info.sizeInBytes > 0;
            };
            /**
             * Calculates the projected free space. This takes into account modifications.
             */
            Bookkeeper.prototype.remainingSpace = function () {
                return this._config.maxSizeInBytes - this._info.sizeInBytes;
            };
            /**
             * Creates a new node at the end of the queue.
             * @param value The value to store as an element of the queue.
             */
            Bookkeeper.prototype.createNextNode = function (value) {
                var node = new LSQ.Node(this._config, this._info.nextFreeIndex, value);
                this._info.nextFreeIndex = this._nextIndex(this._info.nextFreeIndex);
                this._info.sizeInBytes += node.estimatedSize();
                this._added.push(node);
                return node;
            };
            /**
             * Removes and returns the first stored node. The consumer should check that there is a node to remove first.
             */
            Bookkeeper.prototype.deleteFirstNode = function () {
                var node = LSQ.Node.fromLocalStorage(this._config, this._info.startIndex);
                this._info.startIndex = this._nextIndex(this._info.startIndex);
                this._info.sizeInBytes -= node.estimatedSize();
                this._removed.push(node);
                return node;
            };
            /**
             * Iterates through the index values of the elements in the queue. These can be used to retrieve the elements.
             * @param callback The function that will be invoked once for each index value used in the queue.
             */
            Bookkeeper.prototype.iterateIndexValues = function (callback) {
                for (var i = this._info.startIndex; i !== this._info.nextFreeIndex; i = this._nextIndex(i)) {
                    callback(i);
                }
            };
            /**
             * Returns the next index value (modulo MAX_SAFE_INTEGER).
             * @param index The previous index value.
             */
            Bookkeeper.prototype._nextIndex = function (index) {
                var MAX_SAFE_INTEGER = 9007199254740991;
                return (index + 1) % MAX_SAFE_INTEGER;
            };
            return Bookkeeper;
        })();
        LSQ.Bookkeeper = Bookkeeper;
    })(LSQ = LSL.LSQ || (LSL.LSQ = {}));
})(LSL || (LSL = {}));
var LSL;
(function (LSL) {
    var LSQ;
    (function (LSQ) {
        /**
         * A limited-size queue that is persisted to local storage. Enqueuing
         * elements can remove the oldest elements in order to free up space.
         */
        var LimitedSizeQueue = (function () {
            /**
             * Creates/restores a queue based on the configuration provided.
             * @param _config The settings for the queue
             */
            function LimitedSizeQueue(_config) {
                this._config = _config;
                this._bookkeeper = new LSQ.Bookkeeper(_config);
                this._bookkeeper.reset();
            }
            /**
             * Enqueues an item in the queue. Throws if the value is too big to fit in local storage
             * based on the maximum sized defined in the queue configuration. May also throw
             * if local storage is out of space or corrupted.
             */
            LimitedSizeQueue.prototype.enqueue = function (value) {
                var node = this._bookkeeper.createNextNode(value);
                var spaceRequirement = node.estimatedSize();
                var canFit = this._config.maxSizeInBytes >= spaceRequirement;
                if (!canFit) {
                    var message = 'LSL: Value is too big to store. Reverting to previous state.';
                    console.error(message);
                    this._bookkeeper.reset();
                    throw new Error(message);
                }
                var remainingSpace = this._bookkeeper.remainingSpace();
                if (remainingSpace >= 0) {
                    this._bookkeeper.store();
                }
                else {
                    while (this._bookkeeper.remainingSpace() < 0) {
                        this._bookkeeper.deleteFirstNode();
                    }
                    this._bookkeeper.store();
                }
            };
            /**
             * If the queue has at least 1 item, it removes and returns the oldest item from the queue.
             * Otherwise, it will return nothing.
             */
            LimitedSizeQueue.prototype.dequeue = function () {
                if (this.isEmpty())
                    return;
                var node = this._bookkeeper.deleteFirstNode();
                this._bookkeeper.store();
                return node.value;
            };
            /**
             * Returns true if the queue is empty.
             */
            LimitedSizeQueue.prototype.isEmpty = function () {
                return this._bookkeeper.isEmpty();
            };
            /**
             * Iterates (without removal) through all items stored in the queue.
             */
            LimitedSizeQueue.prototype.iterate = function (callback) {
                var _this = this;
                this._bookkeeper.iterateIndexValues(function (i) {
                    var node = LSQ.Node.fromLocalStorage(_this._config, i);
                    callback(node.value);
                });
            };
            return LimitedSizeQueue;
        })();
        LSQ.LimitedSizeQueue = LimitedSizeQueue;
    })(LSQ = LSL.LSQ || (LSL.LSQ = {}));
})(LSL || (LSL = {}));
var LSL;
(function (LSL) {
    var LSQ;
    (function (LSQ) {
        /**
         * Each node corresponds to an entry within the queue. This helps with
         * storage and removal from local storage.
         */
        var Node = (function () {
            /**
             * Constructs a node representing an entry in the queue.
             * @param config The queue configuration. This is used to provide the prefix for the key.
             * @param index The index within the queue
             * @param value The value of the entry
             */
            function Node(config, index, value) {
                this.value = value;
                this._key = Node.createKey(config, index);
                this._serializedNode = JSON.stringify(value);
            }
            /**
             * Returns an estimate of the size this will take up in local storage.
             */
            Node.prototype.estimatedSize = function () {
                return this._serializedNode.length + this._key.length;
            };
            /**
             * Stores the serialized entry in local storage.
             */
            Node.prototype.store = function () {
                localStorage.setItem(this._key, this._serializedNode);
            };
            /**
             * Removes the entry from local storage if it exists.
             */
            Node.prototype.remove = function () {
                localStorage.removeItem(this._key);
            };
            /**
             * Creates a key for an entry.
             * @param config The configuration containing the key prefix
             * @param index The index of the entry in the queue
             */
            Node.createKey = function (config, index) {
                return config.keyPrefix + "-item-" + index;
            };
            /**
             * Loads an entry from local storage and deserializes it. Returns the associated node.
             * @param config The configuration containing the key prefix
             * @param index The index of the entry in the queue
             */
            Node.fromLocalStorage = function (config, index) {
                var serializedNode = localStorage.getItem(Node.createKey(config, index));
                var value = JSON.parse(serializedNode);
                return new Node(config, index, value);
            };
            return Node;
        })();
        LSQ.Node = Node;
    })(LSQ = LSL.LSQ || (LSL.LSQ = {}));
})(LSL || (LSL = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9jb3JlL0xvZ0xldmVsLnRzIiwibGliL2Zvcm1hdHRlcnMvRGVmYXVsdEZvcm1hdHRlci50cyIsImxpYi9sb2dnZXJzL0NvbnNvbGVMb2dnZXIudHMiLCJsaWIvbG9nZ2Vycy9Mb2NhbFN0b3JhZ2VMb2dnZXIudHMiLCJsaWIvbG9nZ2Vycy9OdWxsTG9nZ2VyLnRzIiwibGliL3F1ZXVlL0Jvb2trZWVwZXIudHMiLCJsaWIvcXVldWUvTGltaXRlZFNpemVRdWV1ZS50cyIsImxpYi9xdWV1ZS9Ob2RlLnRzIl0sIm5hbWVzIjpbIkxTTCIsIkxTTC5Mb2dMZXZlbCIsIkxTTC5EZWZhdWx0Rm9ybWF0dGVyIiwiTFNMLkRlZmF1bHRGb3JtYXR0ZXIuY29uc3RydWN0b3IiLCJMU0wuRGVmYXVsdEZvcm1hdHRlci5mb3JtYXQiLCJMU0wuQ29uc29sZUxvZ2dlciIsIkxTTC5Db25zb2xlTG9nZ2VyLmNvbnN0cnVjdG9yIiwiTFNMLkNvbnNvbGVMb2dnZXIubG9nIiwiTFNMLkxvY2FsU3RvcmFnZUxvZ2dlciIsIkxTTC5Mb2NhbFN0b3JhZ2VMb2dnZXIuY29uc3RydWN0b3IiLCJMU0wuTG9jYWxTdG9yYWdlTG9nZ2VyLmxvZyIsIkxTTC5OdWxsTG9nZ2VyIiwiTFNMLk51bGxMb2dnZXIuY29uc3RydWN0b3IiLCJMU0wuTnVsbExvZ2dlci5sb2ciLCJMU0wuTFNRIiwiTFNMLkxTUS5Cb29ra2VlcGVyIiwiTFNMLkxTUS5Cb29ra2VlcGVyLmNvbnN0cnVjdG9yIiwiTFNMLkxTUS5Cb29ra2VlcGVyLnN0b3JlIiwiTFNMLkxTUS5Cb29ra2VlcGVyLnJlc2V0IiwiTFNMLkxTUS5Cb29ra2VlcGVyLmlzRW1wdHkiLCJMU0wuTFNRLkJvb2trZWVwZXIucmVtYWluaW5nU3BhY2UiLCJMU0wuTFNRLkJvb2trZWVwZXIuY3JlYXRlTmV4dE5vZGUiLCJMU0wuTFNRLkJvb2trZWVwZXIuZGVsZXRlRmlyc3ROb2RlIiwiTFNMLkxTUS5Cb29ra2VlcGVyLml0ZXJhdGVJbmRleFZhbHVlcyIsIkxTTC5MU1EuQm9va2tlZXBlci5fbmV4dEluZGV4IiwiTFNMLkxTUS5MaW1pdGVkU2l6ZVF1ZXVlIiwiTFNMLkxTUS5MaW1pdGVkU2l6ZVF1ZXVlLmNvbnN0cnVjdG9yIiwiTFNMLkxTUS5MaW1pdGVkU2l6ZVF1ZXVlLmVucXVldWUiLCJMU0wuTFNRLkxpbWl0ZWRTaXplUXVldWUuZGVxdWV1ZSIsIkxTTC5MU1EuTGltaXRlZFNpemVRdWV1ZS5pc0VtcHR5IiwiTFNMLkxTUS5MaW1pdGVkU2l6ZVF1ZXVlLml0ZXJhdGUiLCJMU0wuTFNRLk5vZGUiLCJMU0wuTFNRLk5vZGUuY29uc3RydWN0b3IiLCJMU0wuTFNRLk5vZGUuZXN0aW1hdGVkU2l6ZSIsIkxTTC5MU1EuTm9kZS5zdG9yZSIsIkxTTC5MU1EuTm9kZS5yZW1vdmUiLCJMU0wuTFNRLk5vZGUuY3JlYXRlS2V5IiwiTFNMLkxTUS5Ob2RlLmZyb21Mb2NhbFN0b3JhZ2UiXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sR0FBRyxDQVlUO0FBWkQsV0FBTyxHQUFHLEVBQUMsQ0FBQztJQUNWQTs7T0FFR0E7SUFDSEEsV0FBWUEsUUFBUUE7UUFDbEJDLHlDQUFLQSxDQUFBQTtRQUNMQSx5Q0FBS0EsQ0FBQUE7UUFDTEEsdUNBQUlBLENBQUFBO1FBQ0pBLHVDQUFJQSxDQUFBQTtRQUNKQSx5Q0FBS0EsQ0FBQUE7UUFDTEEseUNBQUtBLENBQUFBO0lBQ1BBLENBQUNBLEVBUFdELFlBQVFBLEtBQVJBLFlBQVFBLFFBT25CQTtJQVBEQSxJQUFZQSxRQUFRQSxHQUFSQSxZQU9YQSxDQUFBQTtBQUNIQSxDQUFDQSxFQVpNLEdBQUcsS0FBSCxHQUFHLFFBWVQ7QUNaRCxJQUFPLEdBQUcsQ0FhVDtBQWJELFdBQU8sR0FBRyxFQUFDLENBQUM7SUFDVkE7O09BRUdBO0lBQ0hBO1FBQUFFO1FBUUFDLENBQUNBO1FBUENEOzs7V0FHR0E7UUFDSEEsaUNBQU1BLEdBQU5BLFVBQU9BLEtBQWdCQTtZQUNyQkUsTUFBTUEsQ0FBQ0EsTUFBSUEsS0FBS0EsQ0FBQ0Es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QSxLQUFhQTtnQkFDbkVNLElBQU1BLGNBQWNBLEdBQUdBLFlBQVlBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO2dCQUMzRUEsSUFBTUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3pDQSxNQUFNQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFJQSxNQUFNQSxFQUFFQSxLQUFLQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUMzQ0EsQ0FBQ0E7WUFDSE4sV0FBQ0E7UUFBREEsQ0F2REFqQixBQXVEQ2lCLElBQUFqQjtRQXZEWUEsUUFBSUEsT0F1RGhCQSxDQUFBQTtJQUNIQSxDQUFDQSxFQTdEVWQsR0FBR0EsR0FBSEEsT0FBR0EsS0FBSEEsT0FBR0EsUUE2RGJBO0FBQURBLENBQUNBLEVBN0RNLEdBQUcsS0FBSCxHQUFHLFFBNkRUIiwiZmlsZSI6IkxTTC5tZXJnZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgTFNMIHtcbiAgLyoqXG4gICAqIFJlcHJlc2VudHMgdmFyaW91cyBsZXZlbHMgb2YgbG9nZ2luZy5cbiAgICovXG4gIGV4cG9ydCBlbnVtIExvZ0xldmVsIHtcbiAgICBUUkFDRSxcbiAgICBERUJVRyxcbiAgICBJTkZPLFxuICAgIFdBUk4sXG4gICAgRVJST1IsXG4gICAgRkFUQUxcbiAgfVxufVxuIiwibW9kdWxlIExTTCB7XG4gIC8qKlxuICAgKiBQcm92aWRlcyB0aGUgZGVmYXVsdCBmb3JtYXR0aW5nIGZvciBhIGxvZyBlbnRyeS4gRS5nLiwgXCJbMjAxNS0wMS0xMiAwMDowMTowOF0gW0lORk9dIE1lc3NhZ2UgYmxhaCBibGFoLi4uXCJcbiAgICovXG4gIGV4cG9ydCBjbGFzcyBEZWZhdWx0Rm9ybWF0dGVyIGltcGxlbWVudHMgSUxvZ0VudHJ5Rm9ybWF0dGVyIHtcbiAgICAvKipcbiAgICAgKiBGb3JtYXRzIGEgbG9nIGVudHJ5IGFzIFtUSU1FXSBbTEVWRUxdIE1FU1NBR0VcbiAgICAgKiBAcGFyYW0gZW50cnkgVGhlIGxvZyBlbnRyeVxuICAgICAqL1xuICAgIGZvcm1hdChlbnRyeTogSUxvZ0VudHJ5KSA6IHN0cmluZ3tcbiAgICAgIHJldHVybiBgWyR7ZW50cnkudGltZX1dIFske2VudHJ5LmxldmVsfV0gJHtlbnRyeS5tZXNzYWdlfWA7XG4gICAgfVxuICB9XG59XG4iLCJtb2R1bGUgTFNMIHtcbiAgLyoqXG4gICAqIExvZ2dlciB0aGF0IGxvZ3MgdG8gdGhlIGNvbnNvbGUuXG4gICAqL1xuICBleHBvcnQgY2xhc3MgQ29uc29sZUxvZ2dlciBpbXBsZW1lbnRzIElMb2dnZXIge1xuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdHMgYSBjb25zb2xlIGxvZ2dlci5cbiAgICAgKiBAcGFyYW0gX2Zvcm1hdHRlciBUaGUgZm9ybWF0dGVyIHVzZWQgdG8gZm9ybWF0IHRoZSBlbnRyeSBmb3IgdGhlIGNvbnNvbGVcbiAgICAgKiBAcGFyYW0gX25leHRMb2dnZXIgVGhlIG5leHQgbG9nZ2VyIGluIHRoZSBcImxvZyBjaGFpblwiXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfZm9ybWF0dGVyOiBJTG9nRW50cnlGb3JtYXR0ZXIsIHByaXZhdGUgX25leHRMb2dnZXI6IElMb2dnZXIpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMb2dzIGFuIGVudHJ5IHRvIHRoZSBjb25zb2xlLlxuICAgICAqIEBwYXJhbSBlbnRyeSBUaGUgZW50cnkgdG8gbG9nXG4gICAgICovXG4gICAgbG9nKGVudHJ5OiBJTG9nRW50cnkpIHtcbiAgICAgIGNvbnN0IGZvcm1hdHRlZE1lc3NhZ2UgPSB0aGlzLl9mb3JtYXR0ZXIuZm9ybWF0KGVudHJ5KTtcbiAgICAgIGNvbnNvbGUubG9nKGVudHJ5KTtcbiAgICAgIHRoaXMuX25leHRMb2dnZXIubG9nKGVudHJ5KTtcbiAgICB9XG4gIH1cbn1cbiIsIm1vZHVsZSBMU0wge1xuICAvKipcbiAgICogTG9nZ2VyIHRoYXQgbG9ncyB0byBhIHF1ZXVlIGluIGxvY2FsIHN0b3JhZ2UuIFdpbGwgb3ZlcndyaXRlIG9sZGVzdCBlbnRyaWVzXG4gICAqIHdoZW4gZGVzaXJlZCBzaXplIGlzIGV4Y2VlZGVkLlxuICAgKi9cbiAgZXhwb3J0IGNsYXNzIExvY2FsU3RvcmFnZUxvZ2dlciBpbXBsZW1lbnRzIElMb2dnZXIge1xuICAgIHByaXZhdGUgX3F1ZXVlOiBMU1EuTGltaXRlZFNpemVRdWV1ZTxJTG9nRW50cnk+O1xuXG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0cyBhIG5ldyBsb2NhbCBzdG9yYWdlIGxvZ2dlci5cbiAgICAgKiBAcGFyYW0gY29uZmlnIFRoZSBjb25maWd1cmF0aW9uIGRlZmluaW5nIHRoZSB1bmlxdWUgcXVldWUgbmFtZSwgZGVzaXJlZCBzaXplIGV0Yy5cbiAgICAgKiBAcGFyYW0gX25leHRMb2dnZXIgVGhlIG5leHQgbG9nZ2VyIGluIHRoZSBcImxvZyBjaGFpblwiXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoY29uZmlnOiBJTG9jYWxTdG9yYWdlTG9nZ2VyQ29uZmlndXJhdGlvbiwgcHJpdmF0ZSBfbmV4dExvZ2dlcjogSUxvZ2dlcikge1xuICAgICAgdGhpcy5fcXVldWUgPSBuZXcgTFNRLkxpbWl0ZWRTaXplUXVldWU8SUxvZ0VudHJ5Pih7XG4gICAgICAgIGtleVByZWZpeDogY29uZmlnLmxvZ05hbWUsXG4gICAgICAgIG1heFNpemVJbkJ5dGVzOiBjb25maWcubWF4TG9nU2l6ZUluQnl0ZXNcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvZ3MgYW4gZW50cnkgdG8gbG9jYWwgc3RvcmFnZS5cbiAgICAgKi9cbiAgICBsb2coZW50cnk6IElMb2dFbnRyeSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdGltZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHRoaXMuX3F1ZXVlLmVucXVldWUoZW50cnkpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGxvZyB0byBsb2NhbCBzdG9yYWdlLicsIGVycm9yKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMuX25leHRMb2dnZXIubG9nKGVudHJ5KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsIm1vZHVsZSBMU0wge1xuICAvKipcbiAgICogQSBsb2dnZXIgdGhhdCBkb2Vzbid0IGFjdHVhbGx5IGRvIGFueXRoaW5nLiBVc2VkIGZvciB0ZXJtaW5hdGluZyBhIGNoYWluIG9mIGxvZ2dlcnMuXG4gICAqL1xuICBleHBvcnQgY2xhc3MgTnVsbExvZ2dlciBpbXBsZW1lbnRzIElMb2dnZXIge1xuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdHMgYSBuby1vcCBsb2dnZXIuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7IH1cblxuICAgIC8qKlxuICAgICAqIE5vLW9wXG4gICAgICovXG4gICAgbG9nKGVudHJ5KSB7XG4gICAgfVxuICB9XG59XG4iLCJtb2R1bGUgTFNMLkxTUSB7XG4gIC8qKlxuICAgKiBUaGlzIGNsYXNzIGtlZXBzIHRyYWNrIG9mIHRoZSBzdGFydCwgZW5kIGFuZCBzaXplIG9mIHRoZSBxdWV1ZVxuICAgKiBzdG9yZWQgaW4gbG9jYWwgc3RvcmFnZS4gSXQgYWxsb3dzIG5vZGVzIHRvIGJlIGNyZWF0ZWQgYW5kIHJlbW92ZWQuXG4gICAqLyBcbiAgZXhwb3J0IGNsYXNzIEJvb2trZWVwZXI8VD4ge1xuICAgIHByaXZhdGUgX2luZm86IElCb29ra2VlcGluZ0luZm87IFxuICAgIHByaXZhdGUgX2FkZGVkOiBBcnJheTxOb2RlPFQ+PjtcbiAgICBwcml2YXRlIF9yZW1vdmVkOiBBcnJheTxOb2RlPFQ+PjtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgQm9va2tlZXBlciBmb3IgYSBxdWV1ZS4gSXQgc2hvdWxkIGJlIGluaXRpYWxpemVkIHVzaW5nIHJlc2V0IG1ldGhvZC5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jb25maWc6IElRdWV1ZUNvbmZpZ3VyYXRpb24pIHtcbiAgICAgIHRoaXMuX2FkZGVkID0gW107XG4gICAgICB0aGlzLl9yZW1vdmVkID0gW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RvcmVzIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBxdWV1ZSB0byBsb2NhbCBzdG9yYWdlLlxuICAgICAqL1xuICAgIHN0b3JlKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgc2VyaWFsaXplZEluZm8gPSBKU09OLnN0cmluZ2lmeSh0aGlzLl9pbmZvKTtcbiAgICAgICAgLy8gSWRlYWxseSB0aGlzIHdvdWxkIGFsbCBiZSBpbnNpZGUgYSB0cmFuc2FjdGlvbiB7XG4gICAgICAgIHRoaXMuX3JlbW92ZWQuZm9yRWFjaChub2RlID0+IG5vZGUucmVtb3ZlKCkpO1xuICAgICAgICB0aGlzLl9hZGRlZC5mb3JFYWNoKG5vZGUgPT4gbm9kZS5zdG9yZSgpKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5fY29uZmlnLmtleVByZWZpeCwgc2VyaWFsaXplZEluZm8pO1xuICAgICAgICAvLyB9XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLl9hZGRlZCA9IFtdO1xuICAgICAgICB0aGlzLl9yZW1vdmVkID0gW107XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXRzIHRoZSBzdGFydCwgZW5kIGFuZCBzaXplIGNvdW50cyB0byB3aGF0IHdhcyBsYXN0IHBlcnNpc3RlZCB0b1xuICAgICAqIGxvY2FsIHN0b3JhZ2UuXG4gICAgICovXG4gICAgcmVzZXQoKSB7XG4gICAgICB0aGlzLl9hZGRlZCA9IFtdO1xuICAgICAgdGhpcy5fcmVtb3ZlZCA9IFtdO1xuICAgICAgY29uc3Qgc2VyaWFsaXplZEluZm8gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLl9jb25maWcua2V5UHJlZml4KTtcbiAgICAgIGlmIChzZXJpYWxpemVkSW5mbyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2luZm8gPSB7XG4gICAgICAgICAgc2l6ZUluQnl0ZXM6IDAsXG4gICAgICAgICAgc3RhcnRJbmRleDogMCxcbiAgICAgICAgICBuZXh0RnJlZUluZGV4OiAwXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc3RvcmUoKTsgXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9pbmZvID0gSlNPTi5wYXJzZShzZXJpYWxpemVkSW5mbyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBxdWV1ZSBoYXMgbm8gZWxlbWVudHMuXG4gICAgICovXG4gICAgaXNFbXB0eSgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pbmZvLnNpemVJbkJ5dGVzID4gMDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSBwcm9qZWN0ZWQgZnJlZSBzcGFjZS4gVGhpcyB0YWtlcyBpbnRvIGFjY291bnQgbW9kaWZpY2F0aW9ucy5cbiAgICAgKi9cbiAgICByZW1haW5pbmdTcGFjZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jb25maWcubWF4U2l6ZUluQnl0ZXMgLSB0aGlzLl9pbmZvLnNpemVJbkJ5dGVzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgbm9kZSBhdCB0aGUgZW5kIG9mIHRoZSBxdWV1ZS5cbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHN0b3JlIGFzIGFuIGVsZW1lbnQgb2YgdGhlIHF1ZXVlLlxuICAgICAqL1xuICAgIGNyZWF0ZU5leHROb2RlKHZhbHVlOiBUKSB7XG4gICAgICBjb25zdCBub2RlID0gbmV3IE5vZGU8VD4odGhpcy5fY29uZmlnLCB0aGlzLl9pbmZvLm5leHRGcmVlSW5kZXgsIHZhbHVlKTtcbiAgICAgIHRoaXMuX2luZm8ubmV4dEZyZWVJbmRleCA9IHRoaXMuX25leHRJbmRleCh0aGlzLl9pbmZvLm5leHRGcmVlSW5kZXgpO1xuICAgICAgdGhpcy5faW5mby5zaXplSW5CeXRlcyArPSBub2RlLmVzdGltYXRlZFNpemUoKTtcbiAgICAgIHRoaXMuX2FkZGVkLnB1c2gobm9kZSk7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGFuZCByZXR1cm5zIHRoZSBmaXJzdCBzdG9yZWQgbm9kZS4gVGhlIGNvbnN1bWVyIHNob3VsZCBjaGVjayB0aGF0IHRoZXJlIGlzIGEgbm9kZSB0byByZW1vdmUgZmlyc3QuXG4gICAgICovXG4gICAgZGVsZXRlRmlyc3ROb2RlKCkge1xuICAgICAgY29uc3Qgbm9kZSA9IE5vZGUuZnJvbUxvY2FsU3RvcmFnZTxUPih0aGlzLl9jb25maWcsIHRoaXMuX2luZm8uc3RhcnRJbmRleCk7XG4gICAgICB0aGlzLl9pbmZvLnN0YXJ0SW5kZXggPSB0aGlzLl9uZXh0SW5kZXgodGhpcy5faW5mby5zdGFydEluZGV4KTtcbiAgICAgIHRoaXMuX2luZm8uc2l6ZUluQnl0ZXMgLT0gbm9kZS5lc3RpbWF0ZWRTaXplKCk7XG4gICAgICB0aGlzLl9yZW1vdmVkLnB1c2gobm9kZSk7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJdGVyYXRlcyB0aHJvdWdoIHRoZSBpbmRleCB2YWx1ZXMgb2YgdGhlIGVsZW1lbnRzIGluIHRoZSBxdWV1ZS4gVGhlc2UgY2FuIGJlIHVzZWQgdG8gcmV0cmlldmUgdGhlIGVsZW1lbnRzLlxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGludm9rZWQgb25jZSBmb3IgZWFjaCBpbmRleCB2YWx1ZSB1c2VkIGluIHRoZSBxdWV1ZS5cbiAgICAgKi9cbiAgICBpdGVyYXRlSW5kZXhWYWx1ZXMoY2FsbGJhY2s6IChpbmRleDpudW1iZXIpID0+IHZvaWQpIHtcbiAgICAgIGZvcihsZXQgaSA9IHRoaXMuX2luZm8uc3RhcnRJbmRleDsgaSAhPT0gdGhpcy5faW5mby5uZXh0RnJlZUluZGV4OyBpID0gdGhpcy5fbmV4dEluZGV4KGkpKSB7XG4gICAgICAgIGNhbGxiYWNrKGkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG5leHQgaW5kZXggdmFsdWUgKG1vZHVsbyBNQVhfU0FGRV9JTlRFR0VSKS5cbiAgICAgKiBAcGFyYW0gaW5kZXggVGhlIHByZXZpb3VzIGluZGV4IHZhbHVlLlxuICAgICAqL1xuICAgIF9uZXh0SW5kZXgoaW5kZXg6IG51bWJlcikge1xuICAgICAgY29uc3QgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG4gICAgICByZXR1cm4gKGluZGV4ICsgMSkgJSBNQVhfU0FGRV9JTlRFR0VSO1xuICAgIH1cbiAgfVxufVxuIiwibW9kdWxlIExTTC5MU1Ege1xuICAvKipcbiAgICogQSBsaW1pdGVkLXNpemUgcXVldWUgdGhhdCBpcyBwZXJzaXN0ZWQgdG8gbG9jYWwgc3RvcmFnZS4gRW5xdWV1aW5nXG4gICAqIGVsZW1lbnRzIGNhbiByZW1vdmUgdGhlIG9sZGVzdCBlbGVtZW50cyBpbiBvcmRlciB0byBmcmVlIHVwIHNwYWNlLlxuICAgKi9cbiAgZXhwb3J0IGNsYXNzIExpbWl0ZWRTaXplUXVldWU8VD4ge1xuICAgIHByaXZhdGUgX2Jvb2trZWVwZXI6IEJvb2trZWVwZXI8VD47XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzL3Jlc3RvcmVzIGEgcXVldWUgYmFzZWQgb24gdGhlIGNvbmZpZ3VyYXRpb24gcHJvdmlkZWQuXG4gICAgICogQHBhcmFtIF9jb25maWcgVGhlIHNldHRpbmdzIGZvciB0aGUgcXVldWVcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jb25maWc6IElRdWV1ZUNvbmZpZ3VyYXRpb24pIHtcbiAgICAgIHRoaXMuX2Jvb2trZWVwZXIgPSBuZXcgQm9va2tlZXBlcjxUPihfY29uZmlnKTtcbiAgICAgIHRoaXMuX2Jvb2trZWVwZXIucmVzZXQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFbnF1ZXVlcyBhbiBpdGVtIGluIHRoZSBxdWV1ZS4gVGhyb3dzIGlmIHRoZSB2YWx1ZSBpcyB0b28gYmlnIHRvIGZpdCBpbiBsb2NhbCBzdG9yYWdlXG4gICAgICogYmFzZWQgb24gdGhlIG1heGltdW0gc2l6ZWQgZGVmaW5lZCBpbiB0aGUgcXVldWUgY29uZmlndXJhdGlvbi4gTWF5IGFsc28gdGhyb3dcbiAgICAgKiBpZiBsb2NhbCBzdG9yYWdlIGlzIG91dCBvZiBzcGFjZSBvciBjb3JydXB0ZWQuXG4gICAgICovXG4gICAgZW5xdWV1ZSh2YWx1ZTogVCkgOiB2b2lkIHtcbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLl9ib29ra2VlcGVyLmNyZWF0ZU5leHROb2RlKHZhbHVlKTtcbiAgICAgIGNvbnN0IHNwYWNlUmVxdWlyZW1lbnQgPSBub2RlLmVzdGltYXRlZFNpemUoKTtcbiAgICAgIGNvbnN0IGNhbkZpdCA9IHRoaXMuX2NvbmZpZy5tYXhTaXplSW5CeXRlcyA+PSBzcGFjZVJlcXVpcmVtZW50O1xuICAgICAgaWYgKCFjYW5GaXQpIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9ICdMU0w6IFZhbHVlIGlzIHRvbyBiaWcgdG8gc3RvcmUuIFJldmVydGluZyB0byBwcmV2aW91cyBzdGF0ZS4nO1xuICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLl9ib29ra2VlcGVyLnJlc2V0KCk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJlbWFpbmluZ1NwYWNlID0gdGhpcy5fYm9va2tlZXBlci5yZW1haW5pbmdTcGFjZSgpO1xuICAgICAgaWYgKHJlbWFpbmluZ1NwYWNlID49IDApIHtcbiAgICAgICAgdGhpcy5fYm9va2tlZXBlci5zdG9yZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2hpbGUgKHRoaXMuX2Jvb2trZWVwZXIucmVtYWluaW5nU3BhY2UoKSA8IDApIHtcbiAgICAgICAgICB0aGlzLl9ib29ra2VlcGVyLmRlbGV0ZUZpcnN0Tm9kZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2Jvb2trZWVwZXIuc3RvcmUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUgcXVldWUgaGFzIGF0IGxlYXN0IDEgaXRlbSwgaXQgcmVtb3ZlcyBhbmQgcmV0dXJucyB0aGUgb2xkZXN0IGl0ZW0gZnJvbSB0aGUgcXVldWUuXG4gICAgICogT3RoZXJ3aXNlLCBpdCB3aWxsIHJldHVybiBub3RoaW5nLlxuICAgICAqL1xuICAgIGRlcXVldWUoKSA6IFQgfCB2b2lkIHtcbiAgICAgIGlmICh0aGlzLmlzRW1wdHkoKSkgcmV0dXJuO1xuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuX2Jvb2trZWVwZXIuZGVsZXRlRmlyc3ROb2RlKCk7XG4gICAgICB0aGlzLl9ib29ra2VlcGVyLnN0b3JlKCk7XG4gICAgICByZXR1cm4gbm9kZS52YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHF1ZXVlIGlzIGVtcHR5LlxuICAgICAqL1xuICAgIGlzRW1wdHkoKSA6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuX2Jvb2trZWVwZXIuaXNFbXB0eSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEl0ZXJhdGVzICh3aXRob3V0IHJlbW92YWwpIHRocm91Z2ggYWxsIGl0ZW1zIHN0b3JlZCBpbiB0aGUgcXVldWUuXG4gICAgICovXG4gICAgaXRlcmF0ZShjYWxsYmFjazogKGl0ZW06IFQpID0+IHZvaWQpIHtcbiAgICAgIHRoaXMuX2Jvb2trZWVwZXIuaXRlcmF0ZUluZGV4VmFsdWVzKGkgPT4ge1xuICAgICAgICBjb25zdCBub2RlID0gTm9kZS5mcm9tTG9jYWxTdG9yYWdlPFQ+KHRoaXMuX2NvbmZpZywgaSlcbiAgICAgICAgY2FsbGJhY2sobm9kZS52YWx1ZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiIsIm1vZHVsZSBMU0wuTFNRIHtcbiAgLyoqXG4gICAqIEVhY2ggbm9kZSBjb3JyZXNwb25kcyB0byBhbiBlbnRyeSB3aXRoaW4gdGhlIHF1ZXVlLiBUaGlzIGhlbHBzIHdpdGhcbiAgICogc3RvcmFnZSBhbmQgcmVtb3ZhbCBmcm9tIGxvY2FsIHN0b3JhZ2UuXG4gICAqL1xuICBleHBvcnQgY2xhc3MgTm9kZTxUPiB7XG4gICAgcHJpdmF0ZSBfa2V5OiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfc2VyaWFsaXplZE5vZGU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdHMgYSBub2RlIHJlcHJlc2VudGluZyBhbiBlbnRyeSBpbiB0aGUgcXVldWUuXG4gICAgICogQHBhcmFtIGNvbmZpZyBUaGUgcXVldWUgY29uZmlndXJhdGlvbi4gVGhpcyBpcyB1c2VkIHRvIHByb3ZpZGUgdGhlIHByZWZpeCBmb3IgdGhlIGtleS5cbiAgICAgKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IHdpdGhpbiB0aGUgcXVldWVcbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIG9mIHRoZSBlbnRyeVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogSVF1ZXVlQ29uZmlndXJhdGlvbiwgaW5kZXg6IG51bWJlciwgcHVibGljIHZhbHVlOiBUKSB7XG4gICAgICB0aGlzLl9rZXkgPSBOb2RlLmNyZWF0ZUtleShjb25maWcsIGluZGV4KTtcbiAgICAgIHRoaXMuX3NlcmlhbGl6ZWROb2RlID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gZXN0aW1hdGUgb2YgdGhlIHNpemUgdGhpcyB3aWxsIHRha2UgdXAgaW4gbG9jYWwgc3RvcmFnZS5cbiAgICAgKi9cbiAgICBlc3RpbWF0ZWRTaXplKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3NlcmlhbGl6ZWROb2RlLmxlbmd0aCArIHRoaXMuX2tleS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RvcmVzIHRoZSBzZXJpYWxpemVkIGVudHJ5IGluIGxvY2FsIHN0b3JhZ2UuXG4gICAgICovXG4gICAgc3RvcmUoKSB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLl9rZXksIHRoaXMuX3NlcmlhbGl6ZWROb2RlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIHRoZSBlbnRyeSBmcm9tIGxvY2FsIHN0b3JhZ2UgaWYgaXQgZXhpc3RzLlxuICAgICAqL1xuICAgIHJlbW92ZSgpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMuX2tleSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGtleSBmb3IgYW4gZW50cnkuXG4gICAgICogQHBhcmFtIGNvbmZpZyBUaGUgY29uZmlndXJhdGlvbiBjb250YWluaW5nIHRoZSBrZXkgcHJlZml4XG4gICAgICogQHBhcmFtIGluZGV4IFRoZSBpbmRleCBvZiB0aGUgZW50cnkgaW4gdGhlIHF1ZXVlXG4gICAgICovXG4gICAgc3RhdGljIGNyZWF0ZUtleShjb25maWc6IElRdWV1ZUNvbmZpZ3VyYXRpb24sIGluZGV4OiBudW1iZXIpIHtcbiAgICAgIHJldHVybiBgJHtjb25maWcua2V5UHJlZml4fS1pdGVtLSR7aW5kZXh9YDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMb2FkcyBhbiBlbnRyeSBmcm9tIGxvY2FsIHN0b3JhZ2UgYW5kIGRlc2VyaWFsaXplcyBpdC4gUmV0dXJucyB0aGUgYXNzb2NpYXRlZCBub2RlLlxuICAgICAqIEBwYXJhbSBjb25maWcgVGhlIGNvbmZpZ3VyYXRpb24gY29udGFpbmluZyB0aGUga2V5IHByZWZpeFxuICAgICAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIGVudHJ5IGluIHRoZSBxdWV1ZVxuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tTG9jYWxTdG9yYWdlPFQ+KGNvbmZpZzogSVF1ZXVlQ29uZmlndXJhdGlvbiwgaW5kZXg6IG51bWJlcikge1xuICAgICAgY29uc3Qgc2VyaWFsaXplZE5vZGUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShOb2RlLmNyZWF0ZUtleShjb25maWcsIGluZGV4KSk7XG4gICAgICBjb25zdCB2YWx1ZSA9IEpTT04ucGFyc2Uoc2VyaWFsaXplZE5vZGUpO1xuICAgICAgcmV0dXJuIG5ldyBOb2RlPFQ+KGNvbmZpZywgaW5kZXgsIHZhbHVlKTtcbiAgICB9XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
