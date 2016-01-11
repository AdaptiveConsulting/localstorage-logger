var Node_1 = require('./Node');
var Bookkeeper_1 = require('./Bookkeeper');
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
        this._bookkeeper = new Bookkeeper_1.Bookkeeper(_config);
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
            var node = Node_1.Node.fromLocalStorage(_this._config, i);
            callback(node.value);
        });
    };
    return LimitedSizeQueue;
})();
exports.LimitedSizeQueue = LimitedSizeQueue;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1ZXVlL0xpbWl0ZWRTaXplUXVldWUudHMiXSwibmFtZXMiOlsiTGltaXRlZFNpemVRdWV1ZSIsIkxpbWl0ZWRTaXplUXVldWUuY29uc3RydWN0b3IiLCJMaW1pdGVkU2l6ZVF1ZXVlLmVucXVldWUiLCJMaW1pdGVkU2l6ZVF1ZXVlLmRlcXVldWUiLCJMaW1pdGVkU2l6ZVF1ZXVlLmlzRW1wdHkiLCJMaW1pdGVkU2l6ZVF1ZXVlLml0ZXJhdGUiXSwibWFwcGluZ3MiOiJBQUNBLHFCQUFtQixRQUFRLENBQUMsQ0FBQTtBQUM1QiwyQkFBeUIsY0FBYyxDQUFDLENBQUE7QUFFeEM7OztHQUdHO0FBQ0g7SUFHRUE7OztPQUdHQTtJQUNIQSwwQkFBb0JBLE9BQTRCQTtRQUE1QkMsWUFBT0EsR0FBUEEsT0FBT0EsQ0FBcUJBO1FBQzlDQSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxJQUFJQSx1QkFBVUEsQ0FBSUEsT0FBT0EsQ0FBQ0EsQ0FBQ0E7UUFDOUNBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO0lBQzNCQSxDQUFDQTtJQUVERDs7OztPQUlHQTtJQUNIQSxrQ0FBT0EsR0FBUEEsVUFBUUEsS0FBUUE7UUFDZEUsSUFBTUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsY0FBY0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFDcERBLElBQU1BLGdCQUFnQkEsR0FBR0EsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0E7UUFDOUNBLElBQU1BLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLGNBQWNBLElBQUlBLGdCQUFnQkEsQ0FBQ0E7UUFDL0RBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQ1pBLElBQU1BLE9BQU9BLEdBQUdBLDhEQUE4REEsQ0FBQ0E7WUFDL0VBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO1lBQ3ZCQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtZQUN6QkEsTUFBTUEsSUFBSUEsS0FBS0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7UUFDM0JBLENBQUNBO1FBQ0RBLElBQU1BLGNBQWNBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLGNBQWNBLEVBQUVBLENBQUNBO1FBQ3pEQSxFQUFFQSxDQUFDQSxDQUFDQSxjQUFjQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4QkEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7UUFDM0JBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ05BLE9BQU9BLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLGNBQWNBLEVBQUVBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBO2dCQUM3Q0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsZUFBZUEsRUFBRUEsQ0FBQ0E7WUFDckNBLENBQUNBO1lBQ0RBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO1FBQzNCQSxDQUFDQTtJQUNIQSxDQUFDQTtJQUVERjs7O09BR0dBO0lBQ0hBLGtDQUFPQSxHQUFQQTtRQUNFRyxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtZQUFDQSxNQUFNQSxDQUFDQTtRQUMzQkEsSUFBTUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsZUFBZUEsRUFBRUEsQ0FBQ0E7UUFDaERBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO1FBQ3pCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQTtJQUNwQkEsQ0FBQ0E7SUFFREg7O09BRUdBO0lBQ0hBLGtDQUFPQSxHQUFQQTtRQUNFSSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtJQUNwQ0EsQ0FBQ0E7SUFFREo7O09BRUdBO0lBQ0hBLGtDQUFPQSxHQUFQQSxVQUFRQSxRQUEyQkE7UUFBbkNLLGlCQUtDQTtRQUpDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxrQkFBa0JBLENBQUNBLFVBQUFBLENBQUNBO1lBQ25DQSxJQUFNQSxJQUFJQSxHQUFHQSxXQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUlBLEtBQUlBLENBQUNBLE9BQU9BLEVBQUVBLENBQUNBLENBQUNBLENBQUFBO1lBQ3REQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUN2QkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDTEEsQ0FBQ0E7SUFDSEwsdUJBQUNBO0FBQURBLENBakVBLEFBaUVDQSxJQUFBO0FBakVZLHdCQUFnQixtQkFpRTVCLENBQUEiLCJmaWxlIjoicXVldWUvTGltaXRlZFNpemVRdWV1ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SVF1ZXVlQ29uZmlndXJhdGlvbn0gZnJvbSAnLi9JUXVldWVDb25maWd1cmF0aW9uJztcbmltcG9ydCB7Tm9kZX0gZnJvbSAnLi9Ob2RlJztcbmltcG9ydCB7Qm9va2tlZXBlcn0gZnJvbSAnLi9Cb29ra2VlcGVyJztcblxuLyoqXG4gKiBBIGxpbWl0ZWQtc2l6ZSBxdWV1ZSB0aGF0IGlzIHBlcnNpc3RlZCB0byBsb2NhbCBzdG9yYWdlLiBFbnF1ZXVpbmdcbiAqIGVsZW1lbnRzIGNhbiByZW1vdmUgdGhlIG9sZGVzdCBlbGVtZW50cyBpbiBvcmRlciB0byBmcmVlIHVwIHNwYWNlLlxuICovXG5leHBvcnQgY2xhc3MgTGltaXRlZFNpemVRdWV1ZTxUPiB7XG4gIHByaXZhdGUgX2Jvb2trZWVwZXI6IEJvb2trZWVwZXI8VD47XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMvcmVzdG9yZXMgYSBxdWV1ZSBiYXNlZCBvbiB0aGUgY29uZmlndXJhdGlvbiBwcm92aWRlZC5cbiAgICogQHBhcmFtIF9jb25maWcgVGhlIHNldHRpbmdzIGZvciB0aGUgcXVldWVcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2NvbmZpZzogSVF1ZXVlQ29uZmlndXJhdGlvbikge1xuICAgIHRoaXMuX2Jvb2trZWVwZXIgPSBuZXcgQm9va2tlZXBlcjxUPihfY29uZmlnKTtcbiAgICB0aGlzLl9ib29ra2VlcGVyLnJlc2V0KCk7XG4gIH1cblxuICAvKipcbiAgICogRW5xdWV1ZXMgYW4gaXRlbSBpbiB0aGUgcXVldWUuIFRocm93cyBpZiB0aGUgdmFsdWUgaXMgdG9vIGJpZyB0byBmaXQgaW4gbG9jYWwgc3RvcmFnZVxuICAgKiBiYXNlZCBvbiB0aGUgbWF4aW11bSBzaXplZCBkZWZpbmVkIGluIHRoZSBxdWV1ZSBjb25maWd1cmF0aW9uLiBNYXkgYWxzbyB0aHJvd1xuICAgKiBpZiBsb2NhbCBzdG9yYWdlIGlzIG91dCBvZiBzcGFjZSBvciBjb3JydXB0ZWQuXG4gICAqL1xuICBlbnF1ZXVlKHZhbHVlOiBUKSA6IHZvaWQge1xuICAgIGNvbnN0IG5vZGUgPSB0aGlzLl9ib29ra2VlcGVyLmNyZWF0ZU5leHROb2RlKHZhbHVlKTtcbiAgICBjb25zdCBzcGFjZVJlcXVpcmVtZW50ID0gbm9kZS5lc3RpbWF0ZWRTaXplKCk7XG4gICAgY29uc3QgY2FuRml0ID0gdGhpcy5fY29uZmlnLm1heFNpemVJbkJ5dGVzID49IHNwYWNlUmVxdWlyZW1lbnQ7XG4gICAgaWYgKCFjYW5GaXQpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSAnTFNMOiBWYWx1ZSBpcyB0b28gYmlnIHRvIHN0b3JlLiBSZXZlcnRpbmcgdG8gcHJldmlvdXMgc3RhdGUuJztcbiAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gICAgICB0aGlzLl9ib29ra2VlcGVyLnJlc2V0KCk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICAgIGNvbnN0IHJlbWFpbmluZ1NwYWNlID0gdGhpcy5fYm9va2tlZXBlci5yZW1haW5pbmdTcGFjZSgpO1xuICAgIGlmIChyZW1haW5pbmdTcGFjZSA+PSAwKSB7XG4gICAgICB0aGlzLl9ib29ra2VlcGVyLnN0b3JlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdoaWxlICh0aGlzLl9ib29ra2VlcGVyLnJlbWFpbmluZ1NwYWNlKCkgPCAwKSB7XG4gICAgICAgIHRoaXMuX2Jvb2trZWVwZXIuZGVsZXRlRmlyc3ROb2RlKCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9ib29ra2VlcGVyLnN0b3JlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIElmIHRoZSBxdWV1ZSBoYXMgYXQgbGVhc3QgMSBpdGVtLCBpdCByZW1vdmVzIGFuZCByZXR1cm5zIHRoZSBvbGRlc3QgaXRlbSBmcm9tIHRoZSBxdWV1ZS5cbiAgICogT3RoZXJ3aXNlLCBpdCB3aWxsIHJldHVybiBub3RoaW5nLlxuICAgKi9cbiAgZGVxdWV1ZSgpIDogVCB8IHZvaWQge1xuICAgIGlmICh0aGlzLmlzRW1wdHkoKSkgcmV0dXJuO1xuICAgIGNvbnN0IG5vZGUgPSB0aGlzLl9ib29ra2VlcGVyLmRlbGV0ZUZpcnN0Tm9kZSgpO1xuICAgIHRoaXMuX2Jvb2trZWVwZXIuc3RvcmUoKTtcbiAgICByZXR1cm4gbm9kZS52YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHF1ZXVlIGlzIGVtcHR5LlxuICAgKi9cbiAgaXNFbXB0eSgpIDogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Jvb2trZWVwZXIuaXNFbXB0eSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGVzICh3aXRob3V0IHJlbW92YWwpIHRocm91Z2ggYWxsIGl0ZW1zIHN0b3JlZCBpbiB0aGUgcXVldWUuXG4gICAqL1xuICBpdGVyYXRlKGNhbGxiYWNrOiAoaXRlbTogVCkgPT4gdm9pZCkge1xuICAgIHRoaXMuX2Jvb2trZWVwZXIuaXRlcmF0ZUluZGV4VmFsdWVzKGkgPT4ge1xuICAgICAgY29uc3Qgbm9kZSA9IE5vZGUuZnJvbUxvY2FsU3RvcmFnZTxUPih0aGlzLl9jb25maWcsIGkpXG4gICAgICBjYWxsYmFjayhub2RlLnZhbHVlKTtcbiAgICB9KTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
