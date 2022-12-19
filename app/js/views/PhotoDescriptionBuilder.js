import {isDefined} from "../supportClasses/utils";
import {VIEW_WIDTH_IN_INCHES} from "../constants";

class PhotoDescriptionBuilder {
    /**
     * @type {PhotoViewer}
     */
    #preview

    /**
     * @description The preview canvas 1inch = {#inchToPixel}pixels size value
     * @type {Number}
     */
    #inchToPixel;

    /**
     * @description Bind the PhotoDescriptionBuilder with provided {@link PhotoViewer} preview
     * @param {PhotoViewer} preview
     * @returns {PhotoDescriptionBuilder}
     */
    withPreview(preview) {
        this.#preview = preview;
        if (!this.#inchToPixel && preview.surface.canvas) {
            this.#inchToPixel = preview.surface.width / VIEW_WIDTH_IN_INCHES;
        }
        return this;
    }

    /**
     * @description Convert the provided logical pixels value to inches
     * @param {Number} valueInPixels
     * @returns {Number}
     */
    toInches(valueInPixels) {
        return (valueInPixels / this.#inchToPixel);
    };

    /**
     * @description Convert the provided inches value to logical pixels
     * @param valueInInches
     * @returns {Number}
     */
    toPixels(valueInInches) {
        return (valueInInches * this.#inchToPixel);
    }

    /**
     * @description Build the photo print description
     * @returns {PrintDescription}
     */
    buildViewPreferences() {
        return {
            "version": "0.0.3",
            "canvas": {
                "width": this.toInches(this.#preview.surface.width),
                "height": this.toInches(this.#preview.surface.height),
                ...isDefined(this.#preview.image) && isDefined(this.#preview.imageId)
                    ? {
                        "photo": {
                            "id": this.#preview.imageId,
                            "x": this.toInches(this.#preview.surface.topLeft.x),
                            "y": this.toInches(this.#preview.surface.topLeft.y),
                            "width": this.toInches(this.#preview.image.naturalWidth),
                            "height": this.toInches(this.#preview.image.naturalHeight),
                        }
                    }
                    : {photo: {}}
            }
        }
    }

    /**
     * @param description {PrintDescription}
     * @returns {PrintDescription}
     */
    restoreViewPreferences(description) {
        if (description) {
            return {
                version: description.version,
                canvas: {
                    width: this.toPixels(description.canvas.width),
                    height: this.toPixels(description.canvas.height),
                    photo: {
                        id: description.canvas.photo.id,
                        x: this.toPixels(description.canvas.photo.x),
                        y: this.toPixels(description.canvas.photo.y),
                        width: this.toPixels(description.canvas.photo.width),
                        height: this.toPixels(description.canvas.photo.height),
                    }
                }
            }
        }
        return undefined;
    }
}

export default PhotoDescriptionBuilder;
