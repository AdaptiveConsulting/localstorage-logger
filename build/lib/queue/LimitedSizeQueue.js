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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9xdWV1ZS9MaW1pdGVkU2l6ZVF1ZXVlLnRzIl0sIm5hbWVzIjpbIkxpbWl0ZWRTaXplUXVldWUiLCJMaW1pdGVkU2l6ZVF1ZXVlLmNvbnN0cnVjdG9yIiwiTGltaXRlZFNpemVRdWV1ZS5lbnF1ZXVlIiwiTGltaXRlZFNpemVRdWV1ZS5kZXF1ZXVlIiwiTGltaXRlZFNpemVRdWV1ZS5pc0VtcHR5IiwiTGltaXRlZFNpemVRdWV1ZS5pdGVyYXRlIl0sIm1hcHBpbmdzIjoiQUFBQSxxQkFBbUIsUUFBUSxDQUFDLENBQUE7QUFDNUIsMkJBQXlCLGNBQWMsQ0FBQyxDQUFBO0FBR3hDOzs7R0FHRztBQUNIO0lBR0VBOzs7T0FHR0E7SUFDSEEsMEJBQW9CQSxPQUE0QkE7UUFBNUJDLFlBQU9BLEdBQVBBLE9BQU9BLENBQXFCQTtRQUM5Q0EsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsSUFBSUEsdUJBQVVBLENBQUlBLE9BQU9BLENBQUNBLENBQUNBO1FBQzlDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtJQUMzQkEsQ0FBQ0E7SUFFREQ7Ozs7T0FJR0E7SUFDSEEsa0NBQU9BLEdBQVBBLFVBQVFBLEtBQVFBO1FBQ2RFLElBQU1BLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLGNBQWNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1FBQ3BEQSxJQUFNQSxnQkFBZ0JBLEdBQUdBLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLENBQUNBO1FBQzlDQSxJQUFNQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxjQUFjQSxJQUFJQSxnQkFBZ0JBLENBQUNBO1FBQy9EQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNaQSxJQUFNQSxPQUFPQSxHQUFHQSw4REFBOERBLENBQUNBO1lBQy9FQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtZQUN2QkEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7WUFDekJBLE1BQU1BLElBQUlBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO1FBQzNCQSxDQUFDQTtRQUNEQSxJQUFNQSxjQUFjQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxjQUFjQSxFQUFFQSxDQUFDQTtRQUN6REEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsY0FBY0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO1FBQzNCQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNOQSxPQUFPQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxjQUFjQSxFQUFFQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQTtnQkFDN0NBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLGVBQWVBLEVBQUVBLENBQUNBO1lBQ3JDQSxDQUFDQTtZQUNEQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtRQUMzQkEsQ0FBQ0E7SUFDSEEsQ0FBQ0E7SUFFREY7OztPQUdHQTtJQUNIQSxrQ0FBT0EsR0FBUEE7UUFDRUcsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0E7WUFBQ0EsTUFBTUEsQ0FBQ0E7UUFDM0JBLElBQU1BLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLGVBQWVBLEVBQUVBLENBQUNBO1FBQ2hEQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtRQUN6QkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7SUFDcEJBLENBQUNBO0lBRURIOztPQUVHQTtJQUNIQSxrQ0FBT0EsR0FBUEE7UUFDRUksTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0E7SUFDcENBLENBQUNBO0lBRURKOztPQUVHQTtJQUNIQSxrQ0FBT0EsR0FBUEEsVUFBUUEsUUFBMkJBO1FBQW5DSyxpQkFLQ0E7UUFKQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxVQUFBQSxDQUFDQTtZQUNuQ0EsSUFBTUEsSUFBSUEsR0FBR0EsV0FBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFJQSxLQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFBQTtZQUN0REEsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFDdkJBLENBQUNBLENBQUNBLENBQUNBO0lBQ0xBLENBQUNBO0lBQ0hMLHVCQUFDQTtBQUFEQSxDQWpFQSxBQWlFQ0EsSUFBQTtBQWpFWSx3QkFBZ0IsbUJBaUU1QixDQUFBIiwiZmlsZSI6ImxpYi9xdWV1ZS9MaW1pdGVkU2l6ZVF1ZXVlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOb2RlfSBmcm9tICcuL05vZGUnO1xuaW1wb3J0IHtCb29ra2VlcGVyfSBmcm9tICcuL0Jvb2trZWVwZXInO1xuaW1wb3J0IHtJUXVldWVDb25maWd1cmF0aW9ufSBmcm9tICcuL0lRdWV1ZUNvbmZpZ3VyYXRpb24nO1xuXG4vKipcbiAqIEEgbGltaXRlZC1zaXplIHF1ZXVlIHRoYXQgaXMgcGVyc2lzdGVkIHRvIGxvY2FsIHN0b3JhZ2UuIEVucXVldWluZ1xuICogZWxlbWVudHMgY2FuIHJlbW92ZSB0aGUgb2xkZXN0IGVsZW1lbnRzIGluIG9yZGVyIHRvIGZyZWUgdXAgc3BhY2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBMaW1pdGVkU2l6ZVF1ZXVlPFQ+IHtcbiAgcHJpdmF0ZSBfYm9va2tlZXBlcjogQm9va2tlZXBlcjxUPjtcblxuICAvKipcbiAgICogQ3JlYXRlcy9yZXN0b3JlcyBhIHF1ZXVlIGJhc2VkIG9uIHRoZSBjb25maWd1cmF0aW9uIHByb3ZpZGVkLlxuICAgKiBAcGFyYW0gX2NvbmZpZyBUaGUgc2V0dGluZ3MgZm9yIHRoZSBxdWV1ZVxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfY29uZmlnOiBJUXVldWVDb25maWd1cmF0aW9uKSB7XG4gICAgdGhpcy5fYm9va2tlZXBlciA9IG5ldyBCb29ra2VlcGVyPFQ+KF9jb25maWcpO1xuICAgIHRoaXMuX2Jvb2trZWVwZXIucmVzZXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbnF1ZXVlcyBhbiBpdGVtIGluIHRoZSBxdWV1ZS4gVGhyb3dzIGlmIHRoZSB2YWx1ZSBpcyB0b28gYmlnIHRvIGZpdCBpbiBsb2NhbCBzdG9yYWdlXG4gICAqIGJhc2VkIG9uIHRoZSBtYXhpbXVtIHNpemVkIGRlZmluZWQgaW4gdGhlIHF1ZXVlIGNvbmZpZ3VyYXRpb24uIE1heSBhbHNvIHRocm93XG4gICAqIGlmIGxvY2FsIHN0b3JhZ2UgaXMgb3V0IG9mIHNwYWNlIG9yIGNvcnJ1cHRlZC5cbiAgICovXG4gIGVucXVldWUodmFsdWU6IFQpIDogdm9pZCB7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuX2Jvb2trZWVwZXIuY3JlYXRlTmV4dE5vZGUodmFsdWUpO1xuICAgIGNvbnN0IHNwYWNlUmVxdWlyZW1lbnQgPSBub2RlLmVzdGltYXRlZFNpemUoKTtcbiAgICBjb25zdCBjYW5GaXQgPSB0aGlzLl9jb25maWcubWF4U2l6ZUluQnl0ZXMgPj0gc3BhY2VSZXF1aXJlbWVudDtcbiAgICBpZiAoIWNhbkZpdCkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9ICdMU0w6IFZhbHVlIGlzIHRvbyBiaWcgdG8gc3RvcmUuIFJldmVydGluZyB0byBwcmV2aW91cyBzdGF0ZS4nO1xuICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICAgIHRoaXMuX2Jvb2trZWVwZXIucmVzZXQoKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gICAgY29uc3QgcmVtYWluaW5nU3BhY2UgPSB0aGlzLl9ib29ra2VlcGVyLnJlbWFpbmluZ1NwYWNlKCk7XG4gICAgaWYgKHJlbWFpbmluZ1NwYWNlID49IDApIHtcbiAgICAgIHRoaXMuX2Jvb2trZWVwZXIuc3RvcmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2hpbGUgKHRoaXMuX2Jvb2trZWVwZXIucmVtYWluaW5nU3BhY2UoKSA8IDApIHtcbiAgICAgICAgdGhpcy5fYm9va2tlZXBlci5kZWxldGVGaXJzdE5vZGUoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2Jvb2trZWVwZXIuc3RvcmUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhlIHF1ZXVlIGhhcyBhdCBsZWFzdCAxIGl0ZW0sIGl0IHJlbW92ZXMgYW5kIHJldHVybnMgdGhlIG9sZGVzdCBpdGVtIGZyb20gdGhlIHF1ZXVlLlxuICAgKiBPdGhlcndpc2UsIGl0IHdpbGwgcmV0dXJuIG5vdGhpbmcuXG4gICAqL1xuICBkZXF1ZXVlKCkgOiBUIHwgdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNFbXB0eSgpKSByZXR1cm47XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuX2Jvb2trZWVwZXIuZGVsZXRlRmlyc3ROb2RlKCk7XG4gICAgdGhpcy5fYm9va2tlZXBlci5zdG9yZSgpO1xuICAgIHJldHVybiBub2RlLnZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgcXVldWUgaXMgZW1wdHkuXG4gICAqL1xuICBpc0VtcHR5KCkgOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYm9va2tlZXBlci5pc0VtcHR5KCk7XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZXMgKHdpdGhvdXQgcmVtb3ZhbCkgdGhyb3VnaCBhbGwgaXRlbXMgc3RvcmVkIGluIHRoZSBxdWV1ZS5cbiAgICovXG4gIGl0ZXJhdGUoY2FsbGJhY2s6IChpdGVtOiBUKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5fYm9va2tlZXBlci5pdGVyYXRlSW5kZXhWYWx1ZXMoaSA9PiB7XG4gICAgICBjb25zdCBub2RlID0gTm9kZS5mcm9tTG9jYWxTdG9yYWdlPFQ+KHRoaXMuX2NvbmZpZywgaSlcbiAgICAgIGNhbGxiYWNrKG5vZGUudmFsdWUpO1xuICAgIH0pO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
