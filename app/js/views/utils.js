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
