import '../css/main.scss'
import CanvasView from './canvasView/CanvasView'
import Editor from "./editor/Editor";
import {getLogger} from "./supportClasses/Logger";
import Factory from "./appFactoryConfig";
import {HORIZONTAL_SCROLL_STEP, VERTICAL_SCROLL_STEP} from "./constants";

const thisLogger = getLogger('MyAppViewLogging');

const getElementById = (elementId) => document.getElementById(elementId);

const AppView = () => {

    const editor = new Editor()
        .withSurface(new CanvasView()
            .withElement(getElementById("editorCanvas")));

    getElementById("fileSelector")
        .onchange = () => {
        thisLogger.info('Process image import....');
        editor
            .importImage(Factory.getImageFileImporter())
            .then(() => thisLogger.info(`The image is successfully imported.`))
            .catch(thisLogger.error);
    };

    // bind action buttons to editor
    getElementById("btnMoveUp").onclick = () => {
        editor.scrollBy(0, -VERTICAL_SCROLL_STEP)
    };

    getElementById("btnMoveDown").onclick = () => {
        editor.scrollBy(0, VERTICAL_SCROLL_STEP);
    };

    getElementById("btnMoveLeft").onclick = () => {
        editor.scrollBy(-HORIZONTAL_SCROLL_STEP, 0);
    }

    getElementById("btnMoveRight").onclick = () => {
        editor.scrollBy(HORIZONTAL_SCROLL_STEP, 0);
    }

    getElementById("btnSave").onclick = () => {
        editor
            .exportDescription(Factory.getPrintDescriptionExporter())
            .then(() => thisLogger.info(`The image print description is successfully exported.`))
            .catch(thisLogger.error);
    };

    getElementById("descriptionFileSelector")
        .onchange = ()=> {
        thisLogger.info('Process image description import....');
        editor
            .importDescription(Factory.getPrintDescriptionImporter())
            .then(() => thisLogger.info(`The image description is successfully imported.`))
            .catch(thisLogger.error);
    };

};


AppView();

thisLogger.setEnabled(true);


/**
 * TODO Scenario #1
 *  [x] The user can select a photo file from his/her device and import it into the application
 *  [x] The user can position this photo on a canvas.
 *  [ ] The user can scale this photo on a canvas.
 *  [ ] Important: Photo must always cover the full canvas.
 *  [ ] Hit a submit button which will generate the print description.
 *  [ ] These instructions should be stored locally as a JSON file.
 */


/**
 * TODO General
 *  [ ] Don't forget to add the necessary documentations and tests.
 */
