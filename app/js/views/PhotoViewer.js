import {isDefined} from "../supportClasses/utils";
import {getLogger} from "../supportClasses/Logger";
import PhotoDescriptionBuilder from "./PhotoDescriptionBuilder";

const thisLogger = getLogger('EditorLoggingOutput');

/**
 * @description Perform the default image draw rect calculation: fit image to the maximum of provided canvas area and center.
 * @param {PhotoDrawInfoPayload} config
 * @return {PhotoDrawInfoPayload}
 */
const fitToCanvasArea = (config) => {
    const {canvas, image} = config;
    const srcWidth = image.naturalWidth;
    const srcHeight = image.naturalHeight;

    const hRatio = canvas.width / srcWidth;
    const vRatio = canvas.height / srcHeight;

    const scaleFactor = Math.max(hRatio, vRatio);

    const newWidth = srcWidth * scaleFactor;
    const newHeight = srcHeight * scaleFactor;

    const x = (canvas.width * 0.5) - (newWidth * 0.5);
    const y = (canvas.height * 0.5) - (newHeight * 0.5);

    return {...config, x, y, width: newWidth, height: newHeight};
}

/**
 * @description Perform the image draw rect position correction fixes to respect "fit the maximum of provided canvas area";
 * @param {PhotoDrawInfoPayload} config
 * @return {PhotoDrawInfoPayload}
 */
const fixScrollPosition = (config) => {
    const result = {...config};
    const {x: newX, width: newWidth, canvas} = config;

    if (newX > 0) {
        Object.assign(result, {x: 0})
    } else if ((newX + newWidth < canvas.width)) {
        Object.assign(result, {x: canvas.width - newWidth})
    }

    const {y: newY, height: newHeight} = result;
    if (newY > 0) {
        Object.assign(result, {y: 0})
    } else if ((newY + newHeight < canvas.height)) {
        Object.assign(result, {y: canvas.height - newHeight})
    }
    return result
}

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

    constructor() {
        this.validateImagePosition = this.validateImagePosition.bind(this)
    }

    /**
     * @return {CanvasView}
     */
    get surface() {
        return this.#surface;
    }

    /**
     * @type {HTMLImageElement}
     */
    get image() {
        return this.#image;
    }

    /**
     * @return {String}
     */
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
     * @param surface {CanvasView}
     * @returns {PhotoViewer}
     */
    withSurface(surface) {
        this.#surface = surface;
        return this;
    }

    /**
     * @description Perform the necessary validation(s) to draw photo correct and respect the "Photo must always cover the full canvas" rule
     * @param {PhotoDrawInfoPayload} viewDrawInfos
     * @return {PhotoDrawInfoPayload}
     */
    validateImagePosition(viewDrawInfos) {
        // Draw default first...
        const result = fitToCanvasArea({...viewDrawInfos});
        const {x: xPos, y: yPos} = viewDrawInfos;
        // Adjust the provided custom x-, y- position(s)
        if (isDefined(xPos)) {
            Object.assign(result, {x: xPos});
        }
        if (isDefined(yPos)) {
            Object.assign(result, {y: yPos});
        }
        // Fix and return the right info(s)
        return fixScrollPosition(result);
    }

    /**
     * @description Perform photo image re-draw with provided options
     * @param [options=] {Object}
     * @param [options.x=] {Number}
     * @param [options.y=] {Number}
     */
    redraw(options) {
        if (isDefined(this.image)) {
            this.surface
                .drawFromImage(this.image, {
                    x: options?.x,
                    y: options?.y,
                    onValidate: this.validateImagePosition
                });
        }
    }

    /**
     * @param {Importer} importer
     * @returns {Promise<PhotoViewer>}
     */
    async importImage(importer) {
        const {id: imageId, data: image} = await importer.import();
        this.#image = image;
        this.#imageId = imageId;
        if (this.presets.has(imageId)) {
            const preferences = this.presets.get(imageId);
            thisLogger.info("importImage(adjust current preferences):", preferences)
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
     * @param {Importer} importer
     * @returns {Promise<PhotoViewer>}
     */
    async importDescription(importer) {
        const {data} = await importer.import();
        const description = new PhotoDescriptionBuilder()
            .withPreview(this)
            .restoreViewPreferences(data);

        const photoId = description.canvas?.photo?.id;
        this.#presets.set(photoId, description);

        if (this.presets.has(this.imageId)) {
            const preferences = this.presets.get(this.imageId);
            thisLogger.info("importDescription(adjust to current image):", preferences)
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
     * @param exporter {Exporter}
     * @return {Promise<PhotoViewer>}
     */
    async exportDescription(exporter) {
        await exporter.export(
            new PhotoDescriptionBuilder()
                .withPreview(this)
                .buildViewPreferences());
        return this;
    }

    /**
     * @description Move the current photo by provided xBy-, yBy- percents relative to current photo position
     * @param {Number} xBy The "xBy" percentage value to move photo relative to current photo horizontal position
     * @param {Number} yBy The "yBy" percentage value to move photo relative to current photo vertical position
     */
    scrollBy(xBy, yBy) {
        if (isDefined(this.image)) {
            const x = this.surface.topLeft.x + (xBy * this.surface.width / 100);
            const y = this.surface.topLeft.y + (yBy * this.surface.height / 100);
            this.redraw({x, y});
        }
    }
}

thisLogger.setEnabled(false);

export default PhotoViewer;
