class Position {
    #xPos = 0;

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

    #yPos = 0;

    /**
     * @description TODO
     * @param xBy {Number}
     * @param yBy {Number}
     */
    moveBy(xBy, yBy) {
        this.#xPos = this.#xPos + xBy;
        this.#yPos = this.#yPos + yBy;
    }

    reset(options = {xPos : 0, yPos : 0}) {
        this.#xPos = options.xPos ?? 0;
        this.#yPos = options.yPos ?? 0;
    }
}

export default Position
