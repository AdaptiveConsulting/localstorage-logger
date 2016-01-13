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
    NullLogger.prototype.log = function (entry) {
    };
    return NullLogger;
})();
exports.NullLogger = NullLogger;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9sb2dnZXJzL051bGxMb2dnZXIudHMiXSwibmFtZXMiOlsiTnVsbExvZ2dlciIsIk51bGxMb2dnZXIuY29uc3RydWN0b3IiLCJOdWxsTG9nZ2VyLmxvZyJdLCJtYXBwaW5ncyI6IkFBRUE7O0dBRUc7QUFDSDtJQUNFQTs7T0FFR0E7SUFDSEE7SUFBZ0JDLENBQUNBO0lBRWpCRDs7T0FFR0E7SUFDSEEsd0JBQUdBLEdBQUhBLFVBQUlBLEtBQUtBO0lBQ1RFLENBQUNBO0lBQ0hGLGlCQUFDQTtBQUFEQSxDQVhBLEFBV0NBLElBQUE7QUFYWSxrQkFBVSxhQVd0QixDQUFBIiwiZmlsZSI6ImxpYi9sb2dnZXJzL051bGxMb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0lMb2dnZXJ9IGZyb20gJy4vSUxvZ2dlcic7XG5cbi8qKlxuICogQSBsb2dnZXIgdGhhdCBkb2Vzbid0IGFjdHVhbGx5IGRvIGFueXRoaW5nLiBVc2VkIGZvciB0ZXJtaW5hdGluZyBhIGNoYWluIG9mIGxvZ2dlcnMuXG4gKi9cbmV4cG9ydCBjbGFzcyBOdWxsTG9nZ2VyIGltcGxlbWVudHMgSUxvZ2dlciB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbm8tb3AgbG9nZ2VyLlxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7IH1cblxuICAvKipcbiAgICogTm8tb3BcbiAgICovXG4gIGxvZyhlbnRyeSkge1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
