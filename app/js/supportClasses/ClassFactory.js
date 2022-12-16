import {isDefined} from "./utils";

class ClassFactory {
    /**
     * @type {Function}
     */
    #generator

    /**
     * @type {Object}
     */
    #props = {};

    /**
     * @type {Array}
     */
    #constructorArgs = [];

    /**
     * @param generator {Function}
     * @param {Object=} config
     * @param {Object=} config.props
     * @param {Array=} config.constructorArgs
     */
    constructor(generator, config) {
        this.#generator = generator;
        this.#props = config?.props ?? {};
        this.#constructorArgs = config?.constructorArgs ?? [];
        this.setProperty = this.setProperty.bind(this);
    }

    /**
     * @param {Object} props
     * @param {Object} sourceObject
     * @return {Object} updated sourceObject with props
     */
    static adjustProperties(props, sourceObject) {
        if (props && sourceObject) {
            Object.entries(props).forEach(([propName, propValue]) => {
                sourceObject[propName] = propValue
            });
        }
        return sourceObject;
    }

    /**
     * @param {string} propertyName
     * @param propertyValue
     * @returns {ClassFactory}
     */
    setProperty(propertyName, propertyValue) {
        this.#props[propertyName] = propertyValue;
        return this;
    }

    /**
     * @returns {*}
     */
    newInstance() {
        if (!isDefined(this.#generator)) {
            throw new Error(`Factory is not initialized: 'generator'`);
        }

        const Generator = this.#generator;
        return ClassFactory.adjustProperties(this.#props, new Generator(...this.#constructorArgs));
    }
}

export default ClassFactory;
