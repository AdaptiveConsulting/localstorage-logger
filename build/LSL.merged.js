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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvTG9nTGV2ZWwudHMiLCJmb3JtYXR0ZXJzL0RlZmF1bHRGb3JtYXR0ZXIudHMiLCJsb2dnZXJzL0NvbnNvbGVMb2dnZXIudHMiLCJsb2dnZXJzL0xvY2FsU3RvcmFnZUxvZ2dlci50cyIsImxvZ2dlcnMvTnVsbExvZ2dlci50cyIsInF1ZXVlL0Jvb2trZWVwZXIudHMiLCJxdWV1ZS9MaW1pdGVkU2l6ZVF1ZXVlLnRzIiwicXVldWUvTm9kZS50cyJdLCJuYW1lcyI6WyJMU0wiLCJMU0wuTG9nTGV2ZWwiLCJMU0wuRGVmYXVsdEZvcm1hdHRlciIsIkxTTC5EZWZhdWx0Rm9ybWF0dGVyLmNvbnN0cnVjdG9yIiwiTFNMLkRlZmF1bHRGb3JtYXR0ZXIuZm9ybWF0IiwiTFNMLkNvbnNvbGVMb2dnZXIiLCJMU0wuQ29uc29sZUxvZ2dlci5jb25zdHJ1Y3RvciIsIkxTTC5Db25zb2xlTG9nZ2VyLmxvZyIsIkxTTC5Mb2NhbFN0b3JhZ2VMb2dnZXIiLCJMU0wuTG9jYWxTdG9yYWdlTG9nZ2VyLmNvbnN0cnVjdG9yIiwiTFNMLkxvY2FsU3RvcmFnZUxvZ2dlci5sb2ciLCJMU0wuTnVsbExvZ2dlciIsIkxTTC5OdWxsTG9nZ2VyLmNvbnN0cnVjdG9yIiwiTFNMLk51bGxMb2dnZXIubG9nIiwiTFNMLkxTUSIsIkxTTC5MU1EuQm9va2tlZXBlciIsIkxTTC5MU1EuQm9va2tlZXBlci5jb25zdHJ1Y3RvciIsIkxTTC5MU1EuQm9va2tlZXBlci5zdG9yZSIsIkxTTC5MU1EuQm9va2tlZXBlci5yZXNldCIsIkxTTC5MU1EuQm9va2tlZXBlci5pc0VtcHR5IiwiTFNMLkxTUS5Cb29ra2VlcGVyLnJlbWFpbmluZ1NwYWNlIiwiTFNMLkxTUS5Cb29ra2VlcGVyLmNyZWF0ZU5leHROb2RlIiwiTFNMLkxTUS5Cb29ra2VlcGVyLmRlbGV0ZUZpcnN0Tm9kZSIsIkxTTC5MU1EuQm9va2tlZXBlci5pdGVyYXRlSW5kZXhWYWx1ZXMiLCJMU0wuTFNRLkJvb2trZWVwZXIuX25leHRJbmRleCIsIkxTTC5MU1EuTGltaXRlZFNpemVRdWV1ZSIsIkxTTC5MU1EuTGltaXRlZFNpemVRdWV1ZS5jb25zdHJ1Y3RvciIsIkxTTC5MU1EuTGltaXRlZFNpemVRdWV1ZS5lbnF1ZXVlIiwiTFNMLkxTUS5MaW1pdGVkU2l6ZVF1ZXVlLmRlcXVldWUiLCJMU0wuTFNRLkxpbWl0ZWRTaXplUXVldWUuaXNFbXB0eSIsIkxTTC5MU1EuTGltaXRlZFNpemVRdWV1ZS5pdGVyYXRlIiwiTFNMLkxTUS5Ob2RlIiwiTFNMLkxTUS5Ob2RlLmNvbnN0cnVjdG9yIiwiTFNMLkxTUS5Ob2RlLmVzdGltYXRlZFNpemUiLCJMU0wuTFNRLk5vZGUuc3RvcmUiLCJMU0wuTFNRLk5vZGUucmVtb3ZlIiwiTFNMLkxTUS5Ob2RlLmNyZWF0ZUtleSIsIkxTTC5MU1EuTm9kZS5mcm9tTG9jYWxTdG9yYWdlIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLEdBQUcsQ0FZVDtBQVpELFdBQU8sR0FBRyxFQUFDLENBQUM7SUFDVkE7O09BRUdBO0lBQ0hBLFdBQVlBLFFBQVFBO1FBQ2xCQyx5Q0FBS0EsQ0FBQUE7UUFDTEEseUNBQUtBLENBQUFBO1FBQ0xBLHVDQUFJQSxDQUFBQTtRQUNKQSx1Q0FBSUEsQ0FBQUE7UUFDSkEseUNBQUtBLENBQUFBO1FBQ0xBLHlDQUFLQSxDQUFBQTtJQUNQQSxDQUFDQSxFQVBXRCxZQUFRQSxLQUFSQSxZQUFRQSxRQU9uQkE7SUFQREEsSUFBWUEsUUFBUUEsR0FBUkEsWUFPWEEsQ0FBQUE7QUFDSEEsQ0FBQ0EsRUFaTSxHQUFHLEtBQUgsR0FBRyxRQVlUO0FDWkQsSUFBTyxHQUFHLENBYVQ7QUFiRCxXQUFPLEdBQUcsRUFBQyxDQUFDO0lBQ1ZBOztPQUVHQTtJQUNIQTtRQUFBRTtRQVFBQyxDQUFDQTtRQVBDRDs7O1dBR0dBO1FBQ0hBLGlDQUFNQSxHQUFOQSxVQUFPQSxLQUFnQkE7WUFDckJFLE1BQU1BLENBQUNBLE1BQUlBLEtBQUtBLENBQUNBLElBQUlBLFdBQU1BLEtBQUtBLENBQUNBLEtBQUtBLFVBQUtBLEtBQUtBLENBQUNBLE9BQVNBLENBQUNBO1FBQzdEQSxDQUFDQTtRQUNIRix1QkFBQ0E7SUFBREEsQ0FSQUYsQUFRQ0UsSUFBQUY7SUFSWUEsb0JBQWdCQSxtQkFRNUJBLENBQUFBO0FBQ0hBLENBQUNBLEVBYk0sR0FBRyxLQUFILEdBQUcsUUFhVDtBQ2JELElBQU8sR0FBRyxDQXVCVDtBQXZCRCxXQUFPLEdBQUcsRUFBQyxDQUFDO0lBQ1ZBOztPQUVHQTtJQUNIQTtRQUNFSzs7OztXQUlHQTtRQUNIQSx1QkFBb0JBLFVBQThCQSxFQUFVQSxXQUFvQkE7WUFBNURDLGVBQVVBLEdBQVZBLFVBQVVBLENBQW9CQTtZQUFVQSxnQkFBV0EsR0FBWEEsV0FBV0EsQ0FBU0E7UUFDaEZBLENBQUNBO1FBRUREOzs7V0FHR0E7UUFDSEEsMkJBQUdBLEdBQUhBLFVBQUlBLEtBQWdCQTtZQUNsQkUsSUFBTUEsZ0JBQWdCQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUN2REEsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7WUFDbkJBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEdBQUdBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1FBQzlCQSxDQUFDQTtRQUNIRixvQkFBQ0E7SUFBREEsQ0FsQkFMLEFBa0JDSyxJQUFBTDtJQWxCWUEsaUJBQWFBLGdCQWtCekJBLENBQUFBO0FBQ0hBLENBQUNBLEVBdkJNLEdBQUcsS0FBSCxHQUFHLFFBdUJUO0FDdkJELElBQU8sR0FBRyxDQWtDVDtBQWxDRCxXQUFPLEdBQUcsRUFBQyxDQUFDO0lBQ1ZBOzs7T0FHR0E7SUFDSEE7UUFHRVE7Ozs7V0FJR0E7UUFDSEEsNEJBQVlBLE1BQXdDQSxFQUFVQSxXQUFvQkE7WUFBcEJDLGdCQUFXQSxHQUFYQSxXQUFXQSxDQUFTQTtZQUNoRkEsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsSUFBSUEsT0FBR0EsQ0FBQ0EsZ0JBQWdCQSxDQUFZQTtnQkFDaERBLFNBQVNBLEVBQUVBLE1BQU1BLENBQUNBLE9BQU9BO2dCQUN6QkEsY0FBY0EsRUFBRUEsTUFBTUEsQ0FBQ0EsaUJBQWlCQTthQUN6Q0EsQ0FBQ0EsQ0FBQ0E7UUFDTEEsQ0FBQ0E7UUFFREQ7O1dBRUdBO1FBQ0hBLGdDQUFHQSxHQUFIQSxVQUFJQSxLQUFnQkE7WUFDbEJFLElBQUlBLENBQUNBO2dCQUNIQSxJQUFNQSxJQUFJQSxHQUFHQSxJQUFJQSxJQUFJQSxFQUFFQSxDQUFDQTtnQkFDeEJBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1lBQzdCQSxDQUFFQTtZQUFBQSxLQUFLQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDZkEsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsaUNBQWlDQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUMxREEsQ0FBQ0E7b0JBQVNBLENBQUNBO2dCQUNUQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUM5QkEsQ0FBQ0E7UUFDSEEsQ0FBQ0E7UUFDSEYseUJBQUNBO0lBQURBLENBNUJBUixBQTRCQ1EsSUFBQVI7SUE1QllBLHNCQUFrQkEscUJBNEI5QkEsQ0FBQUE7QUFDSEEsQ0FBQ0EsRUFsQ00sR0FBRyxLQUFILEdBQUcsUUFrQ1Q7QUNsQ0QsSUFBTyxHQUFHLENBZ0JUO0FBaEJELFdBQU8sR0FBRyxFQUFDLENBQUM7SUFDVkE7O09BRUdBO0lBQ0hBO1FBQ0VXOztXQUVHQTtRQUNIQTtRQUFnQkMsQ0FBQ0E7UUFFakJEOztXQUVHQTtRQUNIQSx3QkFBR0EsR0FBSEEsVUFBSUEsS0FBS0E7UUFDVEUsQ0FBQ0E7UUFDSEYsaUJBQUNBO0lBQURBLENBWEFYLEFBV0NXLElBQUFYO0lBWFlBLGNBQVVBLGFBV3RCQSxDQUFBQTtBQUNIQSxDQUFDQSxFQWhCTSxHQUFHLEtBQUgsR0FBRyxRQWdCVDtBQ2hCRCxJQUFPLEdBQUcsQ0ErR1Q7QUEvR0QsV0FBTyxHQUFHO0lBQUNBLElBQUFBLEdBQUdBLENBK0diQTtJQS9HVUEsV0FBQUEsR0FBR0EsRUFBQ0EsQ0FBQ0E7UUFDZGM7OztXQUdHQTtRQUNIQTtZQUtFQzs7ZUFFR0E7WUFDSEEsb0JBQW9CQSxPQUE0QkE7Z0JBQTVCQyxZQUFPQSxHQUFQQSxPQUFPQSxDQUFxQkE7Z0JBQzlDQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxFQUFFQSxDQUFDQTtnQkFDakJBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLEVBQUVBLENBQUNBO1lBQ3JCQSxDQUFDQTtZQUVERDs7ZUFFR0E7WUFDSEEsMEJBQUtBLEdBQUxBO2dCQUNFRSxJQUFJQSxDQUFDQTtvQkFDSEEsSUFBTUEsY0FBY0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2xEQSxtREFBbURBO29CQUNuREEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBQUEsSUFBSUEsSUFBSUEsT0FBQUEsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsRUFBYkEsQ0FBYUEsQ0FBQ0EsQ0FBQ0E7b0JBQzdDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFBQSxJQUFJQSxJQUFJQSxPQUFBQSxJQUFJQSxDQUFDQSxLQUFLQSxFQUFFQSxFQUFaQSxDQUFZQSxDQUFDQSxDQUFDQTtvQkFDMUNBLFlBQVlBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFNBQVNBLEVBQUVBLGNBQWNBLENBQUNBLENBQUNBO2dCQUUvREEsQ0FBQ0E7d0JBQVNBLENBQUNBO29CQUNUQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxFQUFFQSxDQUFDQTtvQkFDakJBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLEVBQUVBLENBQUNBO2dCQUNyQkEsQ0FBQ0E7WUFDSEEsQ0FBQ0E7WUFFREY7OztlQUdHQTtZQUNIQSwwQkFBS0EsR0FBTEE7Z0JBQ0VHLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLEVBQUVBLENBQUNBO2dCQUNqQkEsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0JBQ25CQSxJQUFNQSxjQUFjQSxHQUFHQSxZQUFZQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTtnQkFDcEVBLEVBQUVBLENBQUNBLENBQUNBLGNBQWNBLEtBQUtBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO29CQUNqQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0E7d0JBQ1hBLFdBQVdBLEVBQUVBLENBQUNBO3dCQUNkQSxVQUFVQSxFQUFFQSxDQUFDQTt3QkFDYkEsYUFBYUEsRUFBRUEsQ0FBQ0E7cUJBQ2pCQSxDQUFDQTtvQkFDRkEsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7Z0JBQ2ZBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDTkEsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzFDQSxDQUFDQTtZQUNIQSxDQUFDQTtZQUVESDs7ZUFFR0E7WUFDSEEsNEJBQU9BLEdBQVBBO2dCQUNFSSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxXQUFXQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNwQ0EsQ0FBQ0E7WUFFREo7O2VBRUdBO1lBQ0hBLG1DQUFjQSxHQUFkQTtnQkFDRUssTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsY0FBY0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsV0FBV0EsQ0FBQ0E7WUFDOURBLENBQUNBO1lBRURMOzs7ZUFHR0E7WUFDSEEsbUNBQWNBLEdBQWRBLFVBQWVBLEtBQVFBO2dCQUNyQk0sSUFBTUEsSUFBSUEsR0FBR0EsSUFBSUEsUUFBSUEsQ0FBSUEsSUFBSUEsQ0FBQ0EsT0FBT0EsRUFBRUEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsYUFBYUEsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3hFQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxhQUFhQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQTtnQkFDckVBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLFdBQVdBLElBQUlBLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLENBQUNBO2dCQUMvQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ3ZCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtZQUNkQSxDQUFDQTtZQUVETjs7ZUFFR0E7WUFDSEEsb0NBQWVBLEdBQWZBO2dCQUNFTyxJQUFNQSxJQUFJQSxHQUFHQSxRQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUlBLElBQUlBLENBQUNBLE9BQU9BLEVBQUVBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO2dCQUMzRUEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsVUFBVUEsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7Z0JBQy9EQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxXQUFXQSxJQUFJQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQTtnQkFDL0NBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUN6QkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7WUFDZEEsQ0FBQ0E7WUFFRFA7OztlQUdHQTtZQUNIQSx1Q0FBa0JBLEdBQWxCQSxVQUFtQkEsUUFBZ0NBO2dCQUNqRFEsR0FBR0EsQ0FBQUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0EsS0FBS0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0E7b0JBQzFGQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDZEEsQ0FBQ0E7WUFDSEEsQ0FBQ0E7WUFFRFI7OztlQUdHQTtZQUNIQSwrQkFBVUEsR0FBVkEsVUFBV0EsS0FBYUE7Z0JBQ3RCUyxJQUFNQSxnQkFBZ0JBLEdBQUdBLGdCQUFnQkEsQ0FBQ0E7Z0JBQzFDQSxNQUFNQSxDQUFDQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxnQkFBZ0JBLENBQUNBO1lBQ3hDQSxDQUFDQTtZQUNIVCxpQkFBQ0E7UUFBREEsQ0F6R0FELEFBeUdDQyxJQUFBRDtRQXpHWUEsY0FBVUEsYUF5R3RCQSxDQUFBQTtJQUNIQSxDQUFDQSxFQS9HVWQsR0FBR0EsR0FBSEEsT0FBR0EsS0FBSEEsT0FBR0EsUUErR2JBO0FBQURBLENBQUNBLEVBL0dNLEdBQUcsS0FBSCxHQUFHLFFBK0dUO0FDL0dELElBQU8sR0FBRyxDQXVFVDtBQXZFRCxXQUFPLEdBQUc7SUFBQ0EsSUFBQUEsR0FBR0EsQ0F1RWJBO0lBdkVVQSxXQUFBQSxHQUFHQSxFQUFDQSxDQUFDQTtRQUNkYzs7O1dBR0dBO1FBQ0hBO1lBR0VXOzs7ZUFHR0E7WUFDSEEsMEJBQW9CQSxPQUE0QkE7Z0JBQTVCQyxZQUFPQSxHQUFQQSxPQUFPQSxDQUFxQkE7Z0JBQzlDQSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxJQUFJQSxjQUFVQSxDQUFJQSxPQUFPQSxDQUFDQSxDQUFDQTtnQkFDOUNBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO1lBQzNCQSxDQUFDQTtZQUVERDs7OztlQUlHQTtZQUNIQSxrQ0FBT0EsR0FBUEEsVUFBUUEsS0FBUUE7Z0JBQ2RFLElBQU1BLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLGNBQWNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO2dCQUNwREEsSUFBTUEsZ0JBQWdCQSxHQUFHQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQTtnQkFDOUNBLElBQU1BLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLGNBQWNBLElBQUlBLGdCQUFnQkEsQ0FBQ0E7Z0JBQy9EQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDWkEsSUFBTUEsT0FBT0EsR0FBR0EsOERBQThEQSxDQUFDQTtvQkFDL0VBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO29CQUN2QkEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7b0JBQ3pCQSxNQUFNQSxJQUFJQSxLQUFLQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtnQkFDM0JBLENBQUNBO2dCQUNEQSxJQUFNQSxjQUFjQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxjQUFjQSxFQUFFQSxDQUFDQTtnQkFDekRBLEVBQUVBLENBQUNBLENBQUNBLGNBQWNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUN4QkEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7Z0JBQzNCQSxDQUFDQTtnQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ05BLE9BQU9BLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLGNBQWNBLEVBQUVBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBO3dCQUM3Q0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsZUFBZUEsRUFBRUEsQ0FBQ0E7b0JBQ3JDQSxDQUFDQTtvQkFDREEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7Z0JBQzNCQSxDQUFDQTtZQUNIQSxDQUFDQTtZQUVERjs7O2VBR0dBO1lBQ0hBLGtDQUFPQSxHQUFQQTtnQkFDRUcsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0E7b0JBQUNBLE1BQU1BLENBQUNBO2dCQUMzQkEsSUFBTUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsZUFBZUEsRUFBRUEsQ0FBQ0E7Z0JBQ2hEQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtnQkFDekJBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBO1lBQ3BCQSxDQUFDQTtZQUVESDs7ZUFFR0E7WUFDSEEsa0NBQU9BLEdBQVBBO2dCQUNFSSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtZQUNwQ0EsQ0FBQ0E7WUFFREo7O2VBRUdBO1lBQ0hBLGtDQUFPQSxHQUFQQSxVQUFRQSxRQUEyQkE7Z0JBQW5DSyxpQkFLQ0E7Z0JBSkNBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsVUFBQUEsQ0FBQ0E7b0JBQ25DQSxJQUFNQSxJQUFJQSxHQUFHQSxRQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUlBLEtBQUlBLENBQUNBLE9BQU9BLEVBQUVBLENBQUNBLENBQUNBLENBQUFBO29CQUN0REEsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3ZCQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUNITCx1QkFBQ0E7UUFBREEsQ0FqRUFYLEFBaUVDVyxJQUFBWDtRQWpFWUEsb0JBQWdCQSxtQkFpRTVCQSxDQUFBQTtJQUNIQSxDQUFDQSxFQXZFVWQsR0FBR0EsR0FBSEEsT0FBR0EsS0FBSEEsT0FBR0EsUUF1RWJBO0FBQURBLENBQUNBLEVBdkVNLEdBQUcsS0FBSCxHQUFHLFFBdUVUO0FDdkVELElBQU8sR0FBRyxDQTZEVDtBQTdERCxXQUFPLEdBQUc7SUFBQ0EsSUFBQUEsR0FBR0EsQ0E2RGJBO0lBN0RVQSxXQUFBQSxHQUFHQSxFQUFDQSxDQUFDQTtRQUNkYzs7O1dBR0dBO1FBQ0hBO1lBSUVpQjs7Ozs7ZUFLR0E7WUFDSEEsY0FBWUEsTUFBMkJBLEVBQUVBLEtBQWFBLEVBQVNBLEtBQVFBO2dCQUFSQyxVQUFLQSxHQUFMQSxLQUFLQSxDQUFHQTtnQkFDckVBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO2dCQUMxQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7WUFDL0NBLENBQUNBO1lBRUREOztlQUVHQTtZQUNIQSw0QkFBYUEsR0FBYkE7Z0JBQ0VFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO1lBQ3hEQSxDQUFDQTtZQUVERjs7ZUFFR0E7WUFDSEEsb0JBQUtBLEdBQUxBO2dCQUNFRyxZQUFZQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQTtZQUN4REEsQ0FBQ0E7WUFFREg7O2VBRUdBO1lBQ0hBLHFCQUFNQSxHQUFOQTtnQkFDRUksWUFBWUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDckNBLENBQUNBO1lBRURKOzs7O2VBSUdBO1lBQ0lBLGNBQVNBLEdBQWhCQSxVQUFpQkEsTUFBMkJBLEVBQUVBLEtBQWFBO2dCQUN6REssTUFBTUEsQ0FBSUEsTUFBTUEsQ0FBQ0EsU0FBU0EsY0FBU0EsS0FBT0EsQ0FBQ0E7WUFDN0NBLENBQUNBO1lBRURMOzs7O2VBSUdBO1lBQ0lBLHFCQUFnQkEsR0FBdkJBLFVBQTJCQSxNQUEyQkEsRUFBRUEsS0FBYUE7Z0JBQ25FTSxJQUFNQSxjQUFjQSxHQUFHQSxZQUFZQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDM0VBLElBQU1BLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLGNBQWNBLENBQUNBLENBQUNBO2dCQUN6Q0EsTUFBTUEsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBSUEsTUFBTUEsRUFBRUEsS0FBS0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7WUFDM0NBLENBQUNBO1lBQ0hOLFdBQUNBO1FBQURBLENBdkRBakIsQUF1RENpQixJQUFBakI7UUF2RFlBLFFBQUlBLE9BdURoQkEsQ0FBQUE7SUFDSEEsQ0FBQ0EsRUE3RFVkLEdBQUdBLEdBQUhBLE9BQUdBLEtBQUhBLE9BQUdBLFFBNkRiQTtBQUFEQSxDQUFDQSxFQTdETSxHQUFHLEtBQUgsR0FBRyxRQTZEVCIsImZpbGUiOiJMU0wubWVyZ2VkLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlIExTTCB7XG4gIC8qKlxuICAgKiBSZXByZXNlbnRzIHZhcmlvdXMgbGV2ZWxzIG9mIGxvZ2dpbmcuXG4gICAqL1xuICBleHBvcnQgZW51bSBMb2dMZXZlbCB7XG4gICAgVFJBQ0UsXG4gICAgREVCVUcsXG4gICAgSU5GTyxcbiAgICBXQVJOLFxuICAgIEVSUk9SLFxuICAgIEZBVEFMXG4gIH1cbn1cbiIsIm1vZHVsZSBMU0wge1xuICAvKipcbiAgICogUHJvdmlkZXMgdGhlIGRlZmF1bHQgZm9ybWF0dGluZyBmb3IgYSBsb2cgZW50cnkuIEUuZy4sIFwiWzIwMTUtMDEtMTIgMDA6MDE6MDhdIFtJTkZPXSBNZXNzYWdlIGJsYWggYmxhaC4uLlwiXG4gICAqL1xuICBleHBvcnQgY2xhc3MgRGVmYXVsdEZvcm1hdHRlciBpbXBsZW1lbnRzIElMb2dFbnRyeUZvcm1hdHRlciB7XG4gICAgLyoqXG4gICAgICogRm9ybWF0cyBhIGxvZyBlbnRyeSBhcyBbVElNRV0gW0xFVkVMXSBNRVNTQUdFXG4gICAgICogQHBhcmFtIGVudHJ5IFRoZSBsb2cgZW50cnlcbiAgICAgKi9cbiAgICBmb3JtYXQoZW50cnk6IElMb2dFbnRyeSkgOiBzdHJpbmd7XG4gICAgICByZXR1cm4gYFske2VudHJ5LnRpbWV9XSBbJHtlbnRyeS5sZXZlbH1dICR7ZW50cnkubWVzc2FnZX1gO1xuICAgIH1cbiAgfVxufVxuIiwibW9kdWxlIExTTCB7XG4gIC8qKlxuICAgKiBMb2dnZXIgdGhhdCBsb2dzIHRvIHRoZSBjb25zb2xlLlxuICAgKi9cbiAgZXhwb3J0IGNsYXNzIENvbnNvbGVMb2dnZXIgaW1wbGVtZW50cyBJTG9nZ2VyIHtcbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RzIGEgY29uc29sZSBsb2dnZXIuXG4gICAgICogQHBhcmFtIF9mb3JtYXR0ZXIgVGhlIGZvcm1hdHRlciB1c2VkIHRvIGZvcm1hdCB0aGUgZW50cnkgZm9yIHRoZSBjb25zb2xlXG4gICAgICogQHBhcmFtIF9uZXh0TG9nZ2VyIFRoZSBuZXh0IGxvZ2dlciBpbiB0aGUgXCJsb2cgY2hhaW5cIlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2Zvcm1hdHRlcjogSUxvZ0VudHJ5Rm9ybWF0dGVyLCBwcml2YXRlIF9uZXh0TG9nZ2VyOiBJTG9nZ2VyKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9ncyBhbiBlbnRyeSB0byB0aGUgY29uc29sZS5cbiAgICAgKiBAcGFyYW0gZW50cnkgVGhlIGVudHJ5IHRvIGxvZ1xuICAgICAqL1xuICAgIGxvZyhlbnRyeTogSUxvZ0VudHJ5KSB7XG4gICAgICBjb25zdCBmb3JtYXR0ZWRNZXNzYWdlID0gdGhpcy5fZm9ybWF0dGVyLmZvcm1hdChlbnRyeSk7XG4gICAgICBjb25zb2xlLmxvZyhlbnRyeSk7XG4gICAgICB0aGlzLl9uZXh0TG9nZ2VyLmxvZyhlbnRyeSk7XG4gICAgfVxuICB9XG59XG4iLCJtb2R1bGUgTFNMIHtcbiAgLyoqXG4gICAqIExvZ2dlciB0aGF0IGxvZ3MgdG8gYSBxdWV1ZSBpbiBsb2NhbCBzdG9yYWdlLiBXaWxsIG92ZXJ3cml0ZSBvbGRlc3QgZW50cmllc1xuICAgKiB3aGVuIGRlc2lyZWQgc2l6ZSBpcyBleGNlZWRlZC5cbiAgICovXG4gIGV4cG9ydCBjbGFzcyBMb2NhbFN0b3JhZ2VMb2dnZXIgaW1wbGVtZW50cyBJTG9nZ2VyIHtcbiAgICBwcml2YXRlIF9xdWV1ZTogTFNRLkxpbWl0ZWRTaXplUXVldWU8SUxvZ0VudHJ5PjtcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdHMgYSBuZXcgbG9jYWwgc3RvcmFnZSBsb2dnZXIuXG4gICAgICogQHBhcmFtIGNvbmZpZyBUaGUgY29uZmlndXJhdGlvbiBkZWZpbmluZyB0aGUgdW5pcXVlIHF1ZXVlIG5hbWUsIGRlc2lyZWQgc2l6ZSBldGMuXG4gICAgICogQHBhcmFtIF9uZXh0TG9nZ2VyIFRoZSBuZXh0IGxvZ2dlciBpbiB0aGUgXCJsb2cgY2hhaW5cIlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogSUxvY2FsU3RvcmFnZUxvZ2dlckNvbmZpZ3VyYXRpb24sIHByaXZhdGUgX25leHRMb2dnZXI6IElMb2dnZXIpIHtcbiAgICAgIHRoaXMuX3F1ZXVlID0gbmV3IExTUS5MaW1pdGVkU2l6ZVF1ZXVlPElMb2dFbnRyeT4oe1xuICAgICAgICBrZXlQcmVmaXg6IGNvbmZpZy5sb2dOYW1lLFxuICAgICAgICBtYXhTaXplSW5CeXRlczogY29uZmlnLm1heExvZ1NpemVJbkJ5dGVzXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMb2dzIGFuIGVudHJ5IHRvIGxvY2FsIHN0b3JhZ2UuXG4gICAgICovXG4gICAgbG9nKGVudHJ5OiBJTG9nRW50cnkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB0aGlzLl9xdWV1ZS5lbnF1ZXVlKGVudHJ5KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBsb2cgdG8gbG9jYWwgc3RvcmFnZS4nLCBlcnJvcik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLl9uZXh0TG9nZ2VyLmxvZyhlbnRyeSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJtb2R1bGUgTFNMIHtcbiAgLyoqXG4gICAqIEEgbG9nZ2VyIHRoYXQgZG9lc24ndCBhY3R1YWxseSBkbyBhbnl0aGluZy4gVXNlZCBmb3IgdGVybWluYXRpbmcgYSBjaGFpbiBvZiBsb2dnZXJzLlxuICAgKi9cbiAgZXhwb3J0IGNsYXNzIE51bGxMb2dnZXIgaW1wbGVtZW50cyBJTG9nZ2VyIHtcbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RzIGEgbm8tb3AgbG9nZ2VyLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgICAvKipcbiAgICAgKiBOby1vcFxuICAgICAqL1xuICAgIGxvZyhlbnRyeSkge1xuICAgIH1cbiAgfVxufVxuIiwibW9kdWxlIExTTC5MU1Ege1xuICAvKipcbiAgICogVGhpcyBjbGFzcyBrZWVwcyB0cmFjayBvZiB0aGUgc3RhcnQsIGVuZCBhbmQgc2l6ZSBvZiB0aGUgcXVldWVcbiAgICogc3RvcmVkIGluIGxvY2FsIHN0b3JhZ2UuIEl0IGFsbG93cyBub2RlcyB0byBiZSBjcmVhdGVkIGFuZCByZW1vdmVkLlxuICAgKi8gXG4gIGV4cG9ydCBjbGFzcyBCb29ra2VlcGVyPFQ+IHtcbiAgICBwcml2YXRlIF9pbmZvOiBJQm9va2tlZXBpbmdJbmZvOyBcbiAgICBwcml2YXRlIF9hZGRlZDogQXJyYXk8Tm9kZTxUPj47XG4gICAgcHJpdmF0ZSBfcmVtb3ZlZDogQXJyYXk8Tm9kZTxUPj47XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IEJvb2trZWVwZXIgZm9yIGEgcXVldWUuIEl0IHNob3VsZCBiZSBpbml0aWFsaXplZCB1c2luZyByZXNldCBtZXRob2QuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfY29uZmlnOiBJUXVldWVDb25maWd1cmF0aW9uKSB7XG4gICAgICB0aGlzLl9hZGRlZCA9IFtdO1xuICAgICAgdGhpcy5fcmVtb3ZlZCA9IFtdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0b3JlcyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgcXVldWUgdG8gbG9jYWwgc3RvcmFnZS5cbiAgICAgKi9cbiAgICBzdG9yZSgpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHNlcmlhbGl6ZWRJbmZvID0gSlNPTi5zdHJpbmdpZnkodGhpcy5faW5mbyk7XG4gICAgICAgIC8vIElkZWFsbHkgdGhpcyB3b3VsZCBhbGwgYmUgaW5zaWRlIGEgdHJhbnNhY3Rpb24ge1xuICAgICAgICB0aGlzLl9yZW1vdmVkLmZvckVhY2gobm9kZSA9PiBub2RlLnJlbW92ZSgpKTtcbiAgICAgICAgdGhpcy5fYWRkZWQuZm9yRWFjaChub2RlID0+IG5vZGUuc3RvcmUoKSk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuX2NvbmZpZy5rZXlQcmVmaXgsIHNlcmlhbGl6ZWRJbmZvKTtcbiAgICAgICAgLy8gfVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5fYWRkZWQgPSBbXTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlZCA9IFtdO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0cyB0aGUgc3RhcnQsIGVuZCBhbmQgc2l6ZSBjb3VudHMgdG8gd2hhdCB3YXMgbGFzdCBwZXJzaXN0ZWQgdG9cbiAgICAgKiBsb2NhbCBzdG9yYWdlLlxuICAgICAqL1xuICAgIHJlc2V0KCkge1xuICAgICAgdGhpcy5fYWRkZWQgPSBbXTtcbiAgICAgIHRoaXMuX3JlbW92ZWQgPSBbXTtcbiAgICAgIGNvbnN0IHNlcmlhbGl6ZWRJbmZvID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5fY29uZmlnLmtleVByZWZpeCk7XG4gICAgICBpZiAoc2VyaWFsaXplZEluZm8gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9pbmZvID0ge1xuICAgICAgICAgIHNpemVJbkJ5dGVzOiAwLFxuICAgICAgICAgIHN0YXJ0SW5kZXg6IDAsXG4gICAgICAgICAgbmV4dEZyZWVJbmRleDogMFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnN0b3JlKCk7IFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5faW5mbyA9IEpTT04ucGFyc2Uoc2VyaWFsaXplZEluZm8pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgcXVldWUgaGFzIG5vIGVsZW1lbnRzLlxuICAgICAqL1xuICAgIGlzRW1wdHkoKSB7XG4gICAgICByZXR1cm4gdGhpcy5faW5mby5zaXplSW5CeXRlcyA+IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgcHJvamVjdGVkIGZyZWUgc3BhY2UuIFRoaXMgdGFrZXMgaW50byBhY2NvdW50IG1vZGlmaWNhdGlvbnMuXG4gICAgICovXG4gICAgcmVtYWluaW5nU3BhY2UoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY29uZmlnLm1heFNpemVJbkJ5dGVzIC0gdGhpcy5faW5mby5zaXplSW5CeXRlcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IG5vZGUgYXQgdGhlIGVuZCBvZiB0aGUgcXVldWUuXG4gICAgICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byBzdG9yZSBhcyBhbiBlbGVtZW50IG9mIHRoZSBxdWV1ZS5cbiAgICAgKi9cbiAgICBjcmVhdGVOZXh0Tm9kZSh2YWx1ZTogVCkge1xuICAgICAgY29uc3Qgbm9kZSA9IG5ldyBOb2RlPFQ+KHRoaXMuX2NvbmZpZywgdGhpcy5faW5mby5uZXh0RnJlZUluZGV4LCB2YWx1ZSk7XG4gICAgICB0aGlzLl9pbmZvLm5leHRGcmVlSW5kZXggPSB0aGlzLl9uZXh0SW5kZXgodGhpcy5faW5mby5uZXh0RnJlZUluZGV4KTtcbiAgICAgIHRoaXMuX2luZm8uc2l6ZUluQnl0ZXMgKz0gbm9kZS5lc3RpbWF0ZWRTaXplKCk7XG4gICAgICB0aGlzLl9hZGRlZC5wdXNoKG5vZGUpO1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbmQgcmV0dXJucyB0aGUgZmlyc3Qgc3RvcmVkIG5vZGUuIFRoZSBjb25zdW1lciBzaG91bGQgY2hlY2sgdGhhdCB0aGVyZSBpcyBhIG5vZGUgdG8gcmVtb3ZlIGZpcnN0LlxuICAgICAqL1xuICAgIGRlbGV0ZUZpcnN0Tm9kZSgpIHtcbiAgICAgIGNvbnN0IG5vZGUgPSBOb2RlLmZyb21Mb2NhbFN0b3JhZ2U8VD4odGhpcy5fY29uZmlnLCB0aGlzLl9pbmZvLnN0YXJ0SW5kZXgpO1xuICAgICAgdGhpcy5faW5mby5zdGFydEluZGV4ID0gdGhpcy5fbmV4dEluZGV4KHRoaXMuX2luZm8uc3RhcnRJbmRleCk7XG4gICAgICB0aGlzLl9pbmZvLnNpemVJbkJ5dGVzIC09IG5vZGUuZXN0aW1hdGVkU2l6ZSgpO1xuICAgICAgdGhpcy5fcmVtb3ZlZC5wdXNoKG5vZGUpO1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSXRlcmF0ZXMgdGhyb3VnaCB0aGUgaW5kZXggdmFsdWVzIG9mIHRoZSBlbGVtZW50cyBpbiB0aGUgcXVldWUuIFRoZXNlIGNhbiBiZSB1c2VkIHRvIHJldHJpZXZlIHRoZSBlbGVtZW50cy5cbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBpbnZva2VkIG9uY2UgZm9yIGVhY2ggaW5kZXggdmFsdWUgdXNlZCBpbiB0aGUgcXVldWUuXG4gICAgICovXG4gICAgaXRlcmF0ZUluZGV4VmFsdWVzKGNhbGxiYWNrOiAoaW5kZXg6bnVtYmVyKSA9PiB2b2lkKSB7XG4gICAgICBmb3IobGV0IGkgPSB0aGlzLl9pbmZvLnN0YXJ0SW5kZXg7IGkgIT09IHRoaXMuX2luZm8ubmV4dEZyZWVJbmRleDsgaSA9IHRoaXMuX25leHRJbmRleChpKSkge1xuICAgICAgICBjYWxsYmFjayhpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBuZXh0IGluZGV4IHZhbHVlIChtb2R1bG8gTUFYX1NBRkVfSU5URUdFUikuXG4gICAgICogQHBhcmFtIGluZGV4IFRoZSBwcmV2aW91cyBpbmRleCB2YWx1ZS5cbiAgICAgKi9cbiAgICBfbmV4dEluZGV4KGluZGV4OiBudW1iZXIpIHtcbiAgICAgIGNvbnN0IE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuICAgICAgcmV0dXJuIChpbmRleCArIDEpICUgTUFYX1NBRkVfSU5URUdFUjtcbiAgICB9XG4gIH1cbn1cbiIsIm1vZHVsZSBMU0wuTFNRIHtcbiAgLyoqXG4gICAqIEEgbGltaXRlZC1zaXplIHF1ZXVlIHRoYXQgaXMgcGVyc2lzdGVkIHRvIGxvY2FsIHN0b3JhZ2UuIEVucXVldWluZ1xuICAgKiBlbGVtZW50cyBjYW4gcmVtb3ZlIHRoZSBvbGRlc3QgZWxlbWVudHMgaW4gb3JkZXIgdG8gZnJlZSB1cCBzcGFjZS5cbiAgICovXG4gIGV4cG9ydCBjbGFzcyBMaW1pdGVkU2l6ZVF1ZXVlPFQ+IHtcbiAgICBwcml2YXRlIF9ib29ra2VlcGVyOiBCb29ra2VlcGVyPFQ+O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcy9yZXN0b3JlcyBhIHF1ZXVlIGJhc2VkIG9uIHRoZSBjb25maWd1cmF0aW9uIHByb3ZpZGVkLlxuICAgICAqIEBwYXJhbSBfY29uZmlnIFRoZSBzZXR0aW5ncyBmb3IgdGhlIHF1ZXVlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfY29uZmlnOiBJUXVldWVDb25maWd1cmF0aW9uKSB7XG4gICAgICB0aGlzLl9ib29ra2VlcGVyID0gbmV3IEJvb2trZWVwZXI8VD4oX2NvbmZpZyk7XG4gICAgICB0aGlzLl9ib29ra2VlcGVyLnJlc2V0KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW5xdWV1ZXMgYW4gaXRlbSBpbiB0aGUgcXVldWUuIFRocm93cyBpZiB0aGUgdmFsdWUgaXMgdG9vIGJpZyB0byBmaXQgaW4gbG9jYWwgc3RvcmFnZVxuICAgICAqIGJhc2VkIG9uIHRoZSBtYXhpbXVtIHNpemVkIGRlZmluZWQgaW4gdGhlIHF1ZXVlIGNvbmZpZ3VyYXRpb24uIE1heSBhbHNvIHRocm93XG4gICAgICogaWYgbG9jYWwgc3RvcmFnZSBpcyBvdXQgb2Ygc3BhY2Ugb3IgY29ycnVwdGVkLlxuICAgICAqL1xuICAgIGVucXVldWUodmFsdWU6IFQpIDogdm9pZCB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5fYm9va2tlZXBlci5jcmVhdGVOZXh0Tm9kZSh2YWx1ZSk7XG4gICAgICBjb25zdCBzcGFjZVJlcXVpcmVtZW50ID0gbm9kZS5lc3RpbWF0ZWRTaXplKCk7XG4gICAgICBjb25zdCBjYW5GaXQgPSB0aGlzLl9jb25maWcubWF4U2l6ZUluQnl0ZXMgPj0gc3BhY2VSZXF1aXJlbWVudDtcbiAgICAgIGlmICghY2FuRml0KSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSAnTFNMOiBWYWx1ZSBpcyB0b28gYmlnIHRvIHN0b3JlLiBSZXZlcnRpbmcgdG8gcHJldmlvdXMgc3RhdGUuJztcbiAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5fYm9va2tlZXBlci5yZXNldCgpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgICB9XG4gICAgICBjb25zdCByZW1haW5pbmdTcGFjZSA9IHRoaXMuX2Jvb2trZWVwZXIucmVtYWluaW5nU3BhY2UoKTtcbiAgICAgIGlmIChyZW1haW5pbmdTcGFjZSA+PSAwKSB7XG4gICAgICAgIHRoaXMuX2Jvb2trZWVwZXIuc3RvcmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdoaWxlICh0aGlzLl9ib29ra2VlcGVyLnJlbWFpbmluZ1NwYWNlKCkgPCAwKSB7XG4gICAgICAgICAgdGhpcy5fYm9va2tlZXBlci5kZWxldGVGaXJzdE5vZGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9ib29ra2VlcGVyLnN0b3JlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgdGhlIHF1ZXVlIGhhcyBhdCBsZWFzdCAxIGl0ZW0sIGl0IHJlbW92ZXMgYW5kIHJldHVybnMgdGhlIG9sZGVzdCBpdGVtIGZyb20gdGhlIHF1ZXVlLlxuICAgICAqIE90aGVyd2lzZSwgaXQgd2lsbCByZXR1cm4gbm90aGluZy5cbiAgICAgKi9cbiAgICBkZXF1ZXVlKCkgOiBUIHwgdm9pZCB7XG4gICAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHJldHVybjtcbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLl9ib29ra2VlcGVyLmRlbGV0ZUZpcnN0Tm9kZSgpO1xuICAgICAgdGhpcy5fYm9va2tlZXBlci5zdG9yZSgpO1xuICAgICAgcmV0dXJuIG5vZGUudmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBxdWV1ZSBpcyBlbXB0eS5cbiAgICAgKi9cbiAgICBpc0VtcHR5KCkgOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLl9ib29ra2VlcGVyLmlzRW1wdHkoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJdGVyYXRlcyAod2l0aG91dCByZW1vdmFsKSB0aHJvdWdoIGFsbCBpdGVtcyBzdG9yZWQgaW4gdGhlIHF1ZXVlLlxuICAgICAqL1xuICAgIGl0ZXJhdGUoY2FsbGJhY2s6IChpdGVtOiBUKSA9PiB2b2lkKSB7XG4gICAgICB0aGlzLl9ib29ra2VlcGVyLml0ZXJhdGVJbmRleFZhbHVlcyhpID0+IHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IE5vZGUuZnJvbUxvY2FsU3RvcmFnZTxUPih0aGlzLl9jb25maWcsIGkpXG4gICAgICAgIGNhbGxiYWNrKG5vZGUudmFsdWUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iLCJtb2R1bGUgTFNMLkxTUSB7XG4gIC8qKlxuICAgKiBFYWNoIG5vZGUgY29ycmVzcG9uZHMgdG8gYW4gZW50cnkgd2l0aGluIHRoZSBxdWV1ZS4gVGhpcyBoZWxwcyB3aXRoXG4gICAqIHN0b3JhZ2UgYW5kIHJlbW92YWwgZnJvbSBsb2NhbCBzdG9yYWdlLlxuICAgKi9cbiAgZXhwb3J0IGNsYXNzIE5vZGU8VD4ge1xuICAgIHByaXZhdGUgX2tleTogc3RyaW5nO1xuICAgIHByaXZhdGUgX3NlcmlhbGl6ZWROb2RlOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RzIGEgbm9kZSByZXByZXNlbnRpbmcgYW4gZW50cnkgaW4gdGhlIHF1ZXVlLlxuICAgICAqIEBwYXJhbSBjb25maWcgVGhlIHF1ZXVlIGNvbmZpZ3VyYXRpb24uIFRoaXMgaXMgdXNlZCB0byBwcm92aWRlIHRoZSBwcmVmaXggZm9yIHRoZSBrZXkuXG4gICAgICogQHBhcmFtIGluZGV4IFRoZSBpbmRleCB3aXRoaW4gdGhlIHF1ZXVlXG4gICAgICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSBvZiB0aGUgZW50cnlcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihjb25maWc6IElRdWV1ZUNvbmZpZ3VyYXRpb24sIGluZGV4OiBudW1iZXIsIHB1YmxpYyB2YWx1ZTogVCkge1xuICAgICAgdGhpcy5fa2V5ID0gTm9kZS5jcmVhdGVLZXkoY29uZmlnLCBpbmRleCk7XG4gICAgICB0aGlzLl9zZXJpYWxpemVkTm9kZSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGVzdGltYXRlIG9mIHRoZSBzaXplIHRoaXMgd2lsbCB0YWtlIHVwIGluIGxvY2FsIHN0b3JhZ2UuXG4gICAgICovXG4gICAgZXN0aW1hdGVkU2l6ZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zZXJpYWxpemVkTm9kZS5sZW5ndGggKyB0aGlzLl9rZXkubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0b3JlcyB0aGUgc2VyaWFsaXplZCBlbnRyeSBpbiBsb2NhbCBzdG9yYWdlLlxuICAgICAqL1xuICAgIHN0b3JlKCkge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5fa2V5LCB0aGlzLl9zZXJpYWxpemVkTm9kZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgZW50cnkgZnJvbSBsb2NhbCBzdG9yYWdlIGlmIGl0IGV4aXN0cy5cbiAgICAgKi9cbiAgICByZW1vdmUoKSB7XG4gICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLl9rZXkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBrZXkgZm9yIGFuIGVudHJ5LlxuICAgICAqIEBwYXJhbSBjb25maWcgVGhlIGNvbmZpZ3VyYXRpb24gY29udGFpbmluZyB0aGUga2V5IHByZWZpeFxuICAgICAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIGVudHJ5IGluIHRoZSBxdWV1ZVxuICAgICAqL1xuICAgIHN0YXRpYyBjcmVhdGVLZXkoY29uZmlnOiBJUXVldWVDb25maWd1cmF0aW9uLCBpbmRleDogbnVtYmVyKSB7XG4gICAgICByZXR1cm4gYCR7Y29uZmlnLmtleVByZWZpeH0taXRlbS0ke2luZGV4fWA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9hZHMgYW4gZW50cnkgZnJvbSBsb2NhbCBzdG9yYWdlIGFuZCBkZXNlcmlhbGl6ZXMgaXQuIFJldHVybnMgdGhlIGFzc29jaWF0ZWQgbm9kZS5cbiAgICAgKiBAcGFyYW0gY29uZmlnIFRoZSBjb25maWd1cmF0aW9uIGNvbnRhaW5pbmcgdGhlIGtleSBwcmVmaXhcbiAgICAgKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IG9mIHRoZSBlbnRyeSBpbiB0aGUgcXVldWVcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbUxvY2FsU3RvcmFnZTxUPihjb25maWc6IElRdWV1ZUNvbmZpZ3VyYXRpb24sIGluZGV4OiBudW1iZXIpIHtcbiAgICAgIGNvbnN0IHNlcmlhbGl6ZWROb2RlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oTm9kZS5jcmVhdGVLZXkoY29uZmlnLCBpbmRleCkpO1xuICAgICAgY29uc3QgdmFsdWUgPSBKU09OLnBhcnNlKHNlcmlhbGl6ZWROb2RlKTtcbiAgICAgIHJldHVybiBuZXcgTm9kZTxUPihjb25maWcsIGluZGV4LCB2YWx1ZSk7XG4gICAgfVxuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
