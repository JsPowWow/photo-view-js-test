/**
 * @description The "no operation" function; It gets any and return nothing.
 * @returns {undefined}
 */
export const noop = (..._) => {
    /** This is intentional */
};


/**
 * @description Simple shorthand to check if provided value is not null and defined
 * @param value value to check.
 * @returns {boolean} returns true if provided value is not null and defined
 */
export const isDefined = (value) => (value !== undefined && value !== null);

