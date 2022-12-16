import {getLogger} from "../supportClasses/Logger";
import Position from "../supportClasses/Position";

const thisLogger = getLogger('CanvasViewLogging');
const VIEW_RECT_RATIO = 10 / 15;

class CanvasView {
    /**
     * @description {@link HTMLCanvasElement} DOM element reference
     * @type {HTMLCanvasElement}
     */
    #canvas

    /**
     * @description The {@link window.requestAnimationFrame} id value
     * @type {Number}
     */
    #rafId

    /**
     * @type {Position}
     */
    #topLeft = new Position();

    /**
     * @type {Position}
     */
    get topLeft() {
        return this.#topLeft;
    }

    /**
     * @type {Position}
     */
    #offset = new Position();

    /**
     * @type {Position}
     */
    get offset() {
        return this.#offset;
    }

    /**
     * @returns {HTMLCanvasElement} The {@link HTMLCanvasElement} DOM element reference associated with view
     */
    get canvas() {
        return this.#canvas;
    }

    /**
     * @description Initialize view with {@link HTMLCanvasElement} DOM element reference
     * @param canvasElement {HTMLCanvasElement}
     * @returns {CanvasView}
     */
    withElement(canvasElement) {
        this.#canvas = canvasElement;
        return this;
    }

    /**
     * @description Clear the view surface
     * @returns {CanvasView}
     */
    clear() {
        // TODO not required ?
        this.#canvas
            .getContext('2d')
            .clearRect(0, 0, this.#canvas.width, this.#canvas.height);
        return this;
    }

    invalidate({sourceImage, offsetX, offsetY}) {
        if (this.#rafId) {
            window.cancelAnimationFrame(this.#rafId);
            this.#rafId = undefined;
        }
        this.#rafId = window.requestAnimationFrame(() => {
            this.validate({sourceImage, offsetX, offsetY})
        })
    }

    computeTargetRect(sourceImage, options = {offsetX: 0, offsetY: 0}) {
        const canvas = this.#canvas;
        const srcWidth = sourceImage.naturalWidth;
        const srcHeight = sourceImage.naturalHeight;

        const hRatio = canvas.width / srcWidth;
        const vRatio = canvas.height / srcHeight;

        const scaleFactor = Math.max(hRatio, vRatio);

        const newWidth = srcWidth * scaleFactor;
        const newHeight = srcHeight * scaleFactor;

        const {offsetX = 0, offsetY = 0} = options ?? {};

        const x = (canvas.width * 0.5) - (newWidth * 0.5) + offsetX;
        const y = (canvas.height * 0.5) - (newHeight * 0.5) + offsetY;

        return {x, y, width: newWidth, height: newHeight};
    }

    validate({sourceImage, offsetX, offsetY}) {
        if (sourceImage) {
            thisLogger.info("~~~~~~~ compute for ", {offsetX, offsetY});

            const {x:newX, y:newY, width, height} = this.computeTargetRect(sourceImage, {offsetX, offsetY})

            thisLogger.info("rect:", {newX, newY, width, height});
            thisLogger.info(`canvas: ${this.canvas.width},${this.canvas.height}`);
            thisLogger.info(`image: ${sourceImage.naturalWidth},${sourceImage.naturalWidth}`);

            const ctx = this.#canvas.getContext('2d');
            ctx.drawImage(sourceImage, newX, newY, width, height);

            this.#topLeft.reset({x: newX, y: newY});
            this.#offset.reset({x: offsetX, y: offsetY});

            thisLogger.info("will draw:", {newX, newY, width, height});
            thisLogger.info("topLeft:", `${this.topLeft.x},${this.topLeft.y}`);
            thisLogger.info("offset:", `${this.offset.x},${this.offset.y}`);

        }
    }

    /**
     * @description Draw provided {@link HTMLImageElement} image onto canvas view
     * @param sourceImage {HTMLImageElement}
     * @param options {Object}
     * @param options.offsetX {Number}
     * @param options.offsetY {Number}
     * @returns {CanvasView}
     */

    drawFromImage(sourceImage, options = {offsetX: 0, offsetY: 0}) {
        if (sourceImage) {
            const srcWidth = sourceImage.naturalWidth;
            this.#canvas.width = srcWidth;
            this.#canvas.height = srcWidth * VIEW_RECT_RATIO;

            const {offsetX = 0, offsetY = 0} = options ?? {};
            this.invalidate({sourceImage, offsetX, offsetY});

        }
        return this;
    }

}

thisLogger.setEnabled(true);

export default CanvasView;
