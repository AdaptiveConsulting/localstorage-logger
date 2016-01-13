var LimitedSizeQueue_1 = require('../queue/LimitedSizeQueue');
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
        this._queue = new LimitedSizeQueue_1.LimitedSizeQueue({
            keyPrefix: config.logName,
            maxSizeInBytes: config.maxLogSizeInBytes
        });
    }
    /**
     * Logs an entry to local storage.
     */
    LocalStorageLogger.prototype.log = function (entry) {
        try {
            this._queue.enqueue(entry);
        }
        catch (error) {
            console.error('Failed to log to local storage.', error);
        }
        finally {
            this._nextLogger.log(entry);
        }
    };
    /**
     * Returns all log entries that are still held in local storage.
     */
    LocalStorageLogger.prototype.allEntries = function () {
        var entries = new Array();
        this._queue.iterate(function (entry) { return entries.push(entry); });
        return entries;
    };
    return LocalStorageLogger;
})();
exports.LocalStorageLogger = LocalStorageLogger;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2dlcnMvTG9jYWxTdG9yYWdlTG9nZ2VyLnRzIl0sIm5hbWVzIjpbIkxvY2FsU3RvcmFnZUxvZ2dlciIsIkxvY2FsU3RvcmFnZUxvZ2dlci5jb25zdHJ1Y3RvciIsIkxvY2FsU3RvcmFnZUxvZ2dlci5sb2ciLCJMb2NhbFN0b3JhZ2VMb2dnZXIuYWxsRW50cmllcyJdLCJtYXBwaW5ncyI6IkFBR0EsaUNBQStCLDJCQUEyQixDQUFDLENBQUE7QUFFM0Q7OztHQUdHO0FBQ0g7SUFHRUE7Ozs7T0FJR0E7SUFDSEEsNEJBQVlBLE1BQXdDQSxFQUFVQSxXQUFvQkE7UUFBcEJDLGdCQUFXQSxHQUFYQSxXQUFXQSxDQUFTQTtRQUNoRkEsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsSUFBSUEsbUNBQWdCQSxDQUFZQTtZQUM1Q0EsU0FBU0EsRUFBRUEsTUFBTUEsQ0FBQ0EsT0FBT0E7WUFDekJBLGNBQWNBLEVBQUVBLE1BQU1BLENBQUNBLGlCQUFpQkE7U0FDekNBLENBQUNBLENBQUNBO0lBQ0xBLENBQUNBO0lBRUREOztPQUVHQTtJQUNIQSxnQ0FBR0EsR0FBSEEsVUFBSUEsS0FBZ0JBO1FBQ2xCRSxJQUFJQSxDQUFDQTtZQUNIQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUM3QkEsQ0FBRUE7UUFBQUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDZkEsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsaUNBQWlDQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUMxREEsQ0FBQ0E7Z0JBQVNBLENBQUNBO1lBQ1RBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEdBQUdBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1FBQzlCQSxDQUFDQTtJQUNIQSxDQUFDQTtJQUVERjs7T0FFR0E7SUFDSEEsdUNBQVVBLEdBQVZBO1FBQ0VHLElBQU1BLE9BQU9BLEdBQUdBLElBQUlBLEtBQUtBLEVBQWFBLENBQUNBO1FBQ3ZDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFBQSxLQUFLQSxJQUFJQSxPQUFBQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxFQUFuQkEsQ0FBbUJBLENBQUNBLENBQUNBO1FBQ2xEQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQTtJQUNqQkEsQ0FBQ0E7SUFDSEgseUJBQUNBO0FBQURBLENBcENBLEFBb0NDQSxJQUFBO0FBcENZLDBCQUFrQixxQkFvQzlCLENBQUEiLCJmaWxlIjoibG9nZ2Vycy9Mb2NhbFN0b3JhZ2VMb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0lMb2dnZXJ9IGZyb20gJy4vSUxvZ2dlcic7XG5pbXBvcnQge0lMb2dFbnRyeX0gZnJvbSAnLi4vY29yZS9JTG9nRW50cnknO1xuaW1wb3J0IHtJTG9jYWxTdG9yYWdlTG9nZ2VyQ29uZmlndXJhdGlvbn0gZnJvbSAnLi9JTG9jYWxTdG9yYWdlTG9nZ2VyQ29uZmlndXJhdGlvbic7XG5pbXBvcnQge0xpbWl0ZWRTaXplUXVldWV9IGZyb20gJy4uL3F1ZXVlL0xpbWl0ZWRTaXplUXVldWUnO1xuXG4vKipcbiAqIExvZ2dlciB0aGF0IGxvZ3MgdG8gYSBxdWV1ZSBpbiBsb2NhbCBzdG9yYWdlLiBXaWxsIG92ZXJ3cml0ZSBvbGRlc3QgZW50cmllc1xuICogd2hlbiBkZXNpcmVkIHNpemUgaXMgZXhjZWVkZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2NhbFN0b3JhZ2VMb2dnZXIgaW1wbGVtZW50cyBJTG9nZ2VyIHtcbiAgcHJpdmF0ZSBfcXVldWU6IExpbWl0ZWRTaXplUXVldWU8SUxvZ0VudHJ5PjtcblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5ldyBsb2NhbCBzdG9yYWdlIGxvZ2dlci5cbiAgICogQHBhcmFtIGNvbmZpZyBUaGUgY29uZmlndXJhdGlvbiBkZWZpbmluZyB0aGUgdW5pcXVlIHF1ZXVlIG5hbWUsIGRlc2lyZWQgc2l6ZSBldGMuXG4gICAqIEBwYXJhbSBfbmV4dExvZ2dlciBUaGUgbmV4dCBsb2dnZXIgaW4gdGhlIFwibG9nIGNoYWluXCJcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogSUxvY2FsU3RvcmFnZUxvZ2dlckNvbmZpZ3VyYXRpb24sIHByaXZhdGUgX25leHRMb2dnZXI6IElMb2dnZXIpIHtcbiAgICB0aGlzLl9xdWV1ZSA9IG5ldyBMaW1pdGVkU2l6ZVF1ZXVlPElMb2dFbnRyeT4oe1xuICAgICAga2V5UHJlZml4OiBjb25maWcubG9nTmFtZSxcbiAgICAgIG1heFNpemVJbkJ5dGVzOiBjb25maWcubWF4TG9nU2l6ZUluQnl0ZXNcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2dzIGFuIGVudHJ5IHRvIGxvY2FsIHN0b3JhZ2UuXG4gICAqL1xuICBsb2coZW50cnk6IElMb2dFbnRyeSkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9xdWV1ZS5lbnF1ZXVlKGVudHJ5KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGxvZyB0byBsb2NhbCBzdG9yYWdlLicsIGVycm9yKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5fbmV4dExvZ2dlci5sb2coZW50cnkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFsbCBsb2cgZW50cmllcyB0aGF0IGFyZSBzdGlsbCBoZWxkIGluIGxvY2FsIHN0b3JhZ2UuXG4gICAqL1xuICBhbGxFbnRyaWVzKCkgOiBBcnJheTxJTG9nRW50cnk+IHtcbiAgICBjb25zdCBlbnRyaWVzID0gbmV3IEFycmF5PElMb2dFbnRyeT4oKTtcbiAgICB0aGlzLl9xdWV1ZS5pdGVyYXRlKGVudHJ5ID0+IGVudHJpZXMucHVzaChlbnRyeSkpO1xuICAgIHJldHVybiBlbnRyaWVzO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
