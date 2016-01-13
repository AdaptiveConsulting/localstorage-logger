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
exports.Node = Node;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9xdWV1ZS9Ob2RlLnRzIl0sIm5hbWVzIjpbIk5vZGUiLCJOb2RlLmNvbnN0cnVjdG9yIiwiTm9kZS5lc3RpbWF0ZWRTaXplIiwiTm9kZS5zdG9yZSIsIk5vZGUucmVtb3ZlIiwiTm9kZS5jcmVhdGVLZXkiLCJOb2RlLmZyb21Mb2NhbFN0b3JhZ2UiXSwibWFwcGluZ3MiOiJBQUVBOzs7R0FHRztBQUNIO0lBSUVBOzs7OztPQUtHQTtJQUNIQSxjQUFZQSxNQUEyQkEsRUFBRUEsS0FBYUEsRUFBU0EsS0FBUUE7UUFBUkMsVUFBS0EsR0FBTEEsS0FBS0EsQ0FBR0E7UUFDckVBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO1FBQzFDQSxJQUFJQSxDQUFDQSxlQUFlQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtJQUMvQ0EsQ0FBQ0E7SUFFREQ7O09BRUdBO0lBQ0hBLDRCQUFhQSxHQUFiQTtRQUNFRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtJQUN4REEsQ0FBQ0E7SUFFREY7O09BRUdBO0lBQ0hBLG9CQUFLQSxHQUFMQTtRQUNFRyxZQUFZQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQTtJQUN4REEsQ0FBQ0E7SUFFREg7O09BRUdBO0lBQ0hBLHFCQUFNQSxHQUFOQTtRQUNFSSxZQUFZQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtJQUNyQ0EsQ0FBQ0E7SUFFREo7Ozs7T0FJR0E7SUFDSUEsY0FBU0EsR0FBaEJBLFVBQWlCQSxNQUEyQkEsRUFBRUEsS0FBYUE7UUFDekRLLE1BQU1BLENBQUlBLE1BQU1BLENBQUNBLFNBQVNBLGNBQVNBLEtBQU9BLENBQUNBO0lBQzdDQSxDQUFDQTtJQUVETDs7OztPQUlHQTtJQUNJQSxxQkFBZ0JBLEdBQXZCQSxVQUEyQkEsTUFBMkJBLEVBQUVBLEtBQWFBO1FBQ25FTSxJQUFNQSxjQUFjQSxHQUFHQSxZQUFZQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUMzRUEsSUFBTUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0E7UUFDekNBLE1BQU1BLENBQUNBLElBQUlBLElBQUlBLENBQUlBLE1BQU1BLEVBQUVBLEtBQUtBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO0lBQzNDQSxDQUFDQTtJQUNITixXQUFDQTtBQUFEQSxDQXZEQSxBQXVEQ0EsSUFBQTtBQXZEWSxZQUFJLE9BdURoQixDQUFBIiwiZmlsZSI6ImxpYi9xdWV1ZS9Ob2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJUXVldWVDb25maWd1cmF0aW9ufSBmcm9tICcuL0lRdWV1ZUNvbmZpZ3VyYXRpb24nO1xuXG4vKipcbiAqIEVhY2ggbm9kZSBjb3JyZXNwb25kcyB0byBhbiBlbnRyeSB3aXRoaW4gdGhlIHF1ZXVlLiBUaGlzIGhlbHBzIHdpdGhcbiAqIHN0b3JhZ2UgYW5kIHJlbW92YWwgZnJvbSBsb2NhbCBzdG9yYWdlLlxuICovXG5leHBvcnQgY2xhc3MgTm9kZTxUPiB7XG4gIHByaXZhdGUgX2tleTogc3RyaW5nO1xuICBwcml2YXRlIF9zZXJpYWxpemVkTm9kZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbm9kZSByZXByZXNlbnRpbmcgYW4gZW50cnkgaW4gdGhlIHF1ZXVlLlxuICAgKiBAcGFyYW0gY29uZmlnIFRoZSBxdWV1ZSBjb25maWd1cmF0aW9uLiBUaGlzIGlzIHVzZWQgdG8gcHJvdmlkZSB0aGUgcHJlZml4IGZvciB0aGUga2V5LlxuICAgKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IHdpdGhpbiB0aGUgcXVldWVcbiAgICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSBvZiB0aGUgZW50cnlcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogSVF1ZXVlQ29uZmlndXJhdGlvbiwgaW5kZXg6IG51bWJlciwgcHVibGljIHZhbHVlOiBUKSB7XG4gICAgdGhpcy5fa2V5ID0gTm9kZS5jcmVhdGVLZXkoY29uZmlnLCBpbmRleCk7XG4gICAgdGhpcy5fc2VyaWFsaXplZE5vZGUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBlc3RpbWF0ZSBvZiB0aGUgc2l6ZSB0aGlzIHdpbGwgdGFrZSB1cCBpbiBsb2NhbCBzdG9yYWdlLlxuICAgKi9cbiAgZXN0aW1hdGVkU2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VyaWFsaXplZE5vZGUubGVuZ3RoICsgdGhpcy5fa2V5Lmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9yZXMgdGhlIHNlcmlhbGl6ZWQgZW50cnkgaW4gbG9jYWwgc3RvcmFnZS5cbiAgICovXG4gIHN0b3JlKCkge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuX2tleSwgdGhpcy5fc2VyaWFsaXplZE5vZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIGVudHJ5IGZyb20gbG9jYWwgc3RvcmFnZSBpZiBpdCBleGlzdHMuXG4gICAqL1xuICByZW1vdmUoKSB7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5fa2V5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEga2V5IGZvciBhbiBlbnRyeS5cbiAgICogQHBhcmFtIGNvbmZpZyBUaGUgY29uZmlndXJhdGlvbiBjb250YWluaW5nIHRoZSBrZXkgcHJlZml4XG4gICAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIGVudHJ5IGluIHRoZSBxdWV1ZVxuICAgKi9cbiAgc3RhdGljIGNyZWF0ZUtleShjb25maWc6IElRdWV1ZUNvbmZpZ3VyYXRpb24sIGluZGV4OiBudW1iZXIpIHtcbiAgICByZXR1cm4gYCR7Y29uZmlnLmtleVByZWZpeH0taXRlbS0ke2luZGV4fWA7XG4gIH1cblxuICAvKipcbiAgICogTG9hZHMgYW4gZW50cnkgZnJvbSBsb2NhbCBzdG9yYWdlIGFuZCBkZXNlcmlhbGl6ZXMgaXQuIFJldHVybnMgdGhlIGFzc29jaWF0ZWQgbm9kZS5cbiAgICogQHBhcmFtIGNvbmZpZyBUaGUgY29uZmlndXJhdGlvbiBjb250YWluaW5nIHRoZSBrZXkgcHJlZml4XG4gICAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIGVudHJ5IGluIHRoZSBxdWV1ZVxuICAgKi9cbiAgc3RhdGljIGZyb21Mb2NhbFN0b3JhZ2U8VD4oY29uZmlnOiBJUXVldWVDb25maWd1cmF0aW9uLCBpbmRleDogbnVtYmVyKSB7XG4gICAgY29uc3Qgc2VyaWFsaXplZE5vZGUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShOb2RlLmNyZWF0ZUtleShjb25maWcsIGluZGV4KSk7XG4gICAgY29uc3QgdmFsdWUgPSBKU09OLnBhcnNlKHNlcmlhbGl6ZWROb2RlKTtcbiAgICByZXR1cm4gbmV3IE5vZGU8VD4oY29uZmlnLCBpbmRleCwgdmFsdWUpO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
