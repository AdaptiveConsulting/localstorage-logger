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
        console.log(formattedMessage);
        this._nextLogger.log(entry);
    };
    return ConsoleLogger;
})();
exports.ConsoleLogger = ConsoleLogger;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2dlcnMvQ29uc29sZUxvZ2dlci50cyJdLCJuYW1lcyI6WyJDb25zb2xlTG9nZ2VyIiwiQ29uc29sZUxvZ2dlci5jb25zdHJ1Y3RvciIsIkNvbnNvbGVMb2dnZXIubG9nIl0sIm1hcHBpbmdzIjoiQUFJQTs7R0FFRztBQUNIO0lBQ0VBOzs7O09BSUdBO0lBQ0hBLHVCQUFvQkEsVUFBOEJBLEVBQVVBLFdBQW9CQTtRQUE1REMsZUFBVUEsR0FBVkEsVUFBVUEsQ0FBb0JBO1FBQVVBLGdCQUFXQSxHQUFYQSxXQUFXQSxDQUFTQTtJQUNoRkEsQ0FBQ0E7SUFFREQ7OztPQUdHQTtJQUNIQSwyQkFBR0EsR0FBSEEsVUFBSUEsS0FBZ0JBO1FBQ2xCRSxJQUFNQSxnQkFBZ0JBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1FBQ3ZEQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxnQkFBZ0JBLENBQUNBLENBQUNBO1FBQzlCQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtJQUM5QkEsQ0FBQ0E7SUFDSEYsb0JBQUNBO0FBQURBLENBbEJBLEFBa0JDQSxJQUFBO0FBbEJZLHFCQUFhLGdCQWtCekIsQ0FBQSIsImZpbGUiOiJsb2dnZXJzL0NvbnNvbGVMb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0lMb2dnZXJ9IGZyb20gJy4vSUxvZ2dlcic7XG5pbXBvcnQge0lMb2dFbnRyeX0gZnJvbSAnLi4vY29yZS9JTG9nRW50cnknO1xuaW1wb3J0IHtJTG9nRW50cnlGb3JtYXR0ZXJ9IGZyb20gJy4uL2Zvcm1hdHRlcnMvSUxvZ0VudHJ5Rm9ybWF0dGVyJztcblxuLyoqXG4gKiBMb2dnZXIgdGhhdCBsb2dzIHRvIHRoZSBjb25zb2xlLlxuICovXG5leHBvcnQgY2xhc3MgQ29uc29sZUxvZ2dlciBpbXBsZW1lbnRzIElMb2dnZXIge1xuICAvKipcbiAgICogQ29uc3RydWN0cyBhIGNvbnNvbGUgbG9nZ2VyLlxuICAgKiBAcGFyYW0gX2Zvcm1hdHRlciBUaGUgZm9ybWF0dGVyIHVzZWQgdG8gZm9ybWF0IHRoZSBlbnRyeSBmb3IgdGhlIGNvbnNvbGVcbiAgICogQHBhcmFtIF9uZXh0TG9nZ2VyIFRoZSBuZXh0IGxvZ2dlciBpbiB0aGUgXCJsb2cgY2hhaW5cIlxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZm9ybWF0dGVyOiBJTG9nRW50cnlGb3JtYXR0ZXIsIHByaXZhdGUgX25leHRMb2dnZXI6IElMb2dnZXIpIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2dzIGFuIGVudHJ5IHRvIHRoZSBjb25zb2xlLlxuICAgKiBAcGFyYW0gZW50cnkgVGhlIGVudHJ5IHRvIGxvZ1xuICAgKi9cbiAgbG9nKGVudHJ5OiBJTG9nRW50cnkpIHtcbiAgICBjb25zdCBmb3JtYXR0ZWRNZXNzYWdlID0gdGhpcy5fZm9ybWF0dGVyLmZvcm1hdChlbnRyeSk7XG4gICAgY29uc29sZS5sb2coZm9ybWF0dGVkTWVzc2FnZSk7XG4gICAgdGhpcy5fbmV4dExvZ2dlci5sb2coZW50cnkpO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
