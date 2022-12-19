const SUPPORTED_FILE_TYPES = new Set([
    "application/json"
]);

/**
 * @description Read provided file as "json"
 * @param {File} file
 * @returns {Promise<string | ArrayBuffer>}
 */
const readDataAsync = (file) => {
    return new Promise((resolve, reject) => {
        new Response(file).json().then(json => {
            resolve(json);
        }, err => {
            reject(err);
        })
    });
};

/**
 * @description Process the File Selection using "Open File dialog"
 * @param {String} inputId The appropriate html input type="file" element id
 * @return {Promise<{file: *, data: (string|ArrayBuffer)}>}
 */
async function processFile(inputId) {
    const file = document.getElementById(inputId).files[0];
    if (!file) {
        throw new Error('File is missing');
    }
    if (!SUPPORTED_FILE_TYPES.has(file.type)) {
        throw new Error(`The file type "${file.type}" is not supported.`);
    }
    const data = await readDataAsync(file);
    return {data, file}
}

/**
 * @type {Importer}
 */
class JsonFileLoader {
    /**
     * @type {String}
     */
    #inputId

    constructor(inputId) {
        this.#inputId = inputId;
    }

    async import() {
        const {data, file} = await processFile(this.#inputId)
        return {data, id: file.name};
    }
}

/**
 * @type {Importer}
 */
export default JsonFileLoader;
