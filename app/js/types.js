/**
 * The Typescript / JSDoc type(s) / annotation(s)
 */

/**
 * @typedef Importer The abstract Importer type interface
 * @property {function():Promise<{id:String,data:*}>} import
 */

/**
 * @typedef Exporter The abstract Exporter type interface
 * @property {function(data:*):Promise<{id:String,data:*}>} export
 */

/**
 * @typedef Factory The abstract Object Factory interface
 * @property {function():*} newInstance
 */

/**
 * @typedef PrintDescription The print description Object info
 * @property {String} version
 * @property {Object} canvas
 * @property {Number} canvas.width
 * @property {Number} canvas.height
 * @property {Object} canvas.photo
 * @property {String} canvas.photo.id
 * @property {Number} canvas.photo.x
 * @property {Number} canvas.photo.y
 * @property {Number} canvas.photo.width
 * @property {Number} canvas.photo.height
 */

/**
 * @typedef PhotoDrawInfoPayload Draw image payload
 * @property {HTMLCanvasElement} canvas The Canvas object reference to draw image within
 * @property {HTMLImageElement} image The Image object reference to draw onto canvas
 * @property {Number} x The horizontal position of image
 * @property {Number} y The vertical position of image
 * @property {Number} width The width of image to draw
 * @property {Number} height The height of image to draw
 * @property {function(PhotoDrawInfoPayload):PhotoDrawInfoPayload} [onValidate] Callback which executed on validation phase
 */

