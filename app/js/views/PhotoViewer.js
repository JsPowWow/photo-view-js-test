import {isDefined} from "../supportClasses/utils";
import {getLogger} from "../supportClasses/Logger";
import {buildViewPreferences, getViewPreferences} from "./utils";

const thisLogger = getLogger('EditorLogging');

class PhotoViewer {

    constructor() {
        this.fixScrollPosition = this.fixScrollPosition.bind(this)
    }

    /**
     * @type {CanvasView}
     */
    #surface

    /**
     * @type {HTMLImageElement}
     */
    #image

    /**
     * @type {String}
     */
    #imageId

    /**
     * @type {Map<String, PrintDescription>}
     */
    #presets = new Map();

    get surface() {
        return this.#surface;
    }

    /**
     * @type {HTMLImageElement}
     */
    get image() {
        return this.#image;
    }

    get imageId() {
        return this.#imageId;
    }

    /**
     * @type {Map<String, PrintDescription>}
     */
    get presets() {
        return this.#presets;
    }

    /**
     * @return {number}
     */
    get width() {
        return this.surface.canvas.width
    }

    /**
     * @return {number}
     */
    get height() {
        return this.surface.canvas.height
    }

    /**
     *
     * @param surface {CanvasView}
     * @returns {PhotoViewer}
     */
    withSurface(surface) {
        this.#surface = surface;
        return this;
    }

    fixScrollPosition(viewDrawInfos) {
        const result = {...viewDrawInfos}

        const {x: newX, width: newWidth} = result;
        if (newX > 0) {
            Object.assign(result, {x: 0})
        } else if ((newX + newWidth < this.surface.canvas.width)) {
            Object.assign(result, {x: this.surface.canvas.width - newWidth})
        }

        const {y: newY, height: newHeight} = result;
        if (newY > 0) {
            Object.assign(result, {y: 0})
        } else if ((newY + newHeight < this.surface.canvas.height)) {
            Object.assign(result, {y: this.surface.canvas.height - newHeight})
        }
        return result
    }

    /**
     *
     * @param [options=] {Object}
     * @param [options.x=] {Number}
     * @param [options.y=] {Number}
     */
    redraw(options) {
        if (isDefined(this.image)) {
            this.surface
                .drawFromImage(this.image, {x: options?.x, y: options?.y, onValidate: this.fixScrollPosition});
        }
    }

    /**
     *
     * @param {Importer} importer
     * @returns {Promise<PhotoViewer>}
     */
    async importImage(importer) {
        const {id: imageId, data: image} = await importer.import();
        this.#image = image;
        this.#imageId = imageId;
        if (this.presets.has(imageId)) {
            const preferences = getViewPreferences(this);
            thisLogger.info("pref(i):", preferences)
            this.redraw({
                x: preferences.canvas.photo.x,
                y: preferences.canvas.photo.y
            })
        } else {
            this.redraw();
        }
        return this;
    }

    /**
     *
     * @param {Importer} importer
     * @returns {Promise<PhotoViewer>}
     */
    async importDescription(importer) {
        const {data} = await importer.import();
        const photoId = data.canvas?.photo?.id;
        this.#presets.set(photoId, data);

        if (this.presets.has(this.imageId)) {
            const preferences = getViewPreferences(this);
            thisLogger.info("pref(d):", preferences)
            this.redraw({
                x: preferences.canvas.photo.x,
                y: preferences.canvas.photo.y
            })
        } else {
            this.redraw();
        }
        return this;
    }

    /**
     *
     * @param exporter {Exporter}
     * @return {Promise<PhotoViewer>}
     */
    async exportDescription(exporter) {
        await exporter.export(buildViewPreferences(this));
        return this;
    }

    scrollBy(xBy, yBy) {
        if (isDefined(this.image)) {
            const x = this.surface.topLeft.x + xBy;
            const y = this.surface.topLeft.y + yBy;
            this.redraw({x, y});
        }
    }
}

thisLogger.setEnabled(true);

export default PhotoViewer;
