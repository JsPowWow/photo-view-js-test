/**
 * @typedef Importer
 * @property {function():Promise<{id:String,data:*}>} import
 */

/**
 * @typedef Exporter
 * @property {function(data:*):Promise<{id:String,data:*}>} export
 */

/**
 * @typedef Factory
 * @property {function():*} newInstance
 */

/**
 * @typedef PrintDescription
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
