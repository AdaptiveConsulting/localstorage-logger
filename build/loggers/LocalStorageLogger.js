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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2dlcnMvTG9jYWxTdG9yYWdlTG9nZ2VyLnRzIl0sIm5hbWVzIjpbIkxvY2FsU3RvcmFnZUxvZ2dlciIsIkxvY2FsU3RvcmFnZUxvZ2dlci5jb25zdHJ1Y3RvciIsIkxvY2FsU3RvcmFnZUxvZ2dlci5sb2ciXSwibWFwcGluZ3MiOiJBQUdBLGlDQUErQiwyQkFBMkIsQ0FBQyxDQUFBO0FBRTNEOzs7R0FHRztBQUNIO0lBR0VBOzs7O09BSUdBO0lBQ0hBLDRCQUFZQSxNQUF3Q0EsRUFBVUEsV0FBb0JBO1FBQXBCQyxnQkFBV0EsR0FBWEEsV0FBV0EsQ0FBU0E7UUFDaEZBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLG1DQUFnQkEsQ0FBWUE7WUFDNUNBLFNBQVNBLEVBQUVBLE1BQU1BLENBQUNBLE9BQU9BO1lBQ3pCQSxjQUFjQSxFQUFFQSxNQUFNQSxDQUFDQSxpQkFBaUJBO1NBQ3pDQSxDQUFDQSxDQUFDQTtJQUNMQSxDQUFDQTtJQUVERDs7T0FFR0E7SUFDSEEsZ0NBQUdBLEdBQUhBLFVBQUlBLEtBQWdCQTtRQUNsQkUsSUFBSUEsQ0FBQ0E7WUFDSEEsSUFBTUEsSUFBSUEsR0FBR0EsSUFBSUEsSUFBSUEsRUFBRUEsQ0FBQ0E7WUFDeEJBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1FBQzdCQSxDQUFFQTtRQUFBQSxLQUFLQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNmQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxpQ0FBaUNBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO1FBQzFEQSxDQUFDQTtnQkFBU0EsQ0FBQ0E7WUFDVEEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFDOUJBLENBQUNBO0lBQ0hBLENBQUNBO0lBQ0hGLHlCQUFDQTtBQUFEQSxDQTVCQSxBQTRCQ0EsSUFBQTtBQTVCWSwwQkFBa0IscUJBNEI5QixDQUFBIiwiZmlsZSI6ImxvZ2dlcnMvTG9jYWxTdG9yYWdlTG9nZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJTG9nZ2VyfSBmcm9tICcuL0lMb2dnZXInO1xuaW1wb3J0IHtJTG9nRW50cnl9IGZyb20gJy4uL2NvcmUvSUxvZ0VudHJ5JztcbmltcG9ydCB7SUxvY2FsU3RvcmFnZUxvZ2dlckNvbmZpZ3VyYXRpb259IGZyb20gJy4vSUxvY2FsU3RvcmFnZUxvZ2dlckNvbmZpZ3VyYXRpb24nO1xuaW1wb3J0IHtMaW1pdGVkU2l6ZVF1ZXVlfSBmcm9tICcuLi9xdWV1ZS9MaW1pdGVkU2l6ZVF1ZXVlJztcblxuLyoqXG4gKiBMb2dnZXIgdGhhdCBsb2dzIHRvIGEgcXVldWUgaW4gbG9jYWwgc3RvcmFnZS4gV2lsbCBvdmVyd3JpdGUgb2xkZXN0IGVudHJpZXNcbiAqIHdoZW4gZGVzaXJlZCBzaXplIGlzIGV4Y2VlZGVkLlxuICovXG5leHBvcnQgY2xhc3MgTG9jYWxTdG9yYWdlTG9nZ2VyIGltcGxlbWVudHMgSUxvZ2dlciB7XG4gIHByaXZhdGUgX3F1ZXVlOiBMaW1pdGVkU2l6ZVF1ZXVlPElMb2dFbnRyeT47XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgbG9jYWwgc3RvcmFnZSBsb2dnZXIuXG4gICAqIEBwYXJhbSBjb25maWcgVGhlIGNvbmZpZ3VyYXRpb24gZGVmaW5pbmcgdGhlIHVuaXF1ZSBxdWV1ZSBuYW1lLCBkZXNpcmVkIHNpemUgZXRjLlxuICAgKiBAcGFyYW0gX25leHRMb2dnZXIgVGhlIG5leHQgbG9nZ2VyIGluIHRoZSBcImxvZyBjaGFpblwiXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb25maWc6IElMb2NhbFN0b3JhZ2VMb2dnZXJDb25maWd1cmF0aW9uLCBwcml2YXRlIF9uZXh0TG9nZ2VyOiBJTG9nZ2VyKSB7XG4gICAgdGhpcy5fcXVldWUgPSBuZXcgTGltaXRlZFNpemVRdWV1ZTxJTG9nRW50cnk+KHtcbiAgICAgIGtleVByZWZpeDogY29uZmlnLmxvZ05hbWUsXG4gICAgICBtYXhTaXplSW5CeXRlczogY29uZmlnLm1heExvZ1NpemVJbkJ5dGVzXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTG9ncyBhbiBlbnRyeSB0byBsb2NhbCBzdG9yYWdlLlxuICAgKi9cbiAgbG9nKGVudHJ5OiBJTG9nRW50cnkpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgdGltZSA9IG5ldyBEYXRlKCk7XG4gICAgICB0aGlzLl9xdWV1ZS5lbnF1ZXVlKGVudHJ5KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGxvZyB0byBsb2NhbCBzdG9yYWdlLicsIGVycm9yKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5fbmV4dExvZ2dlci5sb2coZW50cnkpO1xuICAgIH1cbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
