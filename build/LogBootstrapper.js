var DefaultFormatter_1 = require('./formatters/DefaultFormatter');
var NullLogger_1 = require('./loggers/NullLogger');
var ConsoleLogger_1 = require('./loggers/ConsoleLogger');
var LocalStorageLogger_1 = require('./loggers/LocalStorageLogger');
var LogLevel_1 = require('./core/LogLevel');
/**
 * Bootstraps the log chain setup.
 */
var LogBootstrapper = (function () {
    function LogBootstrapper(_timestampProvider) {
        if (_timestampProvider === void 0) { _timestampProvider = function () { return new Date(); }; }
        this._timestampProvider = _timestampProvider;
    }
    /**
     * Returns a logging interface that has been set up with default loggers and formatters.
     */
    LogBootstrapper.prototype.bootstrap = function (config) {
        var _this = this;
        var formatter = new DefaultFormatter_1.DefaultFormatter();
        // Chain of responsibility style pattern here...
        var chainTerminal = new NullLogger_1.NullLogger();
        var consoleLogChain = new ConsoleLogger_1.ConsoleLogger(formatter, chainTerminal);
        var localStorageLogChain = new LocalStorageLogger_1.LocalStorageLogger(config, consoleLogChain);
        // Writes a message of a given log level to the start of the chain
        var write = function (level, args) {
            var time = _this._timestampProvider().toISOString();
            var jsonMessage = JSON.stringify(args);
            var jsonMessageWithoutBrackets = jsonMessage.slice(1, jsonMessage.length - 1);
            localStorageLogChain.log({
                level: level, time: time, message: jsonMessageWithoutBrackets
            });
        };
        // Returns the logging interface for consumers
        return {
            debug: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                write(LogLevel_1.LogLevel.DEBUG, args);
            },
            info: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                write(LogLevel_1.LogLevel.INFO, args);
            },
            warn: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                write(LogLevel_1.LogLevel.WARN, args);
            },
            error: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                write(LogLevel_1.LogLevel.ERROR, args);
            },
            exportToArray: function () { return localStorageLogChain.allEntries().map(function (entry) { return formatter.format(entry); }); }
        };
    };
    return LogBootstrapper;
})();
exports.LogBootstrapper = LogBootstrapper;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxvZ0Jvb3RzdHJhcHBlci50cyJdLCJuYW1lcyI6WyJMb2dCb290c3RyYXBwZXIiLCJMb2dCb290c3RyYXBwZXIuY29uc3RydWN0b3IiLCJMb2dCb290c3RyYXBwZXIuYm9vdHN0cmFwIiwiTG9nQm9vdHN0cmFwcGVyLmJvb3RzdHJhcC5kZWJ1ZyIsIkxvZ0Jvb3RzdHJhcHBlci5ib290c3RyYXAuaW5mbyIsIkxvZ0Jvb3RzdHJhcHBlci5ib290c3RyYXAud2FybiIsIkxvZ0Jvb3RzdHJhcHBlci5ib290c3RyYXAuZXJyb3IiLCJMb2dCb290c3RyYXBwZXIuYm9vdHN0cmFwLmV4cG9ydFRvQXJyYXkiXSwibWFwcGluZ3MiOiJBQUFBLGlDQUErQiwrQkFBK0IsQ0FBQyxDQUFBO0FBQy9ELDJCQUF5QixzQkFBc0IsQ0FBQyxDQUFBO0FBQ2hELDhCQUE0Qix5QkFBeUIsQ0FBQyxDQUFBO0FBRXRELG1DQUFpQyw4QkFBOEIsQ0FBQyxDQUFBO0FBRWhFLHlCQUF1QixpQkFBaUIsQ0FBQyxDQUFBO0FBRXpDOztHQUVHO0FBQ0g7SUFDRUEseUJBQW9CQSxrQkFBaURBO1FBQXpEQyxrQ0FBeURBLEdBQXpEQSxxQkFBeUNBLGNBQU1BLE9BQUFBLElBQUlBLElBQUlBLEVBQUVBLEVBQVZBLENBQVVBO1FBQWpEQSx1QkFBa0JBLEdBQWxCQSxrQkFBa0JBLENBQStCQTtJQUNyRUEsQ0FBQ0E7SUFDREQ7O09BRUdBO0lBQ0hBLG1DQUFTQSxHQUFUQSxVQUFVQSxNQUF3Q0E7UUFBbERFLGlCQXVCQ0E7UUF0QkNBLElBQU1BLFNBQVNBLEdBQUdBLElBQUlBLG1DQUFnQkEsRUFBRUEsQ0FBQ0E7UUFDekNBLGdEQUFnREE7UUFDaERBLElBQU1BLGFBQWFBLEdBQUdBLElBQUlBLHVCQUFVQSxFQUFFQSxDQUFDQTtRQUN2Q0EsSUFBTUEsZUFBZUEsR0FBR0EsSUFBSUEsNkJBQWFBLENBQUNBLFNBQVNBLEVBQUVBLGFBQWFBLENBQUNBLENBQUNBO1FBQ3BFQSxJQUFNQSxvQkFBb0JBLEdBQUdBLElBQUlBLHVDQUFrQkEsQ0FBQ0EsTUFBTUEsRUFBRUEsZUFBZUEsQ0FBQ0EsQ0FBQ0E7UUFDN0VBLGtFQUFrRUE7UUFDbEVBLElBQU1BLEtBQUtBLEdBQUdBLFVBQUNBLEtBQUtBLEVBQUVBLElBQVdBO1lBQy9CQSxJQUFNQSxJQUFJQSxHQUFHQSxLQUFJQSxDQUFDQSxrQkFBa0JBLEVBQUVBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO1lBQ3JEQSxJQUFNQSxXQUFXQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUN6Q0EsSUFBTUEsMEJBQTBCQSxHQUFHQSxXQUFXQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxFQUFFQSxXQUFXQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNoRkEsb0JBQW9CQSxDQUFDQSxHQUFHQSxDQUFDQTtnQkFDdkJBLE9BQUFBLEtBQUtBLEVBQUVBLE1BQUFBLElBQUlBLEVBQUVBLE9BQU9BLEVBQUVBLDBCQUEwQkE7YUFDakRBLENBQUNBLENBQUNBO1FBQ0xBLENBQUNBLENBQUFBO1FBQ0RBLDhDQUE4Q0E7UUFDOUNBLE1BQU1BLENBQUNBO1lBQ0xBLEtBQUtBO2dCQUFDQyxjQUFPQTtxQkFBUEEsV0FBT0EsQ0FBUEEsc0JBQU9BLENBQVBBLElBQU9BO29CQUFQQSw2QkFBT0E7O2dCQUFJQSxLQUFLQSxDQUFDQSxtQkFBUUEsQ0FBQ0EsS0FBS0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFBQ0EsQ0FBQ0E7WUFDL0NELElBQUlBO2dCQUFDRSxjQUFPQTtxQkFBUEEsV0FBT0EsQ0FBUEEsc0JBQU9BLENBQVBBLElBQU9BO29CQUFQQSw2QkFBT0E7O2dCQUFJQSxLQUFLQSxDQUFDQSxtQkFBUUEsQ0FBQ0EsSUFBSUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFBQ0EsQ0FBQ0E7WUFDN0NGLElBQUlBO2dCQUFDRyxjQUFPQTtxQkFBUEEsV0FBT0EsQ0FBUEEsc0JBQU9BLENBQVBBLElBQU9BO29CQUFQQSw2QkFBT0E7O2dCQUFJQSxLQUFLQSxDQUFDQSxtQkFBUUEsQ0FBQ0EsSUFBSUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFBQ0EsQ0FBQ0E7WUFDN0NILEtBQUtBO2dCQUFDSSxjQUFPQTtxQkFBUEEsV0FBT0EsQ0FBUEEsc0JBQU9BLENBQVBBLElBQU9BO29CQUFQQSw2QkFBT0E7O2dCQUFJQSxLQUFLQSxDQUFDQSxtQkFBUUEsQ0FBQ0EsS0FBS0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFBQ0EsQ0FBQ0E7WUFDL0NKLGFBQWFBLGdCQUFLSyxNQUFNQSxDQUFDQSxvQkFBb0JBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLFVBQUFBLEtBQUtBLElBQUlBLE9BQUFBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLEVBQXZCQSxDQUF1QkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7U0FDcEdMLENBQUNBO0lBQ0pBLENBQUNBO0lBQ0hGLHNCQUFDQTtBQUFEQSxDQTlCQSxBQThCQ0EsSUFBQTtBQTlCWSx1QkFBZSxrQkE4QjNCLENBQUEiLCJmaWxlIjoiTG9nQm9vdHN0cmFwcGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtEZWZhdWx0Rm9ybWF0dGVyfSBmcm9tICcuL2Zvcm1hdHRlcnMvRGVmYXVsdEZvcm1hdHRlcic7XG5pbXBvcnQge051bGxMb2dnZXJ9IGZyb20gJy4vbG9nZ2Vycy9OdWxsTG9nZ2VyJztcbmltcG9ydCB7Q29uc29sZUxvZ2dlcn0gZnJvbSAnLi9sb2dnZXJzL0NvbnNvbGVMb2dnZXInO1xuaW1wb3J0IHtJTG9jYWxTdG9yYWdlTG9nZ2VyQ29uZmlndXJhdGlvbn0gZnJvbSAnLi9sb2dnZXJzL0lMb2NhbFN0b3JhZ2VMb2dnZXJDb25maWd1cmF0aW9uJztcbmltcG9ydCB7TG9jYWxTdG9yYWdlTG9nZ2VyfSBmcm9tICcuL2xvZ2dlcnMvTG9jYWxTdG9yYWdlTG9nZ2VyJztcbmltcG9ydCB7SUxvZ30gZnJvbSAnLi9JTG9nJztcbmltcG9ydCB7TG9nTGV2ZWx9IGZyb20gJy4vY29yZS9Mb2dMZXZlbCc7XG5cbi8qKlxuICogQm9vdHN0cmFwcyB0aGUgbG9nIGNoYWluIHNldHVwLlxuICovXG5leHBvcnQgY2xhc3MgTG9nQm9vdHN0cmFwcGVyIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfdGltZXN0YW1wUHJvdmlkZXI6ICgpID0+IERhdGUgPSAoKSA9PiBuZXcgRGF0ZSgpKSB7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybnMgYSBsb2dnaW5nIGludGVyZmFjZSB0aGF0IGhhcyBiZWVuIHNldCB1cCB3aXRoIGRlZmF1bHQgbG9nZ2VycyBhbmQgZm9ybWF0dGVycy5cbiAgICovXG4gIGJvb3RzdHJhcChjb25maWc6IElMb2NhbFN0b3JhZ2VMb2dnZXJDb25maWd1cmF0aW9uKSA6IElMb2cge1xuICAgIGNvbnN0IGZvcm1hdHRlciA9IG5ldyBEZWZhdWx0Rm9ybWF0dGVyKCk7XG4gICAgLy8gQ2hhaW4gb2YgcmVzcG9uc2liaWxpdHkgc3R5bGUgcGF0dGVybiBoZXJlLi4uXG4gICAgY29uc3QgY2hhaW5UZXJtaW5hbCA9IG5ldyBOdWxsTG9nZ2VyKCk7XG4gICAgY29uc3QgY29uc29sZUxvZ0NoYWluID0gbmV3IENvbnNvbGVMb2dnZXIoZm9ybWF0dGVyLCBjaGFpblRlcm1pbmFsKTtcbiAgICBjb25zdCBsb2NhbFN0b3JhZ2VMb2dDaGFpbiA9IG5ldyBMb2NhbFN0b3JhZ2VMb2dnZXIoY29uZmlnLCBjb25zb2xlTG9nQ2hhaW4pO1xuICAgIC8vIFdyaXRlcyBhIG1lc3NhZ2Ugb2YgYSBnaXZlbiBsb2cgbGV2ZWwgdG8gdGhlIHN0YXJ0IG9mIHRoZSBjaGFpblxuICAgIGNvbnN0IHdyaXRlID0gKGxldmVsLCBhcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgY29uc3QgdGltZSA9IHRoaXMuX3RpbWVzdGFtcFByb3ZpZGVyKCkudG9JU09TdHJpbmcoKTtcbiAgICAgIGNvbnN0IGpzb25NZXNzYWdlID0gSlNPTi5zdHJpbmdpZnkoYXJncyk7XG4gICAgICBjb25zdCBqc29uTWVzc2FnZVdpdGhvdXRCcmFja2V0cyA9IGpzb25NZXNzYWdlLnNsaWNlKDEsIGpzb25NZXNzYWdlLmxlbmd0aCAtIDEpO1xuICAgICAgbG9jYWxTdG9yYWdlTG9nQ2hhaW4ubG9nKHtcbiAgICAgICAgbGV2ZWwsIHRpbWUsIG1lc3NhZ2U6IGpzb25NZXNzYWdlV2l0aG91dEJyYWNrZXRzXG4gICAgICB9KTtcbiAgICB9XG4gICAgLy8gUmV0dXJucyB0aGUgbG9nZ2luZyBpbnRlcmZhY2UgZm9yIGNvbnN1bWVyc1xuICAgIHJldHVybiB7XG4gICAgICBkZWJ1ZyguLi5hcmdzKSB7IHdyaXRlKExvZ0xldmVsLkRFQlVHLCBhcmdzKTsgfSxcbiAgICAgIGluZm8oLi4uYXJncykgeyB3cml0ZShMb2dMZXZlbC5JTkZPLCBhcmdzKTsgfSxcbiAgICAgIHdhcm4oLi4uYXJncykgeyB3cml0ZShMb2dMZXZlbC5XQVJOLCBhcmdzKTsgfSxcbiAgICAgIGVycm9yKC4uLmFyZ3MpIHsgd3JpdGUoTG9nTGV2ZWwuRVJST1IsIGFyZ3MpOyB9LFxuICAgICAgZXhwb3J0VG9BcnJheSgpIHsgcmV0dXJuIGxvY2FsU3RvcmFnZUxvZ0NoYWluLmFsbEVudHJpZXMoKS5tYXAoZW50cnkgPT4gZm9ybWF0dGVyLmZvcm1hdChlbnRyeSkpOyB9XG4gICAgfTtcbiAgfVxufVxuXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
