const saveFile = async (blob) => {
    const handle = await window.showSaveFilePicker({
        types: [{
            accept: {
                "application/json": '.json'
            },
        }],
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    return handle;
};

class JsonFileExporter {
    async export(data) {
        return await saveFile(JSON.stringify(data));
    }
}

/**
 * @type {Exporter}
 */
export default JsonFileExporter
