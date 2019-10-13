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
 * 配列
 * @param {{element: any[]}} [array]
 */
declare class ArrayList {
    constructor(array?: any);
    /**
     * 内部で利用しているArrayデータを取得する
     * @return {any[]}
     */
    getArray(): any[];
    /**
     * 各要素に指定した関数を実行する
     * @param {function(number, any): boolean} func
     * @returns {boolean} result
     */
    each(func: (...params: any[]) => any): boolean;
    /**
     * 文字列化
     * @returns {string}
     */
    toString(): string;
    /**
     * 空にする
     * @returns {boolean}
     */
    isEmpty(): boolean;
    /**
     * 指定したデータが含まれるか
     * @param {any} object
     * @returns {boolean}
     */
    contains(object: any): boolean;
    /**
     * 配列長
     * @returns {number}
     */
    size(): number;
    /**
     * 配列を空にする
     */
    clear(): void;
    /**
     * 結合する
     * @param {string} [separator = ","]
     * @returns {string}
     */
    join(separator?: string): string;
    /**
     * ディープコピー
     * @returns {ArrayList}
     */
    clone(): ArrayList;
    /**
     * 指定したデータが何番目に含まれるか
     * @param {any} object
     * @returns {number}
     */
    indexOf(object: any): number;
    /**
     * 配列長
     * @returns {number}
     */
    length(): number;
    /**
     * 指定したデータが何番目に含まれるか（後ろから調べる）
     * @param {any} object
     * @returns {number}
     */
    lastIndexOf(object: any): number;
    /**
     * 指定した位置の配列値を取得
     * @param {number} index
     */
    get(index: number): void;
    /**
     * 指定したデータを挿入
     * @param {any|number} index_or_object
     * @param {any} [object]
     */
    add(index_or_object: any | number, object?: any): void;
    /**
     * 指定した配列を挿入
     * @param {ArrayList|number} index_or_arraylist
     * @param {ArrayList} [arraylist]
     */
    addAll(index_or_arraylist: ArrayList | number, arraylist?: ArrayList): void;
    /**
     * 指定したデータで置き換える
     * @param {number} index
     * @param {any} object
     */
    set(index: number, object: any): void;
    /**
     * 指定した位置のデータを削除
     * @param {number} index
     */
    remove(index: number): void;
    /**
     * 指定した範囲を削除
     * @param {number} fromIndex
     * @param {number} toIndex
     */
    removeRange(fromIndex: number, toIndex: number): void;
    /**
     * 安定ソート
     * @param { function(any, any): number } [compareFunction]
     */
    sort(compareFunction?: (...params: any[]) => any): void;
    /**
     * 昇順ソート用の関数
     * @param {any} a
     * @param {any} b
     * @returns {number}
     */
    static COMPARE_DEFAULT(a: any, b: any): number;
}

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
 * CSVを扱う
 */
declare class CSV {
    /**
     * CSVテキストから配列を作成
     * @param {string} text
     * @param {string} [separator=","]
     * @returns {Array<Array<string>>}
     */
    static parse(text: string, separator?: string): string[][];
    /**
     * 配列からCSVテキストを作成
     * @param {Array<Array<string>>} csv_array
     * @param {string} [separator=","]
     * @param {string} [newline="\r\n"]
     * @returns {string}
     */
    static create(csv_array: string[][], separator?: string, newline?: string): string;
    /**
     * 1行目に列名が記載しているCSVをJSON配列に変換
     * @param {Array<Array<string>>} csv_array
     * @returns {Array<Object<string, string>>}
     */
    static toJSONArrayFromCSVArray(csv_array: string[][]): {
        [key: string]: string;
    }[];
    /**
     * 共通の型のJSON配列をCSV配列へ変換
     * @param {Array<Object<string, string>>} json_array
     * @param {Array<string>} [title_array]
     * @returns {Array<Array<string>>}
     */
    static toCSVArrayFromJSONArray(json_array: {
        [key: string]: string;
    }[], title_array?: string[]): string[][];
}

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
 * ダイアログ
 */
declare class Dialog {
    /**
     * ダイアログを表示する
     *
     * 利用例
     * - Dialog.popup("test", 0, "test", Dialog.MB_YESNOCANCEL | Dialog.MB_DEFBUTTON3);
     * @param {string} text
     * @param {number} [secondstowait=0]
     * @param {string} [caption=""]
     * @param {number} [type=0]
     * @returns {number}
     */
    static popup(text: string, secondstowait?: number, caption?: string, type?: number): number;
    /**
     * 「OK」のボタン配置
     * @type {number}
     */
    static MB_OK: number;
    /**
     * 「OK」、「キャンセル」のボタン配置
     * @type {number}
     */
    static MB_OKCANCEL: number;
    /**
     * 「中止」、「再試行」、「無視」のボタン配置
     * @type {number}
     */
    static MB_ABORTRETRYIGNORE: number;
    /**
     * 「はい」、「いいえ」、「キャンセル」のボタン配置
     * @type {number}
     */
    static MB_YESNOCANCEL: number;
    /**
     * 「はい」、「いいえ」のボタン配置
     * @type {number}
     */
    static MB_YESNO: number;
    /**
     * 「再試行」、「キャンセル」のボタン配置
     * @type {number}
     */
    static MB_RETRYCANCEL: number;
    /**
     * 中止「Stop」のアイコンのダイアログ
     * @type {number}
     */
    static MB_ICONSTOP: number;
    /**
     * 質問「?」のアイコンのダイアログ
     * @type {number}
     */
    static MB_ICONQUESTION: number;
    /**
     * 警告「!」のアイコンのダイアログ
     * @type {number}
     */
    static MB_ICONWARNING: number;
    /**
     * 情報「i」のアイコンのダイアログ
     * @type {number}
     */
    static MB_ICONINFORMATION: number;
    /**
     * 「ボタン1」を選択
     * @type {number}
     */
    static MB_DEFBUTTON1: number;
    /**
     * 「ボタン2」を選択
     * @type {number}
     */
    static MB_DEFBUTTON2: number;
    /**
     * 「ボタン3」を選択
     * @type {number}
     */
    static MB_DEFBUTTON3: number;
    /**
     * 「ボタン4」を選択
     * @type {number}
     */
    static MB_DEFBUTTON4: number;
    /**
     * タイムアウトが発生
     * @type {number}
     */
    static IDTIMEOUT: number;
    /**
     * 「OK」を選択
     * @type {number}
     */
    static IDOK: number;
    /**
     * 「キャンセル」を選択
     * @type {number}
     */
    static IDCANCEL: number;
    /**
     * 「中止」を選択
     * @type {number}
     */
    static IDABORT: number;
    /**
     * 「再試行」を選択
     * @type {number}
     */
    static IDRETRY: number;
    /**
     * 「無視」を選択
     * @type {number}
     */
    static IDIGNORE: number;
    /**
     * 「はい」を選択
     * @type {number}
     */
    static IDYES: number;
    /**
     * 「いいえ」を選択
     * @type {number}
     */
    static IDNO: number;
}

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
 * 書式に合わせて文字列を組み立てるメソッドを提供
 */
declare class Format {
    /**
     * 書式に合わせて文字列を組み立てる
     * - ロケール、日付時刻等はサポートしていません。
     * - sprintfの変換指定子のpとnはサポートしていません。
     * @param {String} text
     * @param {...any} parm パラメータは可変引数
     * @returns {String}
     */
    static textf(text: string, ...parm: any[]): string;
}

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
 * 初期化
 * @param {HashMap|Object<string, any>} [hash_map]
 */
declare class HashMap {
    constructor(hash_map?: HashMap | {
        [key: string]: any;
    });
    /**
     * 内部で利用しているArrayデータを取得する
     * @return {any}
     */
    getArray(): any;
    /**
     * 各要素に指定した関数を実行する
     * @param {function(number, any): boolean} func
     * @returns {boolean} result
     */
    each(func: (...params: any[]) => any): boolean;
    /**
     * 文字列化
     * @returns {string}
     */
    toString(): string;
    /**
     * 指定したキーが含まれるか
     * @param {string} key
     * @returns {boolean}
     */
    containsKey(key: string): boolean;
    /**
     * 指定した値が含まれるか
     * @param {any} value
     * @returns {boolean}
     */
    containsValue(value: any): boolean;
    /**
     * 空かどうか
     * @returns {boolean}
     */
    isEmpty(): boolean;
    /**
     * 空にする
     */
    clear(): void;
    /**
     * ディープコピー
     * @returns {HashMap}
     */
    clone(): HashMap;
    /**
     * ハッシュの長さ
     * @returns {number}
     */
    size(): number;
    /**
     * 指定したキーに対して対応する値を取得
     * @param {string} key
     * @returns {any}
     */
    get(key: string): any;
    /**
     * 指定したキー、その値を登録
     * @param {string} key
     * @param {any} value
     * @returns {null|any}
     */
    put(key: string, value: any): null | any;
    /**
     * 指定したキー、その値を全て登録
     * @param {HashMap} hashmap
     */
    putAll(hashmap: HashMap): void;
    /**
     * 指定したキーの値を削除
     * @param {string} key
     * @returns {null|any}
     */
    remove(key: string): null | any;
}

/**
 * 初期化
 * @param {number} [seed] - Seed number for random number generation. If not specified, create from time.
 */
declare class Random {
    constructor(seed?: number);
    /**
     * シード値の初期化
     * @param {number} seed
     */
    setSeed(seed: number): void;
    /**
     * 指定したビット長以下で表せられる乱数生成
     * @param {number} bits - Required number of bits (up to 64 possible).
     * @returns {number}
     */
    next(bits: number): number;
    /**
     * 8ビット長整数の乱数の配列
     * @param {number} size - 必要な長さ
     * @returns {Array<number>}
     */
    nextBytes(size: number): number[];
    /**
     * 16ビット長整数の乱数
     * @returns {number}
     */
    nextShort(): number;
    /**
     * 32ビット長整数の乱数
     * @param {number} [x] - 指定した値未満の数値を作る
     * @returns {number}
     */
    nextInt(x?: number): number;
    /**
     * 64ビット長整数の乱数
     * @returns {number}
     */
    nextLong(): number;
    /**
     * bool値の乱数
     * @returns {boolean}
     */
    nextBoolean(): boolean;
    /**
     * float精度の実数
     * @returns {number}
     */
    nextFloat(): number;
    /**
     * double精度の実数
     * @returns {number}
     */
    nextDouble(): number;
    /**
     * ガウシアン分布に従う乱数
     * @returns {number}
     */
    nextGaussian(): number;
}

/**
 * The script is part of SenkoWSH.
 *
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 *
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */
declare class SFile {
    /**
     * @returns {boolean}
     */
    remove(): boolean;
    /**
     * @returns {boolean}
     */
    exists(): boolean;
    /**
     * @param {string|SFile} file_obj
     * @returns {boolean}
     */
    copy(file_obj: string | SFile): boolean;
    /**
     * @param {string|SFile} file_obj
     * @returns {boolean}
     */
    move(file_obj: string | SFile): boolean;
    /**
     * @param {string|SFile} file_obj
     * @returns {boolean}
     */
    renameTo(file_obj: string | SFile): boolean;
    /**
     * @returns {string}
     */
    toString(): string;
    /**
     * @returns {string}
     */
    getName(): string;
    /**
     * 親フォルダの絶対パス名
     * @returns {string}
     */
    getParent(): string;
    /**
     * @returns {SFile}
     */
    getParentFile(): SFile;
    /**
     * @returns {string}
     */
    getExtensionName(): string;
    /**
     * @returns {boolean}
     */
    isAbsolute(): boolean;
    /**
     * @returns {boolean}
     */
    isDirectory(): boolean;
    /**
     * @returns {boolean}
     */
    isFile(): boolean;
    /**
     * @returns {boolean}
     */
    isHidden(): boolean;
    /**
     * @returns {Date}
     */
    lastModified(): Date;
    /**
     * @param {Date} date
     * @returns {boolean}
     */
    setLastModified(date: Date): boolean;
    /**
     * @returns {number}
     */
    length(): number;
    /**
     * @returns {string[]}
     */
    getFiles(): string[];
    /**
     * @returns {string[]}
     */
    getSubFolders(): string[];
    /**
     * @returns {string}
     */
    getNormalizedPathName(): string;
    /**
     * @returns {string[]}
     */
    getAllFiles(): string[];
    /**
     * @returns {string[]}
     */
    list(): string[];
    /**
     * @returns {string}
     */
    getAbsolutePath(): string;
    /**
     * @returns {boolean}
     */
    mkdir(): boolean;
    /**
     * @returns {boolean}
     */
    mkdirs(): boolean;
    /**
     * @returns {void}
     */
    run(): void;
    /**
     * @param {string} text
     * @returns {boolean}
     */
    writeLine(text: string): boolean;
    /**
     * @param {string} [charset="_autodetect_all"]
     * @param {string} [newline="\n"]
     * @returns {string}
     */
    getText(charset?: string, newline?: string): string;
    /**
     * @param {string} text
     * @param {string} [charset="utf-8"]
     * @param {string} [newline="\r\n"]
     * @param {boolean} [issetBOM=false]
     * @returns {boolean}
     */
    setText(text: string, charset?: string, newline?: string, issetBOM?: boolean): boolean;
    /**
     * @returns {number[]}
     */
    getByte(): number[];
    /**
     * 時間すごいかかります
     * @param {number[]} array_
     */
    setByte(array_: number[]): void;
    /**
     * @returns {XMLHttpRequest}
     */
    static createXMLHttpRequest(): XMLHttpRequest;
    /**
     * @returns {SFile}
     */
    static createTempFile(): SFile;
    /**
     * @returns {SFile}
     */
    static getCurrentDirectory(): SFile;
    /**
     * @param {string|SFile} file_obj
     */
    static setCurrentDirectory(file_obj: string | SFile): void;
    /**
     * @param {string|SFile|function(string, string): boolean} file_obj
     */
    static searchFile(file_obj: string | SFile | ((...params: any[]) => any)): void;
}

declare namespace SFile {
    /**
     * @param {string|SFile} pathname
     */
    class SFile {
        constructor(pathname: string | SFile);
    }
}


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
