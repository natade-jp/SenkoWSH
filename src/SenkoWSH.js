/**
 * The script is part of SenkoWSH.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import Polyfill from "./senko/polyfill/Polyfill.js";
import typeCSV from "./senko/CSV.js";
import typeDialog from "./senko/Dialog.js";
import typeSFile from "./senko/SFile.js";
import typeRobot from "./senko/Robot.js";
import typeFormat from "./senko/Format.js";
import typeRandom from "./konpeito/Random.js";
import typeJapanese from "./mojijs/Japanese.js";
import typeStringComparator from "./mojijs/StringComparator.js";
import typeSystem from "./senko/System.js";

/**
 * 上書き防止用
 * @private
 */
// @ts-ignore
// eslint-disable-next-line no-undef
SenkoWSH = {
	
	/**
 	 * @type {typeof typeCSV}
	 */
	CSV : typeCSV,
	
	/**
 	 * @type {typeof typeDialog}
	 */
	Dialog : typeDialog,

	/**
 	 * @type {typeof typeSFile}
	 */
	 SFile : typeSFile,

	/**
 	 * @type {typeof typeRobot}
	 */
	 Robot : typeRobot,

	/**
 	 * @type {typeof typeFormat}
	 */
	 Format : typeFormat,

	/**
 	 * @type {typeof typeRandom}
	 */
	 Random : typeRandom,

	/**
 	 * @type {typeof typeJapanese}
	 */
	 Japanese : typeJapanese,

	/**
 	 * @type {typeof typeStringComparator}
	 */
	 StringComparator : typeStringComparator,

	/**
 	 * @type {typeof typeSystem}
	 */
	 System : typeSystem,

};

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
 * @type {typeof typeRobot}
 * @private
 */
// @ts-ignore
// eslint-disable-next-line no-undef
Robot = typeRobot;

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
 * @type {typeof typeJapanese}
 * @private
 */
// @ts-ignore
// eslint-disable-next-line no-undef
Japanese = typeJapanese;

/**
 * @type {typeof typeStringComparator}
 * @private
 */
// @ts-ignore
// eslint-disable-next-line no-undef
StringComparator = typeStringComparator;

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
		// @ts-ignore
		// eslint-disable-next-line no-undef
		SenkoWSH.System.println(text);
	}
};

