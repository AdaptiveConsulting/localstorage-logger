/**
 * A logger that doesn't actually do anything. Used for terminating a chain of loggers.
 */
var NullLogger = (function () {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2dlcnMvTnVsbExvZ2dlci50cyJdLCJuYW1lcyI6WyJOdWxsTG9nZ2VyIiwiTnVsbExvZ2dlci5jb25zdHJ1Y3RvciIsIk51bGxMb2dnZXIubG9nIl0sIm1hcHBpbmdzIjoiQUFFQTs7R0FFRztBQUNIO0lBQUFBO0lBTUFDLENBQUNBO0lBTENEOztPQUVHQTtJQUNIQSx3QkFBR0EsR0FBSEEsVUFBSUEsS0FBS0E7SUFDVEUsQ0FBQ0E7SUFDSEYsaUJBQUNBO0FBQURBLENBTkEsQUFNQ0EsSUFBQTtBQU5ZLGtCQUFVLGFBTXRCLENBQUEiLCJmaWxlIjoibG9nZ2Vycy9OdWxsTG9nZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJTG9nZ2VyfSBmcm9tICcuL0lMb2dnZXInO1xuXG4vKipcbiAqIEEgbG9nZ2VyIHRoYXQgZG9lc24ndCBhY3R1YWxseSBkbyBhbnl0aGluZy4gVXNlZCBmb3IgdGVybWluYXRpbmcgYSBjaGFpbiBvZiBsb2dnZXJzLlxuICovXG5leHBvcnQgY2xhc3MgTnVsbExvZ2dlciBpbXBsZW1lbnRzIElMb2dnZXIge1xuICAvKipcbiAgICogTm8tb3BcbiAgICovXG4gIGxvZyhlbnRyeSkge1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
