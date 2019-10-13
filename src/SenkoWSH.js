/**
 * The script is part of SenkoWSH.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import typeArrayList from "./ArrayList.js";
import typeCSV from "./CSV.js";
import typeDialog from "./Dialog.js";
import typeSFile from "./SFile.js";
import typeFormat from "./Format.js";
import typeHashMap from "./HashMap.js";
import typeRandom from "./Random.js";
import typeSystem from "./System.js";

/**
 * @type {typeof typeArrayList}
 * @private
 */
// @ts-ignore
// eslint-disable-next-line no-undef
ArrayList = typeArrayList;

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
 * @type {typeof typeHashMap}
 * @private
 */
// @ts-ignore
// eslint-disable-next-line no-undef
HashMap = typeHashMap;

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

import StringWSH from "./StringWSH.js";

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

// @ts-ignore
String.prototype.replaceAll = function(target, replacement) {
	// @ts-ignore
	return StringWSH.replaceAll(this, target, replacement);
};

// @ts-ignore
String.prototype.trim = function() {
	// @ts-ignore
	return StringWSH.trim(this);
};

// @ts-ignore
String.prototype.each = function(func) {
	// @ts-ignore
	return StringWSH.each(this, func);
};

// @ts-ignore
String.prototype.isHighSurrogateAt = function(index) {
	// @ts-ignore
	return StringWSH.isHighSurrogateAt(this, index);
};

// @ts-ignore
String.prototype.isLowSurrogateAt = function(index) {
	// @ts-ignore
	return StringWSH.isLowSurrogateAt(this, index);
};

// @ts-ignore
String.prototype.isSurrogatePairAt = function(index) {
	// @ts-ignore
	return StringWSH.isSurrogatePairAt(this, index);
};

// @ts-ignore
String.prototype.codePointAt = function(index) {
	// @ts-ignore
	return StringWSH.codePointAt(this, index);
};

// @ts-ignore
String.prototype.codePointBefore = function(index) {
	// @ts-ignore
	return StringWSH.codePointBefore(this, index);
};

// @ts-ignore
String.prototype.codePointCount = function(beginIndex, endIndex) {
	// @ts-ignore
	return StringWSH.codePointCount(this, beginIndex, endIndex);
};

// @ts-ignore
String.prototype.offsetByCodePoints = function(index, codePointOffset) {
	// @ts-ignore
	return StringWSH.codePointoffsetByCodePointsCount(this, index, codePointOffset);
};

// @ts-ignore
String.fromCodePoint = function(codepoint) {
	// @ts-ignore
	return StringWSH.fromCodePoint(codepoint);
};

// @ts-ignore
String.prototype.startsWith = function(prefix) {
	// @ts-ignore
	return StringWSH.startsWith(this, prefix);
};

// @ts-ignore
String.prototype.endsWith = function(prefix) {
	// @ts-ignore
	return StringWSH.endsWith(this, prefix);
};
