import {isDefined} from "../supportClasses/utils";
import {getLogger} from "../supportClasses/Logger";
import {getViewPreferences, buildViewPreferences} from "./utils";

const thisLogger = getLogger('EditorLogging');

class PhotoViewer {
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

    /**
     *
     * @param [options] {Object}
     * @param [options.offsetX=0] {Number}
     * @param [options.offsetY=0] {Number}
     */
    redraw(options = {offsetX: 0, offsetY: 0}) {
        if (isDefined(this.image)) {
            const {offsetX = this.surface.offset.x, offsetY = this.surface.offset.y} = options ?? {offsetX: 0, offsetY: 0};
            this.surface
                .drawFromImage(this.image, {offsetX, offsetY});
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
                offsetX: preferences.canvas.photo.x - this.surface.topLeft.x + this.surface.offset.x,
                offsetY: preferences.canvas.photo.y - this.surface.topLeft.y + this.surface.offset.y })
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
                offsetX: preferences.canvas.photo.x - this.surface.topLeft.x + this.surface.offset.x,
                offsetY: preferences.canvas.photo.y - this.surface.topLeft.y + this.surface.offset.y })
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
            const offsetX = this.surface.offset.x + xBy;
            const offsetY = this.surface.offset.y + yBy;
            this.redraw({offsetX, offsetY});
        }
    }
}

thisLogger.setEnabled(true);

export default PhotoViewer;
