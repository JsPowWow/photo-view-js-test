import '../css/main.scss'
import CanvasView from './views/CanvasView'
import PhotoViewer from "./views/PhotoViewer";
import {getLogger} from "./supportClasses/Logger";
import Factory from "./appFactoryConfig";
import {HORIZONTAL_SCROLL_STEP, VERTICAL_SCROLL_STEP} from "./constants";

const thisLogger = getLogger('MyAppViewLogging');

const getElementById = (elementId) => document.getElementById(elementId);

const AppView = () => {

    const editor = new PhotoViewer()
        .withSurface(new CanvasView()
            .withElement(getElementById("editorCanvas")));

    getElementById("fileSelector")
        .onchange = () => {
        thisLogger.info('Process image import....');
        editor
            .importImage(Factory.getImageFileImporter())
            .then(() => thisLogger.info(`The image is successfully imported.`))
            .catch(thisLogger.warn);
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
            .catch(thisLogger.warn);
    };

    getElementById("descriptionFileSelector")
        .onchange = () => {
        thisLogger.info('Process image description import....');
        editor
            .importDescription(Factory.getPrintDescriptionImporter())
            .then(() => thisLogger.info(`The image description is successfully imported.`))
            .catch(thisLogger.warn);
    };

};


AppView();

thisLogger.setEnabled(true);
