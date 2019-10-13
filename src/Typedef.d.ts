/**
 * The script is part of SenkoWSH.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

/**
 * 出力
 */
declare class SystemOut {

	/**
	 * @param {any} text
	 */
    static print(text);
    
	/**
	 * @param {any} text
	 */
	static println(text);

	/**
	 * @param {any} text 
	 * @param {...any} parm パラメータは可変引数
	 */
	static printf();
}

/**
 * システム
 */
declare class System {

    static out: typeof SystemOut;

	/**
	 * @returns {string}
	 */
    static readLine();
    
	/**
	 * @returns {number}
	 */
    static currentTimeMillis();
    
	/**
	 * @param {number} time
	 */
    static sleep(time);
    
	static stop();

    static executeOnCScript();
    
    static executeOnCScript();
    
	/**
	 * @returns {string[]}
	 */
    static getArguments();
    
	/**
	 * @param {string} filename
	 */
	static setCurrentDirectory(filename);

	/**
	 * @returns {string}
	 */
    static getCurrentDirectory();
    
	/**
	 * @returns {string}
	 */
    static getScriptDirectory();
    
    static initializeCurrentDirectory();
    
}
