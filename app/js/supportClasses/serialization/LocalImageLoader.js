const SUPPORTED_FILE_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/gif"
]);

/**
 * @description TODO
 * @param file
 * @returns {Promise<string | ArrayBuffer>}
 */
const readAsDataURLAsync = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

/**
 * @description TODO
 * @param source {string | ArrayBuffer}
 * @returns {Promise<HTMLImageElement>}
 */
const getImageAsync = (source) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            resolve(image)
        }
        image.onerror = reject;
        image.src = source;
    });
};

async function processFile(inputId) {
    const file = document.getElementById(inputId).files[0];
    if (!file) {
        throw new Error('File is missing');
    }
    if (!SUPPORTED_FILE_TYPES.has(file.type)) {
        throw new Error(`The file type "${file.type}" is not supported.`);
    }
    const data = await readAsDataURLAsync(file);
    return {data, file}
}

/**
 * @type {Importer}
 */
class LocalImageLoader {
    /**
     * @type {String}
     */
    #inputId

    constructor(inputId) {
        this.#inputId = inputId;
    }

    async import() {
        const {data, file} = await processFile(this.#inputId)
        const image = await getImageAsync(data);
        return {data: image, id: file.name};
    }
}

export default LocalImageLoader;
