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
exports.LocalStorageLogger = LocalStorageLogger;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9sb2dnZXJzL0xvY2FsU3RvcmFnZUxvZ2dlci50cyJdLCJuYW1lcyI6WyJMb2NhbFN0b3JhZ2VMb2dnZXIiLCJMb2NhbFN0b3JhZ2VMb2dnZXIuY29uc3RydWN0b3IiLCJMb2NhbFN0b3JhZ2VMb2dnZXIubG9nIl0sIm1hcHBpbmdzIjoiQUFHQSxpQ0FBK0IsMkJBQTJCLENBQUMsQ0FBQTtBQUUzRDs7O0dBR0c7QUFDSDtJQUdFQTs7OztPQUlHQTtJQUNIQSw0QkFBWUEsTUFBd0NBLEVBQVVBLFdBQW9CQTtRQUFwQkMsZ0JBQVdBLEdBQVhBLFdBQVdBLENBQVNBO1FBQ2hGQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxtQ0FBZ0JBLENBQVlBO1lBQzVDQSxTQUFTQSxFQUFFQSxNQUFNQSxDQUFDQSxPQUFPQTtZQUN6QkEsY0FBY0EsRUFBRUEsTUFBTUEsQ0FBQ0EsaUJBQWlCQTtTQUN6Q0EsQ0FBQ0EsQ0FBQ0E7SUFDTEEsQ0FBQ0E7SUFFREQ7O09BRUdBO0lBQ0hBLGdDQUFHQSxHQUFIQSxVQUFJQSxLQUFnQkE7UUFDbEJFLElBQUlBLENBQUNBO1lBQ0hBLElBQU1BLElBQUlBLEdBQUdBLElBQUlBLElBQUlBLEVBQUVBLENBQUNBO1lBQ3hCQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUM3QkEsQ0FBRUE7UUFBQUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDZkEsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsaUNBQWlDQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUMxREEsQ0FBQ0E7Z0JBQVNBLENBQUNBO1lBQ1RBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEdBQUdBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1FBQzlCQSxDQUFDQTtJQUNIQSxDQUFDQTtJQUNIRix5QkFBQ0E7QUFBREEsQ0E1QkEsQUE0QkNBLElBQUE7QUE1QlksMEJBQWtCLHFCQTRCOUIsQ0FBQSIsImZpbGUiOiJsaWIvbG9nZ2Vycy9Mb2NhbFN0b3JhZ2VMb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0lMb2dnZXJ9IGZyb20gJy4vSUxvZ2dlcic7XG5pbXBvcnQge0lMb2dFbnRyeX0gZnJvbSAnLi4vY29yZS9JTG9nRW50cnknO1xuaW1wb3J0IHtJTG9jYWxTdG9yYWdlTG9nZ2VyQ29uZmlndXJhdGlvbn0gZnJvbSAnLi9JTG9jYWxTdG9yYWdlTG9nZ2VyQ29uZmlndXJhdGlvbic7XG5pbXBvcnQge0xpbWl0ZWRTaXplUXVldWV9IGZyb20gJy4uL3F1ZXVlL0xpbWl0ZWRTaXplUXVldWUnO1xuXG4vKipcbiAqIExvZ2dlciB0aGF0IGxvZ3MgdG8gYSBxdWV1ZSBpbiBsb2NhbCBzdG9yYWdlLiBXaWxsIG92ZXJ3cml0ZSBvbGRlc3QgZW50cmllc1xuICogd2hlbiBkZXNpcmVkIHNpemUgaXMgZXhjZWVkZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2NhbFN0b3JhZ2VMb2dnZXIgaW1wbGVtZW50cyBJTG9nZ2VyIHtcbiAgcHJpdmF0ZSBfcXVldWU6IExpbWl0ZWRTaXplUXVldWU8SUxvZ0VudHJ5PjtcblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5ldyBsb2NhbCBzdG9yYWdlIGxvZ2dlci5cbiAgICogQHBhcmFtIGNvbmZpZyBUaGUgY29uZmlndXJhdGlvbiBkZWZpbmluZyB0aGUgdW5pcXVlIHF1ZXVlIG5hbWUsIGRlc2lyZWQgc2l6ZSBldGMuXG4gICAqIEBwYXJhbSBfbmV4dExvZ2dlciBUaGUgbmV4dCBsb2dnZXIgaW4gdGhlIFwibG9nIGNoYWluXCJcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogSUxvY2FsU3RvcmFnZUxvZ2dlckNvbmZpZ3VyYXRpb24sIHByaXZhdGUgX25leHRMb2dnZXI6IElMb2dnZXIpIHtcbiAgICB0aGlzLl9xdWV1ZSA9IG5ldyBMaW1pdGVkU2l6ZVF1ZXVlPElMb2dFbnRyeT4oe1xuICAgICAga2V5UHJlZml4OiBjb25maWcubG9nTmFtZSxcbiAgICAgIG1heFNpemVJbkJ5dGVzOiBjb25maWcubWF4TG9nU2l6ZUluQnl0ZXNcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2dzIGFuIGVudHJ5IHRvIGxvY2FsIHN0b3JhZ2UuXG4gICAqL1xuICBsb2coZW50cnk6IElMb2dFbnRyeSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB0aW1lID0gbmV3IERhdGUoKTtcbiAgICAgIHRoaXMuX3F1ZXVlLmVucXVldWUoZW50cnkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gbG9nIHRvIGxvY2FsIHN0b3JhZ2UuJywgZXJyb3IpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLl9uZXh0TG9nZ2VyLmxvZyhlbnRyeSk7XG4gICAgfVxuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
