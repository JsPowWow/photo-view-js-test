class Position {
    /**
     * @type {number}
     */
    #xPos = 0;

    /**
     * @type {number}
     */
    #yPos = 0;

    /**
     * @returns {number}
     */
    get x() {
        return this.#xPos;
    }

    /**
     * @returns {number}
     */
    get y() {
        return this.#yPos;
    }

    reset(options = {x: 0, y: 0}) {
        this.#xPos = options.x ?? 0;
        this.#yPos = options.y ?? 0;
        return this;
    }
}

export default Position
