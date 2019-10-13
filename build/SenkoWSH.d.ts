/**
 * The script is part of SenkoWSH.
 *
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 *
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */
declare class ArrayList {
    /**
     * @param {function(number, any): boolean} func
     * @returns {boolean} result
     */
    each(func: (...params: any[]) => any): boolean;
    /**
     * @returns {string}
     */
    toString(): string;
    /**
     * @returns {boolean}
     */
    isEmpty(): boolean;
    /**
     * @param {any} object
     * @returns {boolean}
     */
    contains(object: any): boolean;
    /**
     * @returns {number}
     */
    size(): number;
    /**
     * @param {string} [separator = ","]
     * @returns {string}
     */
    join(separator?: string): string;
    /**
     * @returns {ArrayList}
     */
    clone(): ArrayList;
    /**
     * @param {any} object
     * @returns {number}
     */
    indexOf(object: any): number;
    /**
     * @returns {number}
     */
    length(): number;
    /**
     * @param {any} object
     * @returns {number}
     */
    lastIndexOf(object: any): number;
    /**
     * @param {number} index
     */
    get(index: number): void;
    /**
     * @param {any|number} index_or_object
     * @param {any} [object]
     */
    add(index_or_object: any | number, object?: any): void;
    /**
     * @param {ArrayList|number} index_or_arraylist
     * @param {ArrayList} [arraylist]
     */
    addAll(index_or_arraylist: ArrayList | number, arraylist?: ArrayList): void;
    /**
     * @param {number} index
     * @param {any} object
     */
    set(index: number, object: any): void;
    /**
     * @param {number} index
     */
    remove(index: number): void;
    /**
     * @param {number} fromIndex
     * @param {number} toIndex
     */
    removeRange(fromIndex: number, toIndex: number): void;
    /**
     * @param { function(any, any): number } [compareFunction]
     */
    sort(compareFunction?: (...params: any[]) => any): void;
    /**
     * @param {any} a
     * @param {any} b
     * @returns {number}
     */
    static COMPARE_DEFAULT(a: any, b: any): number;
}

declare namespace ArrayList {
    /**
     * @param {{element: any[]}} [array]
     */
    class ArrayList {
        constructor(array?: any);
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
declare class Dialog {
    /**
     * Dialog.popup("test", 0, "test", Dialog.MB_YESNOCANCEL | Dialog.MB_DEFBUTTON3);
     * @param {string} text
     * @param {number} [secondstowait=0]
     * @param {string} [caption=""]
     * @param {number} [type=0]
     * @returns {number}
     */
    static popup(text: string, secondstowait?: number, caption?: string, type?: number): number;
    /**
     * [OK]
     * @type {number}
     */
    static MB_OK: number;
    /**
     * [OK], [キャンセル]
     * @type {number}
     */
    static MB_OKCANCEL: number;
    /**
     * [中止], [再試行], [無視]
     * @type {number}
     */
    static MB_ABORTRETRYIGNORE: number;
    /**
     * [はい], [いいえ], [キャンセル]
     * @type {number}
     */
    static MB_YESNOCANCEL: number;
    /**
     * [はい], [いいえ]
     * @type {number}
     */
    static MB_YESNO: number;
    /**
     * [再試行], [キャンセル]
     * @type {number}
     */
    static MB_RETRYCANCEL: number;
    /**
     * [Stop]
     * @type {number}
     */
    static MB_ICONSTOP: number;
    /**
     * [?]
     * @type {number}
     */
    static MB_ICONQUESTION: number;
    /**
     * [!]
     * @type {number}
     */
    static MB_ICONWARNING: number;
    /**
     * [i]
     * @type {number}
     */
    static MB_ICONINFORMATION: number;
    /**
     * @type {number}
     */
    static MB_DEFBUTTON1: number;
    /**
     * @type {number}
     */
    static MB_DEFBUTTON2: number;
    /**
     * @type {number}
     */
    static MB_DEFBUTTON3: number;
    /**
     * @type {number}
     */
    static MB_DEFBUTTON4: number;
    /**
     * @type {number}
     */
    static IDTIMEOUT: number;
    /**
     * @type {number}
     */
    static IDOK: number;
    /**
     * @type {number}
     */
    static IDCANCEL: number;
    /**
     * @type {number}
     */
    static IDABORT: number;
    /**
     * @type {number}
     */
    static IDRETRY: number;
    /**
     * @type {number}
     */
    static IDIGNORE: number;
    /**
     * @type {number}
     */
    static IDYES: number;
    /**
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
declare class File {
    /**
     * @returns {boolean}
     */
    remove(): boolean;
    /**
     * @returns {boolean}
     */
    exists(): boolean;
    /**
     * @param {string|File} file_obj
     * @returns {boolean}
     */
    copy(file_obj: string | File): boolean;
    /**
     * @param {string|File} file_obj
     * @returns {boolean}
     */
    move(file_obj: string | File): boolean;
    /**
     * @param {string|File} file_obj
     * @returns {boolean}
     */
    renameTo(file_obj: string | File): boolean;
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
     * @returns {File}
     */
    getParentFile(): File;
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
     * @returns {File}
     */
    static createTempFile(): File;
    /**
     * @returns {File}
     */
    static getCurrentDirectory(): File;
    /**
     * @param {string|File} file_obj
     */
    static setCurrentDirectory(file_obj: string | File): void;
    /**
     * @param {string|File|function(string, string): boolean} file_obj
     */
    static searchFile(file_obj: string | File | ((...params: any[]) => any)): void;
}

declare namespace File {
    /**
     * @param {string|File} pathname
     */
    class File {
        constructor(pathname: string | File);
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
declare class Format {
    /**
     * C言語のprintfを再現
     * ロケール、日付時刻等はサポートしていません。
     * sprintfの変換指定子のpとnはサポートしていません。
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
declare class HashMap {
    /**
     * @param {function(number, any): boolean} func
     * @returns {boolean} result
     */
    each(func: (...params: any[]) => any): boolean;
    /**
     * @returns {string}
     */
    toString(): string;
    /**
     * @param {string} key
     * @returns {boolean}
     */
    containsKey(key: string): boolean;
    /**
     * @param {any} value
     * @returns {boolean}
     */
    containsValue(value: any): boolean;
    /**
     * @returns {boolean}
     */
    isEmpty(): boolean;
    /**
     * @returns {HashMap}
     */
    clone(): HashMap;
    /**
     * @returns {number}
     */
    size(): number;
    /**
     * @param {string} key
     * @returns {any}
     */
    get(key: string): any;
    /**
     * @param {string} key
     * @param {any} value
     * @returns {null|any}
     */
    put(key: string, value: any): null | any;
    /**
     * @param {HashMap} hashmap
     */
    putAll(hashmap: HashMap): void;
    /**
     * @param {string} key
     * @returns {null|any}
     */
    remove(key: string): null | any;
}

declare namespace HashMap {
    /**
     * @param {HashMap} [hash_map]
     */
    class HashMap {
        constructor(hash_map?: HashMap);
    }
}

/**
 * Collection of tools used in the Random.
 */
declare class RandomTool {
    /**
     * Create a 32-bit nonnegative integer.
     * @param {number} x
     * @returns {number}
     */
    static unsigned32(x: number): number;
    /**
     * Multiply two 32-bit integers and output a 32-bit integer.
     * @param {number} x1
     * @param {number} x2
     * @returns {number}
     */
    static multiplication32(x1: number, x2: number): number;
}

/**
 * Create Random.
 * @param {number} [seed] - Seed number for random number generation. If not specified, create from time.
 */
declare class Random {
    constructor(seed?: number);
    /**
     * 内部データをシャッフル
     */
    _rnd521(): void;
    /**
     * Initialize random seed.
     * @param {number} seed
     */
    setSeed(seed: number): void;
    /**
     * 32-bit random number.
     * @returns {number} - 32ビットの乱数
     */
    genrand_int32(): number;
    /**
     * Random number of specified bit length.
     * @param {number} bits - Required number of bits (up to 64 possible).
     * @returns {number}
     */
    next(bits: number): number;
    /**
     * 8-bit random number array of specified length.
     * @param {number} size - 必要な長さ
     * @returns {Array<number>}
     */
    nextBytes(size: number): number[];
    /**
     * 16-bit random number.
     * @returns {number}
     */
    nextShort(): number;
    /**
     * 32-bit random number.
     * @param {number} [x] - 指定した値未満の数値を作る
     * @returns {number}
     */
    nextInt(x?: number): number;
    /**
     * 64-bit random number.
     * @returns {number}
     */
    nextLong(): number;
    /**
     * Random boolean.
     * @returns {boolean}
     */
    nextBoolean(): boolean;
    /**
     * Float type random number in the range of [0, 1).
     * @returns {number}
     */
    nextFloat(): number;
    /**
     * Double type random number in the range of [0, 1).
     * @returns {number}
     */
    nextDouble(): number;
    /**
     * Random numbers from a Gaussian distribution.
     * This random number is a distribution with an average value of 0 and a standard deviation of 1.
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
declare class StringWSH {
    /**
     * @param {string} text
     * @param {string} target
     * @param {string} replacement
     * @returns {string}
     */
    static replaceAll(text: string, target: string, replacement: string): string;
    /**
     * @param {string} text
     * @returns {string}
     */
    static trim(text: string): string;
    /**
     * @param {string} text
     * @param {function(number, string, number): boolean} func
     * @returns {boolean} result
     */
    static each(text: string, func: (...params: any[]) => any): boolean;
    /**
     * 上位のサロゲートペアの判定
     * @param {String} text - 対象テキスト
     * @param {number} index - インデックス
     * @returns {Boolean} 確認結果
     */
    static isHighSurrogateAt(text: string, index: number): boolean;
    /**
     * 下位のサロゲートペアの判定
     * @param {String} text - 対象テキスト
     * @param {number} index - インデックス
     * @returns {Boolean} 確認結果
     */
    static isLowSurrogateAt(text: string, index: number): boolean;
    /**
     * サロゲートペアの判定
     * @param {String} text - 対象テキスト
     * @param {number} index - インデックス
     * @returns {Boolean} 確認結果
     */
    static isSurrogatePairAt(text: string, index: number): boolean;
    /**
     * サロゲートペア対応のコードポイント取得
     * @param {String} text - 対象テキスト
     * @param {number} [index = 0] - インデックス
     * @returns {number} コードポイント
     */
    static codePointAt(text: string, index?: number): number;
    /**
     * インデックスの前にあるコードポイント
     * @param {String} text - 対象テキスト
     * @param {number} index - インデックス
     * @returns {number} コードポイント
     */
    static codePointBefore(text: string, index: number): number;
    /**
     * コードポイント換算で文字列数をカウント
     * @param {string} text - 対象テキスト
     * @param {number} [beginIndex=0] - 最初のインデックス（省略可）
     * @param {number} [endIndex] - 最後のインデックス（ここは含めない）（省略可）
     * @returns {number} 文字数
     */
    static codePointCount(text: string, beginIndex?: number, endIndex?: number): number;
    /**
     * コードポイント換算で文字列配列の位置を計算
     * @param {string} text - 対象テキスト
     * @param {number} index - オフセット
     * @param {number} codePointOffset - ずらすコードポイント数
     * @returns {number} ずらしたインデックス
     */
    static offsetByCodePoints(text: string, index: number, codePointOffset: number): number;
    /**
     * コードポイントの数値データを文字列に変換
     * @param {...(number|Array<number>)} codepoint - 変換したいコードポイントの数値配列、又は数値を並べた可変引数
     * @returns {string} 変換後のテキスト
     */
    static fromCodePoint(...codepoint: (number | number[])[]): string;
    /**
     * @param {string} text
     * @param {string} prefix
     * @returns {boolean}
     */
    static startsWith(text: string, prefix: string): boolean;
    /**
     * @param {string} text
     * @param {string} suffix
     * @returns {boolean}
     */
    static endsWith(text: string, suffix: string): boolean;
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
