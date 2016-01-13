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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1ZXVlL05vZGUudHMiXSwibmFtZXMiOlsiTm9kZSIsIk5vZGUuY29uc3RydWN0b3IiLCJOb2RlLmVzdGltYXRlZFNpemUiLCJOb2RlLnN0b3JlIiwiTm9kZS5yZW1vdmUiLCJOb2RlLmNyZWF0ZUtleSIsIk5vZGUuZnJvbUxvY2FsU3RvcmFnZSJdLCJtYXBwaW5ncyI6IkFBRUE7OztHQUdHO0FBQ0g7SUFJRUE7Ozs7O09BS0dBO0lBQ0hBLGNBQVlBLE1BQTJCQSxFQUFFQSxLQUFhQSxFQUFTQSxLQUFRQTtRQUFSQyxVQUFLQSxHQUFMQSxLQUFLQSxDQUFHQTtRQUNyRUEsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFDMUNBLElBQUlBLENBQUNBLGVBQWVBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO0lBQy9DQSxDQUFDQTtJQUVERDs7T0FFR0E7SUFDSEEsNEJBQWFBLEdBQWJBO1FBQ0VFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO0lBQ3hEQSxDQUFDQTtJQUVERjs7T0FFR0E7SUFDSEEsb0JBQUtBLEdBQUxBO1FBQ0VHLFlBQVlBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO0lBQ3hEQSxDQUFDQTtJQUVESDs7T0FFR0E7SUFDSEEscUJBQU1BLEdBQU5BO1FBQ0VJLFlBQVlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0lBQ3JDQSxDQUFDQTtJQUVESjs7OztPQUlHQTtJQUNJQSxjQUFTQSxHQUFoQkEsVUFBaUJBLE1BQTJCQSxFQUFFQSxLQUFhQTtRQUN6REssTUFBTUEsQ0FBSUEsTUFBTUEsQ0FBQ0EsU0FBU0EsY0FBU0EsS0FBT0EsQ0FBQ0E7SUFDN0NBLENBQUNBO0lBRURMOzs7O09BSUdBO0lBQ0lBLHFCQUFnQkEsR0FBdkJBLFVBQTJCQSxNQUEyQkEsRUFBRUEsS0FBYUE7UUFDbkVNLElBQU1BLGNBQWNBLEdBQUdBLFlBQVlBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO1FBQzNFQSxJQUFNQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQTtRQUN6Q0EsTUFBTUEsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBSUEsTUFBTUEsRUFBRUEsS0FBS0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7SUFDM0NBLENBQUNBO0lBQ0hOLFdBQUNBO0FBQURBLENBdkRBLEFBdURDQSxJQUFBO0FBdkRZLFlBQUksT0F1RGhCLENBQUEiLCJmaWxlIjoicXVldWUvTm9kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SVF1ZXVlQ29uZmlndXJhdGlvbn0gZnJvbSAnLi9JUXVldWVDb25maWd1cmF0aW9uJztcblxuLyoqXG4gKiBFYWNoIG5vZGUgY29ycmVzcG9uZHMgdG8gYW4gZW50cnkgd2l0aGluIHRoZSBxdWV1ZS4gVGhpcyBoZWxwcyB3aXRoXG4gKiBzdG9yYWdlIGFuZCByZW1vdmFsIGZyb20gbG9jYWwgc3RvcmFnZS5cbiAqL1xuZXhwb3J0IGNsYXNzIE5vZGU8VD4ge1xuICBwcml2YXRlIF9rZXk6IHN0cmluZztcbiAgcHJpdmF0ZSBfc2VyaWFsaXplZE5vZGU6IHN0cmluZztcblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5vZGUgcmVwcmVzZW50aW5nIGFuIGVudHJ5IGluIHRoZSBxdWV1ZS5cbiAgICogQHBhcmFtIGNvbmZpZyBUaGUgcXVldWUgY29uZmlndXJhdGlvbi4gVGhpcyBpcyB1c2VkIHRvIHByb3ZpZGUgdGhlIHByZWZpeCBmb3IgdGhlIGtleS5cbiAgICogQHBhcmFtIGluZGV4IFRoZSBpbmRleCB3aXRoaW4gdGhlIHF1ZXVlXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgb2YgdGhlIGVudHJ5XG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb25maWc6IElRdWV1ZUNvbmZpZ3VyYXRpb24sIGluZGV4OiBudW1iZXIsIHB1YmxpYyB2YWx1ZTogVCkge1xuICAgIHRoaXMuX2tleSA9IE5vZGUuY3JlYXRlS2V5KGNvbmZpZywgaW5kZXgpO1xuICAgIHRoaXMuX3NlcmlhbGl6ZWROb2RlID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gZXN0aW1hdGUgb2YgdGhlIHNpemUgdGhpcyB3aWxsIHRha2UgdXAgaW4gbG9jYWwgc3RvcmFnZS5cbiAgICovXG4gIGVzdGltYXRlZFNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlcmlhbGl6ZWROb2RlLmxlbmd0aCArIHRoaXMuX2tleS5sZW5ndGg7XG4gIH1cblxuICAvKipcbiAgICogU3RvcmVzIHRoZSBzZXJpYWxpemVkIGVudHJ5IGluIGxvY2FsIHN0b3JhZ2UuXG4gICAqL1xuICBzdG9yZSgpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLl9rZXksIHRoaXMuX3NlcmlhbGl6ZWROb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSBlbnRyeSBmcm9tIGxvY2FsIHN0b3JhZ2UgaWYgaXQgZXhpc3RzLlxuICAgKi9cbiAgcmVtb3ZlKCkge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMuX2tleSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGtleSBmb3IgYW4gZW50cnkuXG4gICAqIEBwYXJhbSBjb25maWcgVGhlIGNvbmZpZ3VyYXRpb24gY29udGFpbmluZyB0aGUga2V5IHByZWZpeFxuICAgKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IG9mIHRoZSBlbnRyeSBpbiB0aGUgcXVldWVcbiAgICovXG4gIHN0YXRpYyBjcmVhdGVLZXkoY29uZmlnOiBJUXVldWVDb25maWd1cmF0aW9uLCBpbmRleDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIGAke2NvbmZpZy5rZXlQcmVmaXh9LWl0ZW0tJHtpbmRleH1gO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIGFuIGVudHJ5IGZyb20gbG9jYWwgc3RvcmFnZSBhbmQgZGVzZXJpYWxpemVzIGl0LiBSZXR1cm5zIHRoZSBhc3NvY2lhdGVkIG5vZGUuXG4gICAqIEBwYXJhbSBjb25maWcgVGhlIGNvbmZpZ3VyYXRpb24gY29udGFpbmluZyB0aGUga2V5IHByZWZpeFxuICAgKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IG9mIHRoZSBlbnRyeSBpbiB0aGUgcXVldWVcbiAgICovXG4gIHN0YXRpYyBmcm9tTG9jYWxTdG9yYWdlPFQ+KGNvbmZpZzogSVF1ZXVlQ29uZmlndXJhdGlvbiwgaW5kZXg6IG51bWJlcikge1xuICAgIGNvbnN0IHNlcmlhbGl6ZWROb2RlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oTm9kZS5jcmVhdGVLZXkoY29uZmlnLCBpbmRleCkpO1xuICAgIGNvbnN0IHZhbHVlID0gSlNPTi5wYXJzZShzZXJpYWxpemVkTm9kZSk7XG4gICAgcmV0dXJuIG5ldyBOb2RlPFQ+KGNvbmZpZywgaW5kZXgsIHZhbHVlKTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
