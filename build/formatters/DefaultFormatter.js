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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvcm1hdHRlcnMvRGVmYXVsdEZvcm1hdHRlci50cyJdLCJuYW1lcyI6WyJEZWZhdWx0Rm9ybWF0dGVyIiwiRGVmYXVsdEZvcm1hdHRlci5jb25zdHJ1Y3RvciIsIkRlZmF1bHRGb3JtYXR0ZXIuZm9ybWF0Il0sIm1hcHBpbmdzIjoiQUFHQTs7R0FFRztBQUNIO0lBQUFBO0lBUUFDLENBQUNBO0lBUENEOzs7T0FHR0E7SUFDSEEsaUNBQU1BLEdBQU5BLFVBQU9BLEtBQWdCQTtRQUNyQkUsTUFBTUEsQ0FBQ0EsTUFBSUEsS0FBS0EsQ0FBQ0EsSUFBSUEsV0FBTUEsS0FBS0EsQ0FBQ0EsS0FBS0EsVUFBS0EsS0FBS0EsQ0FBQ0EsT0FBU0EsQ0FBQ0E7SUFDN0RBLENBQUNBO0lBQ0hGLHVCQUFDQTtBQUFEQSxDQVJBLEFBUUNBLElBQUE7QUFSWSx3QkFBZ0IsbUJBUTVCLENBQUEiLCJmaWxlIjoiZm9ybWF0dGVycy9EZWZhdWx0Rm9ybWF0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJTG9nRW50cnl9IGZyb20gJy4uL2NvcmUvSUxvZ0VudHJ5JztcbmltcG9ydCB7SUxvZ0VudHJ5Rm9ybWF0dGVyfSBmcm9tICcuL0lMb2dFbnRyeUZvcm1hdHRlcic7XG5cbi8qKlxuICogUHJvdmlkZXMgdGhlIGRlZmF1bHQgZm9ybWF0dGluZyBmb3IgYSBsb2cgZW50cnkuIEUuZy4sIFwiWzIwMTUtMDEtMTIgMDA6MDE6MDhdIFtJTkZPXSBNZXNzYWdlIGJsYWggYmxhaC4uLlwiXG4gKi9cbmV4cG9ydCBjbGFzcyBEZWZhdWx0Rm9ybWF0dGVyIGltcGxlbWVudHMgSUxvZ0VudHJ5Rm9ybWF0dGVyIHtcbiAgLyoqXG4gICAqIEZvcm1hdHMgYSBsb2cgZW50cnkgYXMgW1RJTUVdIFtMRVZFTF0gTUVTU0FHRVxuICAgKiBAcGFyYW0gZW50cnkgVGhlIGxvZyBlbnRyeVxuICAgKi9cbiAgZm9ybWF0KGVudHJ5OiBJTG9nRW50cnkpIDogc3RyaW5ne1xuICAgIHJldHVybiBgWyR7ZW50cnkudGltZX1dIFske2VudHJ5LmxldmVsfV0gJHtlbnRyeS5tZXNzYWdlfWA7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
