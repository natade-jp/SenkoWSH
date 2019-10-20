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
 * ES3相当のJScirptのString拡張用
 * - String.prototypeに拡張します
 */
declare class ExtendsString {
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

/**
 * 初期化
 * @param {string|SFile} pathname ファイル名／フォルダ名／URLアドレス
 */
declare class SFile {
    constructor(pathname: string | SFile);
    /**
     * ファイルの削除
     * @returns {boolean}
     */
    remove(): boolean;
    /**
     * ファイルが存在するか
     * @returns {boolean}
     */
    exists(): boolean;
    /**
     * ファイルのコピー
     * @param {string|SFile} file_obj
     * @returns {boolean}
     */
    copy(file_obj: string | SFile): boolean;
    /**
     * ファイルの移動
     * @param {string|SFile} file_obj
     * @returns {boolean}
     */
    move(file_obj: string | SFile): boolean;
    /**
     * ファイル名を変更
     * @param {string|SFile} file_obj
     * @returns {boolean}
     */
    renameTo(file_obj: string | SFile): boolean;
    /**
     * 文字列化
     * @returns {string}
     */
    toString(): string;
    /**
     * 名前を取得
     * @returns {string}
     */
    getName(): string;
    /**
     * 親フォルダの絶対パス
     * @returns {string}
     */
    getParent(): string;
    /**
     * 親フォルダ
     * @returns {SFile}
     */
    getParentFile(): SFile;
    /**
     * 拡張子（ドットを含まない）
     * @returns {string}
     */
    getExtensionName(): string;
    /**
     * 絶対パスかどうか
     * @returns {boolean}
     */
    isAbsolute(): boolean;
    /**
     * フォルダかどうか
     * @returns {boolean}
     */
    isDirectory(): boolean;
    /**
     * ファイルかどうか
     * @returns {boolean}
     */
    isFile(): boolean;
    /**
     * 隠しファイルかどうか
     * @returns {boolean}
     */
    isHidden(): boolean;
    /**
     * 更新日を取得
     * @returns {Date}
     */
    lastModified(): Date;
    /**
     * 更新日を設定（ファイルのみ対応）
     * @param {Date} date
     * @returns {boolean}
     */
    setLastModified(date: Date): boolean;
    /**
     * ファイルサイズ
     * @returns {number}
     */
    length(): number;
    /**
     * 配下のファイル名の一覧を取得
     * @returns {string[]}
     */
    getFiles(): string[];
    /**
     * 配下のサブフォルダ名の一覧を取得
     * @returns {string[]}
     */
    getSubFolders(): string[];
    /**
     * 区切り文字と終端を正規化した文字列を取得
     * @returns {string}
     */
    getNormalizedPathName(): string;
    /**
     * サブフォルダの中まで探索して全てのファイルとフォルダを取得
     * @returns {string[]}
     */
    getAllFiles(): string[];
    /**
     * 配下のファイル名とフォルダ名を取得
     * @returns {string[]}
     */
    list(): string[];
    /**
     * 絶対パスを取得
     * @returns {string}
     */
    getAbsolutePath(): string;
    /**
     * フォルダを作成
     * - フォルダは1つのみ指定可能
     * - すでにフォルダがある場合はエラーを返す。
     * @returns {boolean}
     */
    mkdir(): boolean;
    /**
     * フォルダを作成
     * - 作成したいフォルダを続けて記載が可能
     * - フォルダがない場合はフォルダを作成していく
     * @returns {boolean}
     */
    mkdirs(): boolean;
    /**
     * ファイルを開く
     * @param {number} [style=1] - 起動オプション
     * @param {boolean} [is_wait=false] - プロセスが終了するまで待つ
     * @returns {void}
     */
    run(style?: number, is_wait?: boolean): void;
    /**
     * 1行書き加える
     * @param {string} text
     * @returns {boolean}
     */
    writeLine(text: string): boolean;
    /**
     * テキストファイルを開く
     * @param {string} [charset="_autodetect_all"] - 文字コード
     * @returns {string}
     */
    getTextFile(charset?: string): string;
    /**
     * テキストファイルを保存
     * @param {string} text
     * @param {string} [charset="utf-8"] - 文字コード
     * @param {string} [newline="\n"] - 改行コード
     * @param {boolean} [issetBOM=true] - BOMの有無(utf-8のみ有効 )
     * @returns {boolean}
     */
    setTextFile(text: string, charset?: string, newline?: string, issetBOM?: boolean): boolean;
    /**
     * バイナリファイルを開く（激重）
     * @returns {number[]}
     */
    getBinaryFile(): number[];
    /**
     * バイナリファイルを保存（激重）
     * @param {number[]} array_
     */
    setBinaryFile(array_: number[]): void;
    /**
     * XMLHttpRequestを作成
     * @returns {XMLHttpRequest}
     */
    static createXMLHttpRequest(): XMLHttpRequest;
    /**
     * テンポラリフォルダ内の適当なファイル名を取得
     * @returns {SFile}
     */
    static createTempFile(): SFile;
    /**
     * カレントディレクトリを取得
     * @returns {SFile}
     */
    static getCurrentDirectory(): SFile;
    /**
     * カレントディレクトリを設定
     * @param {string|SFile} file_obj
     */
    static setCurrentDirectory(file_obj: string | SFile): void;
    /**
     * 指定した条件にあうファイルを探す
     * @param {string|SFile|function(string, string): boolean} file_obj
     * @returns {SFile|null}
     */
    static searchFile(file_obj: string | SFile | ((...params: any[]) => any)): SFile | null;
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
	 * @param {boolean} is_use_chakra - 高速なChakraエンジンを利用する（wsfが開けなくなる）
	 */
    static executeOnCScript(is_use_chakra);
    
	/**
	 * GUIで起動しなおす
	 */
    static executeOnWScript();
    
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
