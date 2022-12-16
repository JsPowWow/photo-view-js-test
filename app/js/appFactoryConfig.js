import LocalImageLoader from "./supportClasses/serialization/LocalImageLoader";
import JsonFileExporter from "./supportClasses/serialization/JsonFileExporter";
import ClassFactory from "./supportClasses/ClassFactory";
import {IMG_FILE_DESCRIPTION_ELECTOR_ID, IMG_FILE_SELECTOR_ID} from "./constants";
import JsonFileLoader from "./supportClasses/serialization/JsonFileLoader";

const descriptionExporterFactory = new ClassFactory(JsonFileExporter);
const imgImporterFactory = new ClassFactory(LocalImageLoader, {constructorArgs: [IMG_FILE_SELECTOR_ID]})
const imgDescriptionImporterFactory = new ClassFactory(JsonFileLoader, {constructorArgs: [IMG_FILE_DESCRIPTION_ELECTOR_ID]})

export default {
    /**
     * @return {Importer}
     */
    getImageFileImporter: () => imgImporterFactory.newInstance(),
    /**
     * @return {Exporter}
     */
    getPrintDescriptionExporter: () => descriptionExporterFactory.newInstance(),
    /**
     * @return {Importer}
     */
    getPrintDescriptionImporter: () => imgDescriptionImporterFactory.newInstance(),
}
