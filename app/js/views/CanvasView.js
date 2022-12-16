import {getLogger} from "../supportClasses/Logger";
import Position from "../supportClasses/Position";
import {computeTargetRect} from "./utils";

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

    invalidate(infos) {
        if (this.#rafId) {
            window.cancelAnimationFrame(this.#rafId);
            this.#rafId = undefined;
        }
        this.#rafId = window.requestAnimationFrame(() => {
            this.validate(infos)
        })
    }

    validate({sourceImage, x, y, onValidate}) {
        if (sourceImage) {
            thisLogger.info(`~~~~~~~ validate for ${x},${y}`);
            thisLogger.info(`@canvas: ${this.canvas.width},${this.canvas.height}`);
            thisLogger.info(`@image: ${sourceImage.naturalWidth},${sourceImage.naturalWidth}`);

            const {x: newX = 0, y: newY = 0, width = 0, height = 0} = onValidate
                ? onValidate({...computeTargetRect({canvas: this.canvas, image:sourceImage, x, y})})
                : computeTargetRect({canvas: this.canvas, image:sourceImage, x, y})

            thisLogger.info("calc:", {newX, newY, width, height});

            const ctx = this.canvas.getContext('2d');
            this.topLeft.reset({x: newX, y: newY});
            ctx.drawImage(sourceImage, this.topLeft.x, this.topLeft.y, width, height);
            thisLogger.info(`~~~~~~~ validated: topLeft:(${this.topLeft.x},${this.topLeft.y}), size:${width},${height}`);
        }
    }

    /**
     * @description Draw provided {@link HTMLImageElement} image onto canvas view
     * @param sourceImage {HTMLImageElement}
     * @param [options] {Object}
     * @param [options.x] {Number}
     * @param [options.y] {Number}
     * @param [options.onValidate] {Function}
     * @returns {CanvasView}
     */

    drawFromImage(sourceImage, options = undefined) {
        if (sourceImage) {
            const srcWidth = sourceImage.naturalWidth;
            this.canvas.width = srcWidth;
            this.canvas.height = srcWidth * VIEW_RECT_RATIO;
            const {x, y, onValidate } = options ?? {}
            this.invalidate({sourceImage, x, y, onValidate});
        }
        return this;
    }

}

thisLogger.setEnabled(true);

export default CanvasView;
