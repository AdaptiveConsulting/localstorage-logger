/**
 * A logger that doesn't actually do anything. Used for terminating a chain of loggers.
 */
var NullLogger = (function () {
    /**
     * Constructs a no-op logger.
     */
    function NullLogger() {
    }
    /**
     * No-op
     */
    NullLogger.prototype.log = function (level, message) {
    };
    return NullLogger;
})();
exports.NullLogger = NullLogger;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2dlcnMvTnVsbExvZ2dlci50cyJdLCJuYW1lcyI6WyJOdWxsTG9nZ2VyIiwiTnVsbExvZ2dlci5jb25zdHJ1Y3RvciIsIk51bGxMb2dnZXIubG9nIl0sIm1hcHBpbmdzIjoiQUFFQTs7R0FFRztBQUNIO0lBQ0VBOztPQUVHQTtJQUNIQTtJQUFnQkMsQ0FBQ0E7SUFFakJEOztPQUVHQTtJQUNIQSx3QkFBR0EsR0FBSEEsVUFBSUEsS0FBS0EsRUFBRUEsT0FBT0E7SUFDbEJFLENBQUNBO0lBQ0hGLGlCQUFDQTtBQUFEQSxDQVhBLEFBV0NBLElBQUE7QUFYWSxrQkFBVSxhQVd0QixDQUFBIiwiZmlsZSI6ImxvZ2dlcnMvTnVsbExvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SUxvZ2dlcn0gZnJvbSAnLi9JTG9nZ2VyJztcblxuLyoqXG4gKiBBIGxvZ2dlciB0aGF0IGRvZXNuJ3QgYWN0dWFsbHkgZG8gYW55dGhpbmcuIFVzZWQgZm9yIHRlcm1pbmF0aW5nIGEgY2hhaW4gb2YgbG9nZ2Vycy5cbiAqL1xuZXhwb3J0IGNsYXNzIE51bGxMb2dnZXIgaW1wbGVtZW50cyBJTG9nZ2VyIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuby1vcCBsb2dnZXIuXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIC8qKlxuICAgKiBOby1vcFxuICAgKi9cbiAgbG9nKGxldmVsLCBtZXNzYWdlKSB7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
