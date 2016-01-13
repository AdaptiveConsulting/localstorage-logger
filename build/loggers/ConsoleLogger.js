/**
 * Logger that logs to the console.
 */
var ConsoleLogger = (function () {
    /**
     * Constructs a console logger.
     * @param _formatter The formatter used to format the entry for the console
     * @param _nextLogger The next logger in the "log chain"
     */
    function ConsoleLogger(_formatter, _nextLogger) {
        this._formatter = _formatter;
        this._nextLogger = _nextLogger;
    }
    /**
     * Logs an entry to the console.
     * @param entry The entry to log
     */
    ConsoleLogger.prototype.log = function (entry) {
        var formattedMessage = this._formatter.format(entry);
        console.log(entry);
        this._nextLogger.log(entry);
    };
    return ConsoleLogger;
})();
exports.ConsoleLogger = ConsoleLogger;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2dlcnMvQ29uc29sZUxvZ2dlci50cyJdLCJuYW1lcyI6WyJDb25zb2xlTG9nZ2VyIiwiQ29uc29sZUxvZ2dlci5jb25zdHJ1Y3RvciIsIkNvbnNvbGVMb2dnZXIubG9nIl0sIm1hcHBpbmdzIjoiQUFJQTs7R0FFRztBQUNIO0lBQ0VBOzs7O09BSUdBO0lBQ0hBLHVCQUFvQkEsVUFBOEJBLEVBQVVBLFdBQW9CQTtRQUE1REMsZUFBVUEsR0FBVkEsVUFBVUEsQ0FBb0JBO1FBQVVBLGdCQUFXQSxHQUFYQSxXQUFXQSxDQUFTQTtJQUNoRkEsQ0FBQ0E7SUFFREQ7OztPQUdHQTtJQUNIQSwyQkFBR0EsR0FBSEEsVUFBSUEsS0FBZ0JBO1FBQ2xCRSxJQUFNQSxnQkFBZ0JBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1FBQ3ZEQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUNuQkEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7SUFDOUJBLENBQUNBO0lBQ0hGLG9CQUFDQTtBQUFEQSxDQWxCQSxBQWtCQ0EsSUFBQTtBQWxCWSxxQkFBYSxnQkFrQnpCLENBQUEiLCJmaWxlIjoibG9nZ2Vycy9Db25zb2xlTG9nZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJTG9nZ2VyfSBmcm9tICcuL0lMb2dnZXInO1xuaW1wb3J0IHtJTG9nRW50cnl9IGZyb20gJy4uL2NvcmUvSUxvZ0VudHJ5JztcbmltcG9ydCB7SUxvZ0VudHJ5Rm9ybWF0dGVyfSBmcm9tICcuLi9mb3JtYXR0ZXJzL0lMb2dFbnRyeUZvcm1hdHRlcic7XG5cbi8qKlxuICogTG9nZ2VyIHRoYXQgbG9ncyB0byB0aGUgY29uc29sZS5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbnNvbGVMb2dnZXIgaW1wbGVtZW50cyBJTG9nZ2VyIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBjb25zb2xlIGxvZ2dlci5cbiAgICogQHBhcmFtIF9mb3JtYXR0ZXIgVGhlIGZvcm1hdHRlciB1c2VkIHRvIGZvcm1hdCB0aGUgZW50cnkgZm9yIHRoZSBjb25zb2xlXG4gICAqIEBwYXJhbSBfbmV4dExvZ2dlciBUaGUgbmV4dCBsb2dnZXIgaW4gdGhlIFwibG9nIGNoYWluXCJcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2Zvcm1hdHRlcjogSUxvZ0VudHJ5Rm9ybWF0dGVyLCBwcml2YXRlIF9uZXh0TG9nZ2VyOiBJTG9nZ2VyKSB7XG4gIH1cblxuICAvKipcbiAgICogTG9ncyBhbiBlbnRyeSB0byB0aGUgY29uc29sZS5cbiAgICogQHBhcmFtIGVudHJ5IFRoZSBlbnRyeSB0byBsb2dcbiAgICovXG4gIGxvZyhlbnRyeTogSUxvZ0VudHJ5KSB7XG4gICAgY29uc3QgZm9ybWF0dGVkTWVzc2FnZSA9IHRoaXMuX2Zvcm1hdHRlci5mb3JtYXQoZW50cnkpO1xuICAgIGNvbnNvbGUubG9nKGVudHJ5KTtcbiAgICB0aGlzLl9uZXh0TG9nZ2VyLmxvZyhlbnRyeSk7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
