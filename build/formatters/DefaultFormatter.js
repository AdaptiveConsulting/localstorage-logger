var LogLevel_1 = require('../core/LogLevel');
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
        return "[" + entry.time + "] [" + LogLevel_1.LogLevel[entry.level] + "] " + entry.message;
    };
    return DefaultFormatter;
})();
exports.DefaultFormatter = DefaultFormatter;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvcm1hdHRlcnMvRGVmYXVsdEZvcm1hdHRlci50cyJdLCJuYW1lcyI6WyJEZWZhdWx0Rm9ybWF0dGVyIiwiRGVmYXVsdEZvcm1hdHRlci5jb25zdHJ1Y3RvciIsIkRlZmF1bHRGb3JtYXR0ZXIuZm9ybWF0Il0sIm1hcHBpbmdzIjoiQUFBQSx5QkFBdUIsa0JBQWtCLENBQUMsQ0FBQTtBQUkxQzs7R0FFRztBQUNIO0lBQUFBO0lBUUFDLENBQUNBO0lBUENEOzs7T0FHR0E7SUFDSEEsaUNBQU1BLEdBQU5BLFVBQU9BLEtBQWdCQTtRQUNyQkUsTUFBTUEsQ0FBQ0EsTUFBSUEsS0FBS0EsQ0FBQ0EsSUFBSUEsV0FBTUEsbUJBQVFBLENBQUNBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLFVBQUtBLEtBQUtBLENBQUNBLE9BQVNBLENBQUNBO0lBQ3ZFQSxDQUFDQTtJQUNIRix1QkFBQ0E7QUFBREEsQ0FSQSxBQVFDQSxJQUFBO0FBUlksd0JBQWdCLG1CQVE1QixDQUFBIiwiZmlsZSI6ImZvcm1hdHRlcnMvRGVmYXVsdEZvcm1hdHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TG9nTGV2ZWx9IGZyb20gJy4uL2NvcmUvTG9nTGV2ZWwnO1xuaW1wb3J0IHtJTG9nRW50cnl9IGZyb20gJy4uL2NvcmUvSUxvZ0VudHJ5JztcbmltcG9ydCB7SUxvZ0VudHJ5Rm9ybWF0dGVyfSBmcm9tICcuL0lMb2dFbnRyeUZvcm1hdHRlcic7XG5cbi8qKlxuICogUHJvdmlkZXMgdGhlIGRlZmF1bHQgZm9ybWF0dGluZyBmb3IgYSBsb2cgZW50cnkuIEUuZy4sIFwiWzIwMTUtMDEtMTIgMDA6MDE6MDhdIFtJTkZPXSBNZXNzYWdlIGJsYWggYmxhaC4uLlwiXG4gKi9cbmV4cG9ydCBjbGFzcyBEZWZhdWx0Rm9ybWF0dGVyIGltcGxlbWVudHMgSUxvZ0VudHJ5Rm9ybWF0dGVyIHtcbiAgLyoqXG4gICAqIEZvcm1hdHMgYSBsb2cgZW50cnkgYXMgW1RJTUVdIFtMRVZFTF0gTUVTU0FHRVxuICAgKiBAcGFyYW0gZW50cnkgVGhlIGxvZyBlbnRyeVxuICAgKi9cbiAgZm9ybWF0KGVudHJ5OiBJTG9nRW50cnkpIDogc3RyaW5ne1xuICAgIHJldHVybiBgWyR7ZW50cnkudGltZX1dIFske0xvZ0xldmVsW2VudHJ5LmxldmVsXX1dICR7ZW50cnkubWVzc2FnZX1gO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
