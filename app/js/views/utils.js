/**
 * @param preview {PhotoViewer}
 */
export const buildViewPreferences = (preview) => {
    return {
        "version": "0.0.2",
        "canvas": {
            "width": preview.width,
            "height": preview.height,
            ...preview.image
                ? {
                    "photo": {
                        "id": preview.imageId,
                        "width": preview.image.width,
                        "height": preview.image.height,
                        "x": preview.surface.topLeft.x,
                        "y": preview.surface.topLeft.y,

                    }
                }
                : {photo: {}}
        }
    }
}

/**
 * @param preview {PhotoViewer}
 */
export const getViewPreferences = (preview) => {
    if (preview.presets.has(preview.imageId)) {
        // adjust preset setting
        const {
            version,
            canvas: {
                photo: {
                    x = 0,
                    y = 0
                }
            }
        } = preview.presets.get(preview.imageId) ?? {canvas: {photo: {x: 0, y: 0}}}
        return {
            version,
            canvas: {
                photo: {
                    x,
                    y
                }
            }
        }
    }
    return undefined;
}

/**
 * @param canvas {HTMLCanvasElement}
 * @param image {HTMLImageElement}
 * @param [xPos] {Number}
 * @param [yPos] {Number}
 * @return {{x: number, width: number, y: number, height: number}}
 */
export const computeTargetRect = ({canvas, image, x: xPos, y: yPos}) => {
    const srcWidth = image.naturalWidth;
    const srcHeight = image.naturalHeight;

    const hRatio = canvas.width / srcWidth;
    const vRatio = canvas.height / srcHeight;

    const scaleFactor = Math.max(hRatio, vRatio);

    const newWidth = srcWidth * scaleFactor;
    const newHeight = srcHeight * scaleFactor;

    const x = xPos ?? (canvas.width * 0.5) - (newWidth * 0.5);
    const y = yPos ?? (canvas.height * 0.5) - (newHeight * 0.5);

    return {x, y, width: newWidth, height: newHeight};
}
