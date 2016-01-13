var Node_1 = require('./Node');
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
        var node = new Node_1.Node(this._config, this._info.nextFreeIndex, value);
        this._info.nextFreeIndex = this._nextIndex(this._info.nextFreeIndex);
        this._info.sizeInBytes += node.estimatedSize();
        this._added.push(node);
        return node;
    };
    /**
     * Removes and returns the first stored node. The consumer should check that there is a node to remove first.
     */
    Bookkeeper.prototype.deleteFirstNode = function () {
        var node = Node_1.Node.fromLocalStorage(this._config, this._info.startIndex);
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
exports.Bookkeeper = Bookkeeper;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9xdWV1ZS9Cb29ra2VlcGVyLnRzIl0sIm5hbWVzIjpbIkJvb2trZWVwZXIiLCJCb29ra2VlcGVyLmNvbnN0cnVjdG9yIiwiQm9va2tlZXBlci5zdG9yZSIsIkJvb2trZWVwZXIucmVzZXQiLCJCb29ra2VlcGVyLmlzRW1wdHkiLCJCb29ra2VlcGVyLnJlbWFpbmluZ1NwYWNlIiwiQm9va2tlZXBlci5jcmVhdGVOZXh0Tm9kZSIsIkJvb2trZWVwZXIuZGVsZXRlRmlyc3ROb2RlIiwiQm9va2tlZXBlci5pdGVyYXRlSW5kZXhWYWx1ZXMiLCJCb29ra2VlcGVyLl9uZXh0SW5kZXgiXSwibWFwcGluZ3MiOiJBQUVBLHFCQUFtQixRQUFRLENBQUMsQ0FBQTtBQUU1Qjs7O0dBR0c7QUFDSDtJQUtFQTs7T0FFR0E7SUFDSEEsb0JBQW9CQSxPQUE0QkE7UUFBNUJDLFlBQU9BLEdBQVBBLE9BQU9BLENBQXFCQTtRQUM5Q0EsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsRUFBRUEsQ0FBQ0E7UUFDakJBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLEVBQUVBLENBQUNBO0lBQ3JCQSxDQUFDQTtJQUVERDs7T0FFR0E7SUFDSEEsMEJBQUtBLEdBQUxBO1FBQ0VFLElBQUlBLENBQUNBO1lBQ0hBLElBQU1BLGNBQWNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1lBQ2xEQSxtREFBbURBO1lBQ25EQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFBQSxJQUFJQSxJQUFJQSxPQUFBQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxFQUFiQSxDQUFhQSxDQUFDQSxDQUFDQTtZQUM3Q0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBQUEsSUFBSUEsSUFBSUEsT0FBQUEsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsRUFBWkEsQ0FBWUEsQ0FBQ0EsQ0FBQ0E7WUFDMUNB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O1FBQy9DQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUN6QkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7SUFDZEEsQ0FBQ0E7SUFFRFA7OztPQUdHQTtJQUNIQSx1Q0FBa0JBLEdBQWxCQSxVQUFtQkEsUUFBZ0NBO1FBQ2pEUSxHQUFHQSxDQUFBQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQSxLQUFLQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQTtZQUMxRkEsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDZEEsQ0FBQ0E7SUFDSEEsQ0FBQ0E7SUFFRFI7OztPQUdHQTtJQUNIQSwrQkFBVUEsR0FBVkEsVUFBV0EsS0FBYUE7UUFDdEJTLElBQU1BLGdCQUFnQkEsR0FBR0EsZ0JBQWdCQSxDQUFDQTtRQUMxQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsZ0JBQWdCQSxDQUFDQTtJQUN4Q0EsQ0FBQ0E7SUFDSFQsaUJBQUNBO0FBQURBLENBekdBLEFBeUdDQSxJQUFBO0FBekdZLGtCQUFVLGFBeUd0QixDQUFBIiwiZmlsZSI6ImxpYi9xdWV1ZS9Cb29ra2VlcGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJUXVldWVDb25maWd1cmF0aW9ufSBmcm9tICcuL0lRdWV1ZUNvbmZpZ3VyYXRpb24nO1xuaW1wb3J0IHtJQm9va2tlZXBpbmdJbmZvfSBmcm9tICcuL0lCb29ra2VlcGluZ0luZm8nO1xuaW1wb3J0IHtOb2RlfSBmcm9tICcuL05vZGUnO1xuXG4vKipcbiAqIFRoaXMgY2xhc3Mga2VlcHMgdHJhY2sgb2YgdGhlIHN0YXJ0LCBlbmQgYW5kIHNpemUgb2YgdGhlIHF1ZXVlXG4gKiBzdG9yZWQgaW4gbG9jYWwgc3RvcmFnZS4gSXQgYWxsb3dzIG5vZGVzIHRvIGJlIGNyZWF0ZWQgYW5kIHJlbW92ZWQuXG4gKi8gXG5leHBvcnQgY2xhc3MgQm9va2tlZXBlcjxUPiB7XG4gIHByaXZhdGUgX2luZm86IElCb29ra2VlcGluZ0luZm87IFxuICBwcml2YXRlIF9hZGRlZDogQXJyYXk8Tm9kZTxUPj47XG4gIHByaXZhdGUgX3JlbW92ZWQ6IEFycmF5PE5vZGU8VD4+O1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IEJvb2trZWVwZXIgZm9yIGEgcXVldWUuIEl0IHNob3VsZCBiZSBpbml0aWFsaXplZCB1c2luZyByZXNldCBtZXRob2QuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jb25maWc6IElRdWV1ZUNvbmZpZ3VyYXRpb24pIHtcbiAgICB0aGlzLl9hZGRlZCA9IFtdO1xuICAgIHRoaXMuX3JlbW92ZWQgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9yZXMgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHF1ZXVlIHRvIGxvY2FsIHN0b3JhZ2UuXG4gICAqL1xuICBzdG9yZSgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgc2VyaWFsaXplZEluZm8gPSBKU09OLnN0cmluZ2lmeSh0aGlzLl9pbmZvKTtcbiAgICAgIC8vIElkZWFsbHkgdGhpcyB3b3VsZCBhbGwgYmUgaW5zaWRlIGEgdHJhbnNhY3Rpb24ge1xuICAgICAgdGhpcy5fcmVtb3ZlZC5mb3JFYWNoKG5vZGUgPT4gbm9kZS5yZW1vdmUoKSk7XG4gICAgICB0aGlzLl9hZGRlZC5mb3JFYWNoKG5vZGUgPT4gbm9kZS5zdG9yZSgpKTtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuX2NvbmZpZy5rZXlQcmVmaXgsIHNlcmlhbGl6ZWRJbmZvKTtcbiAgICAgIC8vIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5fYWRkZWQgPSBbXTtcbiAgICAgIHRoaXMuX3JlbW92ZWQgPSBbXTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBzdGFydCwgZW5kIGFuZCBzaXplIGNvdW50cyB0byB3aGF0IHdhcyBsYXN0IHBlcnNpc3RlZCB0b1xuICAgKiBsb2NhbCBzdG9yYWdlLlxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5fYWRkZWQgPSBbXTtcbiAgICB0aGlzLl9yZW1vdmVkID0gW107XG4gICAgY29uc3Qgc2VyaWFsaXplZEluZm8gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLl9jb25maWcua2V5UHJlZml4KTtcbiAgICBpZiAoc2VyaWFsaXplZEluZm8gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5faW5mbyA9IHtcbiAgICAgICAgc2l6ZUluQnl0ZXM6IDAsXG4gICAgICAgIHN0YXJ0SW5kZXg6IDAsXG4gICAgICAgIG5leHRGcmVlSW5kZXg6IDBcbiAgICAgIH07XG4gICAgICB0aGlzLnN0b3JlKCk7IFxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9pbmZvID0gSlNPTi5wYXJzZShzZXJpYWxpemVkSW5mbyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgcXVldWUgaGFzIG5vIGVsZW1lbnRzLlxuICAgKi9cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5faW5mby5zaXplSW5CeXRlcyA+IDA7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgcHJvamVjdGVkIGZyZWUgc3BhY2UuIFRoaXMgdGFrZXMgaW50byBhY2NvdW50IG1vZGlmaWNhdGlvbnMuXG4gICAqL1xuICByZW1haW5pbmdTcGFjZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29uZmlnLm1heFNpemVJbkJ5dGVzIC0gdGhpcy5faW5mby5zaXplSW5CeXRlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IG5vZGUgYXQgdGhlIGVuZCBvZiB0aGUgcXVldWUuXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gc3RvcmUgYXMgYW4gZWxlbWVudCBvZiB0aGUgcXVldWUuXG4gICAqL1xuICBjcmVhdGVOZXh0Tm9kZSh2YWx1ZTogVCkge1xuICAgIGNvbnN0IG5vZGUgPSBuZXcgTm9kZTxUPih0aGlzLl9jb25maWcsIHRoaXMuX2luZm8ubmV4dEZyZWVJbmRleCwgdmFsdWUpO1xuICAgIHRoaXMuX2luZm8ubmV4dEZyZWVJbmRleCA9IHRoaXMuX25leHRJbmRleCh0aGlzLl9pbmZvLm5leHRGcmVlSW5kZXgpO1xuICAgIHRoaXMuX2luZm8uc2l6ZUluQnl0ZXMgKz0gbm9kZS5lc3RpbWF0ZWRTaXplKCk7XG4gICAgdGhpcy5fYWRkZWQucHVzaChub2RlKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuZCByZXR1cm5zIHRoZSBmaXJzdCBzdG9yZWQgbm9kZS4gVGhlIGNvbnN1bWVyIHNob3VsZCBjaGVjayB0aGF0IHRoZXJlIGlzIGEgbm9kZSB0byByZW1vdmUgZmlyc3QuXG4gICAqL1xuICBkZWxldGVGaXJzdE5vZGUoKSB7XG4gICAgY29uc3Qgbm9kZSA9IE5vZGUuZnJvbUxvY2FsU3RvcmFnZTxUPih0aGlzLl9jb25maWcsIHRoaXMuX2luZm8uc3RhcnRJbmRleCk7XG4gICAgdGhpcy5faW5mby5zdGFydEluZGV4ID0gdGhpcy5fbmV4dEluZGV4KHRoaXMuX2luZm8uc3RhcnRJbmRleCk7XG4gICAgdGhpcy5faW5mby5zaXplSW5CeXRlcyAtPSBub2RlLmVzdGltYXRlZFNpemUoKTtcbiAgICB0aGlzLl9yZW1vdmVkLnB1c2gobm9kZSk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZXMgdGhyb3VnaCB0aGUgaW5kZXggdmFsdWVzIG9mIHRoZSBlbGVtZW50cyBpbiB0aGUgcXVldWUuIFRoZXNlIGNhbiBiZSB1c2VkIHRvIHJldHJpZXZlIHRoZSBlbGVtZW50cy5cbiAgICogQHBhcmFtIGNhbGxiYWNrIFRoZSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgaW52b2tlZCBvbmNlIGZvciBlYWNoIGluZGV4IHZhbHVlIHVzZWQgaW4gdGhlIHF1ZXVlLlxuICAgKi9cbiAgaXRlcmF0ZUluZGV4VmFsdWVzKGNhbGxiYWNrOiAoaW5kZXg6bnVtYmVyKSA9PiB2b2lkKSB7XG4gICAgZm9yKGxldCBpID0gdGhpcy5faW5mby5zdGFydEluZGV4OyBpICE9PSB0aGlzLl9pbmZvLm5leHRGcmVlSW5kZXg7IGkgPSB0aGlzLl9uZXh0SW5kZXgoaSkpIHtcbiAgICAgIGNhbGxiYWNrKGkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBuZXh0IGluZGV4IHZhbHVlIChtb2R1bG8gTUFYX1NBRkVfSU5URUdFUikuXG4gICAqIEBwYXJhbSBpbmRleCBUaGUgcHJldmlvdXMgaW5kZXggdmFsdWUuXG4gICAqL1xuICBfbmV4dEluZGV4KGluZGV4OiBudW1iZXIpIHtcbiAgICBjb25zdCBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcbiAgICByZXR1cm4gKGluZGV4ICsgMSkgJSBNQVhfU0FGRV9JTlRFR0VSO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=