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
	 * 文字列を表示（最終行で自動で改行されない）
	 * @param {any} text
	 */
    static print(text);
    
	/**
	 * 文字列を表示（最終行で自動で改行される）
	 * @param {any} text
	 */
	static println(text);

	/**
	 * 指定したフォーマットで整形した文字列を表示
	 * @param {any} text 
	 * @param {...any} parm パラメータは可変引数
	 */
	static printf();
}

/**
 * システム
 */
declare class System {

	/**
	 * 出力
	 */
    static out: typeof SystemOut;

	/**
	 * キーボードのテキスト入力を取得
	 * @returns {string}
	 */
    static readLine();
    
	/**
	 * UNIX時間をミリ秒で取得
	 * @returns {number}
	 */
    static currentTimeMillis();
    
	/**
	 * 処理を一時停止
	 * @param {number} time_sec
	 */
    static sleep(time_sec);
    
	/**
	 * 処理を停止
	 */
	static stop();

	/**
	 * CUIで起動しなおす
	 */
    static executeOnCScript();
    
	/**
	 * GUIで起動しなおす
	 */
    static executeOnCScript();
    
	/**
	 * スクリプトファイルへの引数を取得
	 * @returns {string[]}
	 */
    static getArguments();
    
	/**
	 * カレントディレクトリを設定
	 * @param {string} filename
	 */
	static setCurrentDirectory(filename);

	/**
	 * カレントディレクトリを取得
	 * @returns {string}
	 */
    static getCurrentDirectory();
    
	/**
	 * 実行中のスクリプトがあるカレントディレクトリを取得
	 * @returns {string}
	 */
    static getScriptDirectory();
	
	/**
	 * 実行中のスクリプトがあるディレクトリをカレントディレクトリに設定
	 */
    static initializeCurrentDirectory();
    
}
