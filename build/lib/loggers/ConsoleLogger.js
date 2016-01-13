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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9sb2dnZXJzL0NvbnNvbGVMb2dnZXIudHMiXSwibmFtZXMiOlsiQ29uc29sZUxvZ2dlciIsIkNvbnNvbGVMb2dnZXIuY29uc3RydWN0b3IiLCJDb25zb2xlTG9nZ2VyLmxvZyJdLCJtYXBwaW5ncyI6IkFBSUE7O0dBRUc7QUFDSDtJQUNFQTs7OztPQUlHQTtJQUNIQSx1QkFBb0JBLFVBQThCQSxFQUFVQSxXQUFvQkE7UUFBNURDLGVBQVVBLEdBQVZBLFVBQVVBLENBQW9CQTtRQUFVQSxnQkFBV0EsR0FBWEEsV0FBV0EsQ0FBU0E7SUFDaEZBLENBQUNBO0lBRUREOzs7T0FHR0E7SUFDSEEsMkJBQUdBLEdBQUhBLFVBQUlBLEtBQWdCQTtRQUNsQkUsSUFBTUEsZ0JBQWdCQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUN2REEsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFDbkJBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEdBQUdBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO0lBQzlCQSxDQUFDQTtJQUNIRixvQkFBQ0E7QUFBREEsQ0FsQkEsQUFrQkNBLElBQUE7QUFsQlkscUJBQWEsZ0JBa0J6QixDQUFBIiwiZmlsZSI6ImxpYi9sb2dnZXJzL0NvbnNvbGVMb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0lMb2dnZXJ9IGZyb20gJy4vSUxvZ2dlcic7XG5pbXBvcnQge0lMb2dFbnRyeX0gZnJvbSAnLi4vY29yZS9JTG9nRW50cnknO1xuaW1wb3J0IHtJTG9nRW50cnlGb3JtYXR0ZXJ9IGZyb20gJy4uL2Zvcm1hdHRlcnMvSUxvZ0VudHJ5Rm9ybWF0dGVyJztcblxuLyoqXG4gKiBMb2dnZXIgdGhhdCBsb2dzIHRvIHRoZSBjb25zb2xlLlxuICovXG5leHBvcnQgY2xhc3MgQ29uc29sZUxvZ2dlciBpbXBsZW1lbnRzIElMb2dnZXIge1xuICAvKipcbiAgICogQ29uc3RydWN0cyBhIGNvbnNvbGUgbG9nZ2VyLlxuICAgKiBAcGFyYW0gX2Zvcm1hdHRlciBUaGUgZm9ybWF0dGVyIHVzZWQgdG8gZm9ybWF0IHRoZSBlbnRyeSBmb3IgdGhlIGNvbnNvbGVcbiAgICogQHBhcmFtIF9uZXh0TG9nZ2VyIFRoZSBuZXh0IGxvZ2dlciBpbiB0aGUgXCJsb2cgY2hhaW5cIlxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZm9ybWF0dGVyOiBJTG9nRW50cnlGb3JtYXR0ZXIsIHByaXZhdGUgX25leHRMb2dnZXI6IElMb2dnZXIpIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2dzIGFuIGVudHJ5IHRvIHRoZSBjb25zb2xlLlxuICAgKiBAcGFyYW0gZW50cnkgVGhlIGVudHJ5IHRvIGxvZ1xuICAgKi9cbiAgbG9nKGVudHJ5OiBJTG9nRW50cnkpIHtcbiAgICBjb25zdCBmb3JtYXR0ZWRNZXNzYWdlID0gdGhpcy5fZm9ybWF0dGVyLmZvcm1hdChlbnRyeSk7XG4gICAgY29uc29sZS5sb2coZW50cnkpO1xuICAgIHRoaXMuX25leHRMb2dnZXIubG9nKGVudHJ5KTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
