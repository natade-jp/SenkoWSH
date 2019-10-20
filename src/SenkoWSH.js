/**
 * The script is part of SenkoWSH.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import typeCSV from "./CSV.js";
import typeDialog from "./Dialog.js";
import typeSFile from "./SFile.js";
import typeFormat from "./Format.js";
import typeRandom from "./Random.js";
import typeSystem from "./System.js";

/**
 * @type {typeof typeCSV}
 * @private
 */
// @ts-ignore
// eslint-disable-next-line no-undef
CSV = typeCSV;

/**
 * @type {typeof typeDialog}
 * @private
 */
// @ts-ignore
// eslint-disable-next-line no-undef
Dialog = typeDialog;

/**
 * @type {typeof typeSFile}
 * @private
 */
// @ts-ignore
// eslint-disable-next-line no-undef
SFile = typeSFile;

/**
 * @type {typeof typeFormat}
 * @private
 */
// @ts-ignore
// eslint-disable-next-line no-undef
Format = typeFormat;

/**
 * @type {typeof typeRandom}
 * @private
 */
// @ts-ignore
// eslint-disable-next-line no-undef
Random = typeRandom;

/**
 * @type {typeof typeSystem}
 * @private
 */
// @ts-ignore
// eslint-disable-next-line no-undef
System = typeSystem;

/**
 * @private
 */
// @ts-ignore
// eslint-disable-next-line no-global-assign
console = {
	// @ts-ignore
	log : function(text) {
		// eslint-disable-next-line no-undef
		System.out.println(text);
	}
};

import typeExtendsArray from "./ExtendsArray.js";
import typeExtendsObject from "./ExtendsObject.js";
import typeExtendsString from "./ExtendsString.js";

/**
 * @type {typeof typeExtendsArray}
 * @private
 */
// @ts-ignore
// eslint-disable-next-line no-undef
ExtendsArray = typeExtendsArray;

/**
 * @type {typeof typeExtendsObject}
 * @private
 */
// @ts-ignore
// eslint-disable-next-line no-undef
ExtendsObject = typeExtendsObject;

/**
 * @type {typeof typeExtendsString}
 * @private
 */
// @ts-ignore
// eslint-disable-next-line no-undef
ExtendsString = typeExtendsString;

/**
 * @param {any} original 
 * @param {any} extension
 * @returns {any}
 * @private
 * @ignore
 */
const extendClass = function(original, extension) {
	for(const key in extension) {
		original.prototype[key] = function() {
			const x = [];
			x.push(this);
			for(let i = 0 ; i < arguments.length ; i++) {
				x.push(arguments[i]);
			}
			return extension[key].apply(this, x);
		};
	}
};

extendClass(String, typeExtendsArray);
extendClass(String, typeExtendsObject);
extendClass(String, typeExtendsString);
