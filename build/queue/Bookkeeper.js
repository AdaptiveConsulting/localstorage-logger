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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1ZXVlL0Jvb2trZWVwZXIudHMiXSwibmFtZXMiOlsiQm9va2tlZXBlciIsIkJvb2trZWVwZXIuY29uc3RydWN0b3IiLCJCb29ra2VlcGVyLnN0b3JlIiwiQm9va2tlZXBlci5yZXNldCIsIkJvb2trZWVwZXIuaXNFbXB0eSIsIkJvb2trZWVwZXIucmVtYWluaW5nU3BhY2UiLCJCb29ra2VlcGVyLmNyZWF0ZU5leHROb2RlIiwiQm9va2tlZXBlci5kZWxldGVGaXJzdE5vZGUiLCJCb29ra2VlcGVyLml0ZXJhdGVJbmRleFZhbHVlcyIsIkJvb2trZWVwZXIuX25leHRJbmRleCJdLCJtYXBwaW5ncyI6IkFBQ0EscUJBQW1CLFFBQVEsQ0FBQyxDQUFBO0FBRzVCOzs7R0FHRztBQUNIO0lBS0VBOztPQUVHQTtJQUNIQSxvQkFBb0JBLE9BQTRCQTtRQUE1QkMsWUFBT0EsR0FBUEEsT0FBT0EsQ0FBcUJBO1FBQzlDQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxFQUFFQSxDQUFDQTtRQUNqQkEsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsRUFBRUEsQ0FBQ0E7SUFDckJBLENBQUNBO0lBRUREOztPQUVHQTtJQUNIQSwwQkFBS0EsR0FBTEE7UUFDRUUsSUFBSUEsQ0FBQ0E7WUFDSEEsSUFBTUEsY0FBY0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7WUFDbERBLG1EQUFtREE7WUFDbkRBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE9BQU9BLENBQUNBLFVBQUFBLElBQUlBLElBQUlBLE9BQUFBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLEVBQWJBLENBQWFBLENBQUNBLENBQUNBO1lBQzdDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFBQSxJQUFJQSxJQUFJQSxPQUFBQSxJQUFJQSxDQUFDQSxLQUFLQSxFQUFFQSxFQUFaQSxDQUFZQSxDQUFDQSxDQUFDQTtZQUMxQ0EsWUFB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L0NBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBQ3pCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNkQSxDQUFDQTtJQUVEUDs7O09BR0dBO0lBQ0hBLHVDQUFrQkEsR0FBbEJBLFVBQW1CQSxRQUFnQ0E7UUFDakRRLEdBQUdBLENBQUFBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBLEtBQUtBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLGFBQWFBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBO1lBQzFGQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNkQSxDQUFDQTtJQUNIQSxDQUFDQTtJQUVEUjs7O09BR0dBO0lBQ0hBLCtCQUFVQSxHQUFWQSxVQUFXQSxLQUFhQTtRQUN0QlMsSUFBTUEsZ0JBQWdCQSxHQUFHQSxnQkFBZ0JBLENBQUNBO1FBQzFDQSxNQUFNQSxDQUFDQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxnQkFBZ0JBLENBQUNBO0lBQ3hDQSxDQUFDQTtJQUNIVCxpQkFBQ0E7QUFBREEsQ0F6R0EsQUF5R0NBLElBQUE7QUF6R1ksa0JBQVUsYUF5R3RCLENBQUEiLCJmaWxlIjoicXVldWUvQm9va2tlZXBlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SVF1ZXVlQ29uZmlndXJhdGlvbn0gZnJvbSAnLi9JUXVldWVDb25maWd1cmF0aW9uJztcbmltcG9ydCB7Tm9kZX0gZnJvbSAnLi9Ob2RlJztcbmltcG9ydCB7SUJvb2trZWVwaW5nSW5mb30gZnJvbSAnLi9JQm9va2tlZXBpbmdJbmZvJztcblxuLyoqXG4gKiBUaGlzIGNsYXNzIGtlZXBzIHRyYWNrIG9mIHRoZSBzdGFydCwgZW5kIGFuZCBzaXplIG9mIHRoZSBxdWV1ZVxuICogc3RvcmVkIGluIGxvY2FsIHN0b3JhZ2UuIEl0IGFsbG93cyBub2RlcyB0byBiZSBjcmVhdGVkIGFuZCByZW1vdmVkLlxuICovIFxuZXhwb3J0IGNsYXNzIEJvb2trZWVwZXI8VD4ge1xuICBwcml2YXRlIF9pbmZvOiBJQm9va2tlZXBpbmdJbmZvOyBcbiAgcHJpdmF0ZSBfYWRkZWQ6IEFycmF5PE5vZGU8VD4+O1xuICBwcml2YXRlIF9yZW1vdmVkOiBBcnJheTxOb2RlPFQ+PjtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBCb29ra2VlcGVyIGZvciBhIHF1ZXVlLiBJdCBzaG91bGQgYmUgaW5pdGlhbGl6ZWQgdXNpbmcgcmVzZXQgbWV0aG9kLlxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfY29uZmlnOiBJUXVldWVDb25maWd1cmF0aW9uKSB7XG4gICAgdGhpcy5fYWRkZWQgPSBbXTtcbiAgICB0aGlzLl9yZW1vdmVkID0gW107XG4gIH1cblxuICAvKipcbiAgICogU3RvcmVzIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBxdWV1ZSB0byBsb2NhbCBzdG9yYWdlLlxuICAgKi9cbiAgc3RvcmUoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHNlcmlhbGl6ZWRJbmZvID0gSlNPTi5zdHJpbmdpZnkodGhpcy5faW5mbyk7XG4gICAgICAvLyBJZGVhbGx5IHRoaXMgd291bGQgYWxsIGJlIGluc2lkZSBhIHRyYW5zYWN0aW9uIHtcbiAgICAgIHRoaXMuX3JlbW92ZWQuZm9yRWFjaChub2RlID0+IG5vZGUucmVtb3ZlKCkpO1xuICAgICAgdGhpcy5fYWRkZWQuZm9yRWFjaChub2RlID0+IG5vZGUuc3RvcmUoKSk7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLl9jb25maWcua2V5UHJlZml4LCBzZXJpYWxpemVkSW5mbyk7XG4gICAgICAvLyB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuX2FkZGVkID0gW107XG4gICAgICB0aGlzLl9yZW1vdmVkID0gW107XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgc3RhcnQsIGVuZCBhbmQgc2l6ZSBjb3VudHMgdG8gd2hhdCB3YXMgbGFzdCBwZXJzaXN0ZWQgdG9cbiAgICogbG9jYWwgc3RvcmFnZS5cbiAgICovXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuX2FkZGVkID0gW107XG4gICAgdGhpcy5fcmVtb3ZlZCA9IFtdO1xuICAgIGNvbnN0IHNlcmlhbGl6ZWRJbmZvID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5fY29uZmlnLmtleVByZWZpeCk7XG4gICAgaWYgKHNlcmlhbGl6ZWRJbmZvID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX2luZm8gPSB7XG4gICAgICAgIHNpemVJbkJ5dGVzOiAwLFxuICAgICAgICBzdGFydEluZGV4OiAwLFxuICAgICAgICBuZXh0RnJlZUluZGV4OiAwXG4gICAgICB9O1xuICAgICAgdGhpcy5zdG9yZSgpOyBcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faW5mbyA9IEpTT04ucGFyc2Uoc2VyaWFsaXplZEluZm8pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHF1ZXVlIGhhcyBubyBlbGVtZW50cy5cbiAgICovXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2luZm8uc2l6ZUluQnl0ZXMgPiAwO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIHByb2plY3RlZCBmcmVlIHNwYWNlLiBUaGlzIHRha2VzIGludG8gYWNjb3VudCBtb2RpZmljYXRpb25zLlxuICAgKi9cbiAgcmVtYWluaW5nU3BhY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbmZpZy5tYXhTaXplSW5CeXRlcyAtIHRoaXMuX2luZm8uc2l6ZUluQnl0ZXM7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBub2RlIGF0IHRoZSBlbmQgb2YgdGhlIHF1ZXVlLlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHN0b3JlIGFzIGFuIGVsZW1lbnQgb2YgdGhlIHF1ZXVlLlxuICAgKi9cbiAgY3JlYXRlTmV4dE5vZGUodmFsdWU6IFQpIHtcbiAgICBjb25zdCBub2RlID0gbmV3IE5vZGU8VD4odGhpcy5fY29uZmlnLCB0aGlzLl9pbmZvLm5leHRGcmVlSW5kZXgsIHZhbHVlKTtcbiAgICB0aGlzLl9pbmZvLm5leHRGcmVlSW5kZXggPSB0aGlzLl9uZXh0SW5kZXgodGhpcy5faW5mby5uZXh0RnJlZUluZGV4KTtcbiAgICB0aGlzLl9pbmZvLnNpemVJbkJ5dGVzICs9IG5vZGUuZXN0aW1hdGVkU2l6ZSgpO1xuICAgIHRoaXMuX2FkZGVkLnB1c2gobm9kZSk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbmQgcmV0dXJucyB0aGUgZmlyc3Qgc3RvcmVkIG5vZGUuIFRoZSBjb25zdW1lciBzaG91bGQgY2hlY2sgdGhhdCB0aGVyZSBpcyBhIG5vZGUgdG8gcmVtb3ZlIGZpcnN0LlxuICAgKi9cbiAgZGVsZXRlRmlyc3ROb2RlKCkge1xuICAgIGNvbnN0IG5vZGUgPSBOb2RlLmZyb21Mb2NhbFN0b3JhZ2U8VD4odGhpcy5fY29uZmlnLCB0aGlzLl9pbmZvLnN0YXJ0SW5kZXgpO1xuICAgIHRoaXMuX2luZm8uc3RhcnRJbmRleCA9IHRoaXMuX25leHRJbmRleCh0aGlzLl9pbmZvLnN0YXJ0SW5kZXgpO1xuICAgIHRoaXMuX2luZm8uc2l6ZUluQnl0ZXMgLT0gbm9kZS5lc3RpbWF0ZWRTaXplKCk7XG4gICAgdGhpcy5fcmVtb3ZlZC5wdXNoKG5vZGUpO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGVzIHRocm91Z2ggdGhlIGluZGV4IHZhbHVlcyBvZiB0aGUgZWxlbWVudHMgaW4gdGhlIHF1ZXVlLiBUaGVzZSBjYW4gYmUgdXNlZCB0byByZXRyaWV2ZSB0aGUgZWxlbWVudHMuXG4gICAqIEBwYXJhbSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGludm9rZWQgb25jZSBmb3IgZWFjaCBpbmRleCB2YWx1ZSB1c2VkIGluIHRoZSBxdWV1ZS5cbiAgICovXG4gIGl0ZXJhdGVJbmRleFZhbHVlcyhjYWxsYmFjazogKGluZGV4Om51bWJlcikgPT4gdm9pZCkge1xuICAgIGZvcihsZXQgaSA9IHRoaXMuX2luZm8uc3RhcnRJbmRleDsgaSAhPT0gdGhpcy5faW5mby5uZXh0RnJlZUluZGV4OyBpID0gdGhpcy5fbmV4dEluZGV4KGkpKSB7XG4gICAgICBjYWxsYmFjayhpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbmV4dCBpbmRleCB2YWx1ZSAobW9kdWxvIE1BWF9TQUZFX0lOVEVHRVIpLlxuICAgKiBAcGFyYW0gaW5kZXggVGhlIHByZXZpb3VzIGluZGV4IHZhbHVlLlxuICAgKi9cbiAgX25leHRJbmRleChpbmRleDogbnVtYmVyKSB7XG4gICAgY29uc3QgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG4gICAgcmV0dXJuIChpbmRleCArIDEpICUgTUFYX1NBRkVfSU5URUdFUjtcbiAgfVxufVxuXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=