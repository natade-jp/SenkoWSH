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
 * SenkoWSH
 */
// @ts-ignore
// eslint-disable-next-line no-undef
const SenkoWSH = {
	
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

export default SenkoWSH;

if(!(typeSystem.isDefined("CSV"))) {
	// @ts-ignore
	// eslint-disable-next-line no-undef
	CSV = typeCSV;
}

if(!(typeSystem.isDefined("Dialog"))) {
	// @ts-ignore
	// eslint-disable-next-line no-undef
	Dialog = typeDialog;
}

if(!(typeSystem.isDefined("SFile"))) {
	// @ts-ignore
	// eslint-disable-next-line no-undef
	SFile = typeSFile;
}

if(!(typeSystem.isDefined("Robot"))) {
	// @ts-ignore
	// eslint-disable-next-line no-undef
	Robot = typeRobot;
}

if(!(typeSystem.isDefined("Format"))) {
	// @ts-ignore
	// eslint-disable-next-line no-undef
	Format = typeFormat;
}

if(!(typeSystem.isDefined("Random"))) {
	// @ts-ignore
	// eslint-disable-next-line no-undef
	Random = typeRandom;
}

if(!(typeSystem.isDefined("Japanese"))) {
	// @ts-ignore
	// eslint-disable-next-line no-undef
	Japanese = typeJapanese;
}

if(!(typeSystem.isDefined("StringComparator"))) {
	// @ts-ignore
	// eslint-disable-next-line no-undef
	StringComparator = typeStringComparator;
}

if(!(typeSystem.isDefined("System"))) {
	// @ts-ignore
	// eslint-disable-next-line no-undef
	System = typeSystem;
}

if(!(typeSystem.isDefined("console"))) {
	// @ts-ignore
	// eslint-disable-next-line no-global-assign
	global.console = {}
}

if(console.log === undefined) {
	// @ts-ignore
	console.log = function(text) {
		if((/cscript\.exe$/i.test(WSH.FullName))) {
			typeSystem.println(text);
		}
	}
}

