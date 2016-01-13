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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2dlcnMvTG9jYWxTdG9yYWdlTG9nZ2VyLnRzIl0sIm5hbWVzIjpbIkxvY2FsU3RvcmFnZUxvZ2dlciIsIkxvY2FsU3RvcmFnZUxvZ2dlci5jb25zdHJ1Y3RvciIsIkxvY2FsU3RvcmFnZUxvZ2dlci5sb2ciLCJMb2NhbFN0b3JhZ2VMb2dnZXIuYWxsRW50cmllcyJdLCJtYXBwaW5ncyI6IkFBR0EsaUNBQStCLDJCQUEyQixDQUFDLENBQUE7QUFFM0Q7OztHQUdHO0FBQ0g7SUFHRUE7Ozs7T0FJR0E7SUFDSEEsNEJBQVlBLE1BQXdDQSxFQUFVQSxXQUFvQkE7UUFBcEJDLGdCQUFXQSxHQUFYQSxXQUFXQSxDQUFTQTtRQUNoRkEsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsSUFBSUEsbUNBQWdCQSxDQUFZQTtZQUM1Q0EsU0FBU0EsRUFBRUEsTUFBTUEsQ0FBQ0EsT0FBT0E7WUFDekJBLGNBQWNBLEVBQUVBLE1BQU1BLENBQUNBLGlCQUFpQkE7U0FDekNBLENBQUNBLENBQUNBO0lBQ0xBLENBQUNBO0lBRUREOztPQUVHQTtJQUNIQSxnQ0FBR0EsR0FBSEEsVUFBSUEsS0FBZ0JBO1FBQ2xCRSxJQUFJQSxDQUFDQTtZQUNIQSxJQUFNQSxJQUFJQSxHQUFHQSxJQUFJQSxJQUFJQSxFQUFFQSxDQUFDQTtZQUN4QkEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFDN0JBLENBQUVBO1FBQUFBLEtBQUtBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO1lBQ2ZBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLGlDQUFpQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFDMURBLENBQUNBO2dCQUFTQSxDQUFDQTtZQUNUQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUM5QkEsQ0FBQ0E7SUFDSEEsQ0FBQ0E7SUFFREY7O09BRUdBO0lBQ0hBLHVDQUFVQSxHQUFWQTtRQUNFRyxJQUFNQSxPQUFPQSxHQUFHQSxJQUFJQSxLQUFLQSxFQUFhQSxDQUFDQTtRQUN2Q0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBQUEsS0FBS0EsSUFBSUEsT0FBQUEsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsRUFBbkJBLENBQW1CQSxDQUFDQSxDQUFDQTtRQUNsREEsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7SUFDakJBLENBQUNBO0lBQ0hILHlCQUFDQTtBQUFEQSxDQXJDQSxBQXFDQ0EsSUFBQTtBQXJDWSwwQkFBa0IscUJBcUM5QixDQUFBIiwiZmlsZSI6ImxvZ2dlcnMvTG9jYWxTdG9yYWdlTG9nZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJTG9nZ2VyfSBmcm9tICcuL0lMb2dnZXInO1xuaW1wb3J0IHtJTG9nRW50cnl9IGZyb20gJy4uL2NvcmUvSUxvZ0VudHJ5JztcbmltcG9ydCB7SUxvY2FsU3RvcmFnZUxvZ2dlckNvbmZpZ3VyYXRpb259IGZyb20gJy4vSUxvY2FsU3RvcmFnZUxvZ2dlckNvbmZpZ3VyYXRpb24nO1xuaW1wb3J0IHtMaW1pdGVkU2l6ZVF1ZXVlfSBmcm9tICcuLi9xdWV1ZS9MaW1pdGVkU2l6ZVF1ZXVlJztcblxuLyoqXG4gKiBMb2dnZXIgdGhhdCBsb2dzIHRvIGEgcXVldWUgaW4gbG9jYWwgc3RvcmFnZS4gV2lsbCBvdmVyd3JpdGUgb2xkZXN0IGVudHJpZXNcbiAqIHdoZW4gZGVzaXJlZCBzaXplIGlzIGV4Y2VlZGVkLlxuICovXG5leHBvcnQgY2xhc3MgTG9jYWxTdG9yYWdlTG9nZ2VyIGltcGxlbWVudHMgSUxvZ2dlciB7XG4gIHByaXZhdGUgX3F1ZXVlOiBMaW1pdGVkU2l6ZVF1ZXVlPElMb2dFbnRyeT47XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgbG9jYWwgc3RvcmFnZSBsb2dnZXIuXG4gICAqIEBwYXJhbSBjb25maWcgVGhlIGNvbmZpZ3VyYXRpb24gZGVmaW5pbmcgdGhlIHVuaXF1ZSBxdWV1ZSBuYW1lLCBkZXNpcmVkIHNpemUgZXRjLlxuICAgKiBAcGFyYW0gX25leHRMb2dnZXIgVGhlIG5leHQgbG9nZ2VyIGluIHRoZSBcImxvZyBjaGFpblwiXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb25maWc6IElMb2NhbFN0b3JhZ2VMb2dnZXJDb25maWd1cmF0aW9uLCBwcml2YXRlIF9uZXh0TG9nZ2VyOiBJTG9nZ2VyKSB7XG4gICAgdGhpcy5fcXVldWUgPSBuZXcgTGltaXRlZFNpemVRdWV1ZTxJTG9nRW50cnk+KHtcbiAgICAgIGtleVByZWZpeDogY29uZmlnLmxvZ05hbWUsXG4gICAgICBtYXhTaXplSW5CeXRlczogY29uZmlnLm1heExvZ1NpemVJbkJ5dGVzXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTG9ncyBhbiBlbnRyeSB0byBsb2NhbCBzdG9yYWdlLlxuICAgKi9cbiAgbG9nKGVudHJ5OiBJTG9nRW50cnkpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgdGltZSA9IG5ldyBEYXRlKCk7XG4gICAgICB0aGlzLl9xdWV1ZS5lbnF1ZXVlKGVudHJ5KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGxvZyB0byBsb2NhbCBzdG9yYWdlLicsIGVycm9yKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5fbmV4dExvZ2dlci5sb2coZW50cnkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFsbCBsb2cgZW50cmllcyB0aGF0IGFyZSBzdGlsbCBoZWxkIGluIGxvY2FsIHN0b3JhZ2UuXG4gICAqL1xuICBhbGxFbnRyaWVzKCkgOiBBcnJheTxJTG9nRW50cnk+IHtcbiAgICBjb25zdCBlbnRyaWVzID0gbmV3IEFycmF5PElMb2dFbnRyeT4oKTtcbiAgICB0aGlzLl9xdWV1ZS5pdGVyYXRlKGVudHJ5ID0+IGVudHJpZXMucHVzaChlbnRyeSkpO1xuICAgIHJldHVybiBlbnRyaWVzO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
