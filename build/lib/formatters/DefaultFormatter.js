/**
 * Provides the default formatting for a log entry. E.g., "[2015-01-12 00:01:08] [INFO] Message blah blah..."
 */
var DefaultFormatter = (function () {
    function DefaultFormatter() {
    }
    /**
     * Formats a log entry as [TIME] [LEVEL] MESSAGE
     * @param entry The log entry
     */
    DefaultFormatter.prototype.format = function (entry) {
        return "[" + entry.time + "] [" + entry.level + "] " + entry.message;
    };
    return DefaultFormatter;
})();
exports.DefaultFormatter = DefaultFormatter;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9mb3JtYXR0ZXJzL0RlZmF1bHRGb3JtYXR0ZXIudHMiXSwibmFtZXMiOlsiRGVmYXVsdEZvcm1hdHRlciIsIkRlZmF1bHRGb3JtYXR0ZXIuY29uc3RydWN0b3IiLCJEZWZhdWx0Rm9ybWF0dGVyLmZvcm1hdCJdLCJtYXBwaW5ncyI6IkFBR0E7O0dBRUc7QUFDSDtJQUFBQTtJQVFBQyxDQUFDQTtJQVBDRDs7O09BR0dBO0lBQ0hBLGlDQUFNQSxHQUFOQSxVQUFPQSxLQUFnQkE7UUFDckJFLE1BQU1BLENBQUNBLE1BQUlBLEtBQUtBLENBQUNBLElBQUlBLFdBQU1BLEtBQUtBLENBQUNBLEtBQUtBLFVBQUtBLEtBQUtBLENBQUNBLE9BQVNBLENBQUNBO0lBQzdEQSxDQUFDQTtJQUNIRix1QkFBQ0E7QUFBREEsQ0FSQSxBQVFDQSxJQUFBO0FBUlksd0JBQWdCLG1CQVE1QixDQUFBIiwiZmlsZSI6ImxpYi9mb3JtYXR0ZXJzL0RlZmF1bHRGb3JtYXR0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0lMb2dFbnRyeX0gZnJvbSAnLi4vY29yZS9JTG9nRW50cnknO1xuaW1wb3J0IHtJTG9nRW50cnlGb3JtYXR0ZXJ9IGZyb20gJy4vSUxvZ0VudHJ5Rm9ybWF0dGVyJztcblxuLyoqXG4gKiBQcm92aWRlcyB0aGUgZGVmYXVsdCBmb3JtYXR0aW5nIGZvciBhIGxvZyBlbnRyeS4gRS5nLiwgXCJbMjAxNS0wMS0xMiAwMDowMTowOF0gW0lORk9dIE1lc3NhZ2UgYmxhaCBibGFoLi4uXCJcbiAqL1xuZXhwb3J0IGNsYXNzIERlZmF1bHRGb3JtYXR0ZXIgaW1wbGVtZW50cyBJTG9nRW50cnlGb3JtYXR0ZXIge1xuICAvKipcbiAgICogRm9ybWF0cyBhIGxvZyBlbnRyeSBhcyBbVElNRV0gW0xFVkVMXSBNRVNTQUdFXG4gICAqIEBwYXJhbSBlbnRyeSBUaGUgbG9nIGVudHJ5XG4gICAqL1xuICBmb3JtYXQoZW50cnk6IElMb2dFbnRyeSkgOiBzdHJpbmd7XG4gICAgcmV0dXJuIGBbJHtlbnRyeS50aW1lfV0gWyR7ZW50cnkubGV2ZWx9XSAke2VudHJ5Lm1lc3NhZ2V9YDtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
