import {noop} from "./utils";

const DEFAULT_LOGGER = 'default';
const logInstances = new Map();
const enabledScopedLoggers = new Map();

/**
 * @typedef ScopedLogger
 * @property {function(...[any]):void} info
 * @property {function(...[any]):void} warn
 * @property {function(...[any]):void} error
 * @property {string} scope
 * @property {boolean} enabled
 * @property {function(value:boolean):ScopedLogger} setEnabled
 */

/**
 * @param {ScopedLogger} logger - scoped logger to enable or disable its "warn", "info" output
 * @param {boolean} enable - if true -  will enable the logger "warn", "info" output
 */
const setLoggerEnabled = (logger, enable) => {
    if (logger) {
        if (enable) {
            enabledScopedLoggers.set(logger, true);
        } else {
            enabledScopedLoggers.delete(logger);
        }
    }
};

/**
 * @param logger {ScopedLogger} - scoped logger
 * @returns {boolean} - indicating if the given logger "warn", "info" output enabled
 */
const isLoggerEnabled = (logger) => logger && (logger.scope === DEFAULT_LOGGER || enabledScopedLoggers.get(logger) === true);

/**
 * @description Simple console logger impl
 * Add possibility to split logging per provided group/scope/key, enable/disable them outputs appropriate
 */
function ConsoleLoggerScoped(scope) {
    const thisScope = scope;
    return Object.freeze({
        get scope() {
            return thisScope;
        },
        get enabled() {
            return isLoggerEnabled(thisScope);
        },
        setEnabled(value) {
            setLoggerEnabled(scope, value);
            return this;
        },
        info: (...args) => (isLoggerEnabled(thisScope) ? console.info : noop)(`[${thisScope}] `, ...args),
        warn: (...args) => (isLoggerEnabled(thisScope) ? console.warn : noop)(`[${thisScope}] `, ...args),
        error: (...args) => console.error(`[${thisScope}] `, ...args),
    });
}

/**
 * @param {string} scope - The scope (group, key) of Logger
 * @returns {ScopedLogger} - scoped logger instance
 */
export const getLogger = (scope = DEFAULT_LOGGER) => {
    const thisScope = scope || DEFAULT_LOGGER;
    if (!logInstances.has(thisScope)) {
        const thisScopeLogger = Object.freeze(new ConsoleLoggerScoped(thisScope))
        logInstances.set(thisScope, thisScopeLogger);
    }
    return logInstances.get(scope);
};

/**
 * @returns {ScopedLogger} - default Logger
 */
export default getLogger(DEFAULT_LOGGER);
