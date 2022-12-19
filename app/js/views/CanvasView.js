import {getLogger} from "../supportClasses/Logger";
import Position from "../supportClasses/Position";
import {identity} from "../supportClasses/utils";
import {VIEW_RECT_ASPECT_RATIO} from "../constants";

const thisLogger = getLogger('CanvasViewLoggingOutput');

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
     * @description The current top-left drawn image position on canvas
     * @type {Position}
     */
    #topLeft = new Position();

    /**
     * @description {@link HTMLCanvasElement} DOM element reference
     * @returns {HTMLCanvasElement} The {@link HTMLCanvasElement} DOM element reference associated with view
     */
    get canvas() {
        return this.#canvas;
    }

    /**
     * @description The current top-left drawn image position on canvas
     * @type {Position}
     */
    get topLeft() {
        return this.#topLeft;
    }

    /**
     * @description The current {@link HTMLCanvasElement} DOM element client width in logical pixels
     * @return {number}
     */
    get width() {
        return this.canvas.clientWidth
    }

    /**
     * @description The current {@link HTMLCanvasElement} DOM element client height in logical pixels
     * @return {number}
     */
    get height() {
        return this.canvas.clientHeight;
    }

    /**
     * @description Initialize {@link CanvasView} with {@link HTMLCanvasElement} DOM element reference
     * @param canvasElement {HTMLCanvasElement}
     * @returns {CanvasView}
     */
    withElement(canvasElement) {
        this.#canvas = canvasElement;
        return this;
    }

    /**
     * @description Pending/update the image drawInfo to be drawn later
     * @param {PhotoDrawInfoPayload} drawInfos
     */
    invalidate(drawInfos) {
        if (this.#rafId) {
            window.cancelAnimationFrame(this.#rafId);
            this.#rafId = undefined;
        }
        this.#rafId = window.requestAnimationFrame(() => {
            this.validate(drawInfos)
        })
    }

    /**
     * @description Perform Draw the provided {HTMLImageElement} image onto {HTMLCanvasElement}
     * @param {PhotoDrawInfoPayload} drawInfos
     */
    validate(drawInfos) {
        const {image, x, y, width, height, onValidate = identity} = drawInfos;
        if (image) {
            thisLogger.info(`~~~~~~~ validate for ${x},${y}`);
            thisLogger.info(`@canvas: ${this.canvas.width},${this.canvas.height}`);
            thisLogger.info(`@image: ${image.naturalWidth},${image.naturalHeight}`);

            const {x: newX = 0, y: newY = 0, width: newWidth = 0, height: newHeight = 0} = onValidate({
                canvas: this.canvas, image: image, x, y, width, height
            });

            thisLogger.info("calc:", {newX, newY, newWidth, newHeight});

            const ctx = this.canvas.getContext('2d');
            this.topLeft.reset({x: newX, y: newY});
            ctx.drawImage(image, this.topLeft.x, this.topLeft.y, newWidth, newHeight);
            thisLogger.info(`~~~~~~~ validated: topLeft:(${this.topLeft.x},${this.topLeft.y}), size:${newWidth},${newHeight}`);
        }
    }

    /**
     * @description Draw provided {@link HTMLImageElement} image onto canvas view
     * @param image {HTMLImageElement} Image to draw onto canvas view
     * @param [options] {Object} Configuration options
     * @param [options.x=] {Number} The custom horizontal position of image
     * @param [options.y=] {Number} The custom vertical position of image
     * @param [options.onValidate=] {function(PhotoDrawInfoPayload):PhotoDrawInfoPayload} Callback which occurred on validation phase
     * @returns {CanvasView}
     */
    drawFromImage(image, options = undefined) {
        if (image) {
            const imgWidth = image.naturalWidth;
            const imgHeight = image.naturalHeight;
            this.canvas.width = imgWidth;
            this.canvas.height = imgWidth * VIEW_RECT_ASPECT_RATIO;
            const {x, y, onValidate} = options ?? {}

            this.invalidate({
                canvas: this.canvas, image, x, y, width: imgWidth, height: imgHeight, onValidate
            });
        }
        return this;
    }

}

thisLogger.setEnabled(false);

export default CanvasView;
