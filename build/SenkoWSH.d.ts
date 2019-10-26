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
 * 日本語の変換を扱うクラス
 */
declare class Japanese {
    /**
     * カタカナをひらがなに変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toHiragana(text: string): string;
    /**
     * ひらがなをカタカナに変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toKatakana(text: string): string;
    /**
     * スペースを半角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toHalfWidthSpace(text: string): string;
    /**
     * スペースを全角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toFullWidthSpace(text: string): string;
    /**
     * 英数記号を半角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toHalfWidthAsciiCode(text: string): string;
    /**
     * 英数記号を全角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toFullWidthAsciiCode(text: string): string;
    /**
     * アルファベットを半角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toHalfWidthAlphabet(text: string): string;
    /**
     * アルファベットを全角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toFullWidthAlphabet(text: string): string;
    /**
     * 数値を半角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toHalfWidthNumber(text: string): string;
    /**
     * 数値を全角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toFullWidthNumber(text: string): string;
    /**
     * カタカナを半角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toHalfWidthKana(text: string): string;
    /**
     * カタカナを全角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toFullWidthKana(text: string): string;
    /**
     * 半角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toHalfWidth(text: string): string;
    /**
     * 全角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toFullWidth(text: string): string;
    /**
     * 指定したテキストの横幅を半角／全角でカウント
     * - 半角を1、全角を2としてカウント
     * - 半角は、ASCII文字、半角カタカナ。全角はそれ以外とします。
     * @param {String} text - カウントしたいテキスト
     * @returns {Number} 文字の横幅
     */
    static getWidth(text: string): number;
    /**
     * 指定したテキストの横幅を半角／全角で換算した場合の切り出し
     * - 半角を1、全角を2としてカウント
     * - 半角は、ASCII文字、半角カタカナ。全角はそれ以外とします。
     * @param {String} text - 切り出したいテキスト
     * @param {Number} offset - 切り出し位置
     * @param {Number} size - 切り出す長さ
     * @returns {String} 切り出したテキスト
     */
    static cutTextForWidth(text: string, offset: number, size: number): string;
}

/**
 * 日本語の文字列比較用関数を提供するクラス
 * - sortの引数で利用できます
 */
declare class StringComparator {
    /**
     * 2つの文字列を比較する
     * @param {String} a - 比較元
     * @param {String} b - 比較先
     * @returns {number} Compare結果
     */
    static DEFAULT(a: string, b: string): number;
    /**
     * 2つの文字列を自然順に比較を行う（自然順ソート（Natural Sort）用）
     * @param {String} a - 比較元
     * @param {String} b - 比較先
     * @returns {number} Compare結果
     */
    static NATURAL(a: string, b: string): number;
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
 * CSV形式のテキストなどを扱うクラス
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
 * ダイアログを扱うクラス
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
 * ES3相当のJScirptのArray拡張用クラス
 * - Array.prototypeに拡張します
 */
declare class ExtendsArray {
    /**
     * @param {any[]} array
     * @param {any} object
     * @returns {boolean}
     */
    static includes(array: any[], object: any): boolean;
    /**
     * @param {any[]} array
     * @param {any} object
     * @param {number} [fromIndex=0]
     * @returns {number}
     */
    static indexOf(array: any[], object: any, fromIndex?: number): number;
    /**
     * @param {any[]} array
     * @param {any} object
     * @param {number} [fromIndex]
     * @returns {number}
     */
    static lastIndexOf(array: any[], object: any, fromIndex?: number): number;
    /**
     * 安定ソート
     * @param {any[]} array
     * @param {function(any, any): number} [compareFunction]
     * @returns {any[]}
     */
    static sort(array: any[], compareFunction?: (...params: any[]) => any): any[];
    /**
     * @param {any[]} array
     * @returns {string}
     */
    static toString(array: any[]): string;
    /**
     * ディープコピー
     * @param {any[]} array
     * @returns {any[]}
     */
    static clone(array: any[]): any[];
    /**
     * 指定したデータを挿入
     * @param {any[]} array
     * @param {any|number} index_or_object
     * @param {any} [object]
     */
    static add(array: any[], index_or_object: any | number, object?: any): void;
    /**
     * 指定した配列を挿入
     * @param {any[]} array
     * @param {any[]|number} index_or_arraylist
     * @param {any[]} [arraylist]
     */
    static addAll(array: any[], index_or_arraylist: any[] | number, arraylist?: any[]): void;
    /**
     * 指定した位置のデータを削除
     * @param {any[]} array
     * @param {number} index
     */
    static remove(array: any[], index: number): void;
    /**
     * 指定した範囲を削除
     * @param {any[]} array
     * @param {number} fromIndex
     * @param {number} toIndex
     */
    static removeRange(array: any[], fromIndex: number, toIndex: number): void;
    /**
     * 空かどうか
     * @param {any[]} array
     * @returns {boolean}
     */
    static isEmpty(array: any[]): boolean;
}

/**
 * ES3相当のJScirptのObject拡張用クラス
 * - Object.prototypeに拡張します
 */
declare class ExtendsObject {
    /**
     * 指定したキーが含まれるか
     * @param {Object} obj
     * @param {any} key
     * @returns {boolean}
     */
    static containsKey(obj: any, key: any): boolean;
    /**
     * 指定した値が含まれるか
     * @param {Object} obj
     * @param {any} value
     * @returns {boolean}
     */
    static containsValue(obj: any, value: any): boolean;
    /**
     * 名前の配列
     * @param {Object} obj
     * @returns {string[]}
     */
    static keys(obj: any): string[];
    /**
     * 空かどうか
     * @param {Object} obj
     * @returns {boolean}
     */
    static isEmpty(obj: any): boolean;
    /**
     * 文字列化
     * @param {Object} obj
     * @returns {string}
     */
    static toString(obj: any): string;
    /**
     * 指定したキー、その値を登録
     * @param {Object} obj
     * @param {string} key
     * @param {any} value
     * @returns {null|any}
     */
    static put(obj: any, key: string, value: any): null | any;
    /**
     * 指定したキー、その値を全て登録
     * @param {Object} obj
     * @param {Object<string, any>} hashmap
     */
    static putAll(obj: any, hashmap: {
        [key: string]: any;
    }): void;
    /**
     * 指定したキーの値を削除
     * @param {Object} obj
     * @param {string} key
     * @returns {null|any}
     */
    static remove(obj: any, key: string): null | any;
}

/**
 * ES3相当のJScirptのString拡張用クラス
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
 * 書式に合わせて文字列を組み立てる関数を提供するクラス
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
 * システム用のクラス
 * - 文字列の入出力
 * - スリープ、停止
 * - GUIモード、CUIモードの切り替え
 * - バッチファイルへの引数の情報
 * - カレントディレクトリ情報
 */
declare class System {
    /**
     * 文字列を表示（最終行で自動で改行されない）
     * @param {any} text
     */
    static print(text: any): void;
    /**
     * 文字列を表示（最終行で自動で改行される）
     * @param {any} text
     */
    static println(text: any): void;
    /**
     * 指定したフォーマットで整形した文字列を表示
     * @param {any} text
     * @param {...any} parm パラメータは可変引数
     */
    static printf(text: any, ...parm: any[]): void;
    /**
     * キーボードのテキスト入力を取得
     * @returns {string}
     */
    static readLine(): string;
    /**
     * UNIX時間をミリ秒で取得
     * @returns {number}
     */
    static currentTimeMillis(): number;
    /**
     * 処理を一時停止
     * @param {number} time_sec
     */
    static sleep(time_sec: number): void;
    /**
     * 処理を停止
     */
    static stop(): void;
    /**
     * CUIで起動しなおす
     * @param {boolean} is_use_chakra - 高速なChakraエンジンを利用する（wsfが開けなくなる）
     */
    static executeOnCScript(is_use_chakra: boolean): void;
    /**
     * GUIで起動しなおす
     */
    static executeOnWScript(): void;
    /**
     * スクリプトファイルへの引数を取得
     * @returns {string[]}
     */
    static getArguments(): string[];
    /**
     * カレントディレクトリを設定
     * @param {string} filename
     */
    static setCurrentDirectory(filename: string): void;
    /**
     * カレントディレクトリを取得
     * @returns {string}
     */
    static getCurrentDirectory(): string;
    /**
     * 実行中のスクリプトがあるカレントディレクトリを取得
     * @returns {string}
     */
    static getScriptDirectory(): string;
    /**
     * 実行中のスクリプトがあるディレクトリをカレントディレクトリに設定
     */
    static initializeCurrentDirectory(): void;
}


