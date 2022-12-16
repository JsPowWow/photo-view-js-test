import {isDefined} from "../supportClasses/utils";

export const buildDescription = (editor) => {
    return {
        "canvas": {
            "version": "0.0.1",
            "width": editor.width,
            "height": editor.height,
            ...editor.image
                ? {
                    "photo": {
                        "id": editor.imageId,
                        "width": editor.image.width,
                        "height": editor.image.height,
                        "x": editor.scrollPosition.x,
                        "y": editor.scrollPosition.y,

                    }
                }
                : {photo: {}}
        }
    }
}

/**
 *
 * @param editor {Editor}
 */
export const adjustScrollPosition = (editor) => {
    if (isDefined(editor.image)) {
        // adjust preset setting
        const {
            canvas: {
                photo: {
                    x: xPos = 0,
                    y: yPos = 0
                }
            }
        } = editor.presets.get(editor.imageId) ?? {canvas: {photo: {x: 0, y: 0}}}

        editor.scrollPosition.reset({xPos, yPos});

        editor.redraw();
        editor.redraw();
        editor.redraw();
        // TODO test bul updates,  remove redraw here
    }
}
