import Position from "../supportClasses/Position";
import {isDefined} from "../supportClasses/utils";
import {getLogger} from "../supportClasses/Logger";
import {adjustScrollPosition, buildDescription} from "./utils";

const thisLogger = getLogger('EditorLogging');

class Editor {
    /**
     * @type {CanvasView}
     */
    #surface
    /**
     * @type {HTMLImageElement}
     */
    #image

    get image() {
        return this.#image;
    }

    /**
     * @type {String}
     */
    #imageId

    get imageId() {
        return this.#imageId;
    }

    #scrollPosition = new Position();

    /**
     * @type {Map<String, PrintDescription>}
     */
    #presets = new Map();

    /**
     * @type {Map<String, PrintDescription>}
     */
    get presets() {
        return this.#presets;
    }

    /**
     * @return {Position}
     */
    get scrollPosition() {
        return this.#scrollPosition
    }

    /**
     * @return {number}
     */
    get width() {
        return this.#surface.canvas.width
    }

    /**
     * @return {number}
     */
    get height() {
        return this.#surface.canvas.height
    }

    /**
     *
     * @param surface {CanvasView}
     * @returns {Editor}
     */
    withSurface(surface) {
        this.#surface = surface;
        return this;
    }

    redraw() {
        if (isDefined(this.#surface)) {
            this.#surface.clear();
            if (isDefined(this.#image)) {
                this.#surface
                    .drawFromImage(this.#image, {offsetX: this.#scrollPosition.x, offsetY: this.#scrollPosition.y});
            }
        }
    }

    /**
     *
     * @param {Importer} importer
     * @returns {Promise<Editor>}
     */
    async importImage(importer) {
        const {id: imageId, data: image} = await importer.import();
        this.#image = image;
        this.#imageId = imageId;
        adjustScrollPosition(this);
        this.redraw();

        return this;
    }

    /**
     *
     * @param {Importer} importer
     * @returns {Promise<Editor>}
     */
    async importDescription(importer) {
        const {data} = await importer.import();
        const photoId = data.canvas?.photo?.id;
        this.#presets.set(photoId, data);
        adjustScrollPosition(this);
        this.redraw();
        return this;
    }

    /**
     *
     * @param exporter {Exporter}
     * @return {Promise<Editor>}
     */
    async exportDescription(exporter) {
        await exporter.export(buildDescription(this));
        return this;
    }

    scrollBy(xBy, yBy) {
        if (isDefined(this.#image)) {
            const targetRect = this.#surface.computeTargetRect(this.#image);
            thisLogger.info('scr:' , targetRect)
            this.#scrollPosition.moveBy(xBy, yBy);
            this.redraw();
        }
    }
}

thisLogger.setEnabled(true);

export default Editor;
