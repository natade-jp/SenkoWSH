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
 * ポップアップ用のオプション
 * @typedef {Object} PopupOption
 * @property {number} [secondstowait=0] タイムアウト時間(`0`で無効)
 * @property {string} [caption=""] タイトルバー
 * @property {number} [type=0] `Dialog.MB_YESNOCANCEL | Dialog.MB_DEFBUTTON3` など
 */
declare type PopupOption = {
    secondstowait?: number;
    caption?: string;
    type?: number;
};

/**
 * 「ファイルを開く」ダイアログ用のオプション
 * @typedef {Object} OpenFileOption
 * @property {string} [initial_directory] 初期ディレクトリ(`"C:\"`など)
 * @property {string} [filter="All files(*.*)|*.*"] ファイル形式（`"画像ファイル(*.png;*.bmp)|*.png;*.bmp"`など）
 * @property {string} [title] タイトル(「`ファイルを選択してください`」など)
 */
declare type OpenFileOption = {
    initial_directory?: string;
    filter?: string;
    title?: string;
};

/**
 * 「フォルダを開く」ダイアログ用のオプション
 * @typedef {Object} OpenDirectoryOption
 * @property {string} [initial_directory] 初期ディレクトリ(`"C:\"`など)
 * @property {string} [title] タイトル(「`フォルダを選択してください`」など)
 */
declare type OpenDirectoryOption = {
    initial_directory?: string;
    title?: string;
};

/**
 * 「名前を付けて保存する」ダイアログ用のオプション
 * @typedef {Object} SaveAsOption
 * @property {string} [initial_directory] 初期ディレクトリ(`"C:\"`など)
 * @property {string} [default_ext] 拡張子を省略した場合の値(`".txt"`など)
 * @property {string} [file_name] ファイル名の初期値(`"新しいファイル.txt"`など)
 * @property {string} [filter="All files(*.*)|*.*"] ファイル形式（`"画像ファイル(*.png;*.bmp)|*.png;*.bmp"`など）
 * @property {string} [title] タイトル(「`保存するファイル名を設定してください`」など)
 */
declare type SaveAsOption = {
    initial_directory?: string;
    default_ext?: string;
    file_name?: string;
    filter?: string;
    title?: string;
};

/**
 * ダイアログを扱うクラス
 */
declare class Dialog {
    /**
     * ダイアログを表示する
     * @param {string} text
     * @param {PopupOption} [option]
     * @returns {number}
     */
    static popupMessage(text: string, option?: PopupOption): number;
    /**
     * ファイルを開くダイアログを表示する
     * @param {OpenFileOption} [option]
     * @returns {SFile|null}
     */
    static popupOpenFile(option?: OpenFileOption): SFile | null;
    /**
     * フォルダを開くダイアログを表示する
     * @param {OpenDirectoryOption} [option]
     * @returns {SFile|null}
     */
    static popupOpenDirectory(option?: OpenDirectoryOption): SFile | null;
    /**
     * 名前を付けて保存ダイアログを表示する
     * @param {SaveAsOption} [option]
     * @returns {SFile|null}
     */
    static popupSaveAs(option?: SaveAsOption): SFile | null;
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
 * 書式に合わせて文字列を組み立てる関数を提供するクラス
 */
declare class Format {
    /**
     * `printf` に似た書式に合わせて文字列を組み立てる
     * - ロケール、日付時刻等はサポートしていません。
     * - 変換指定子の`p`と`n`はサポートしていません。
     * @param {String} text
     * @param {...any} parm パラメータは可変引数
     * @returns {String}
     */
    static textf(text: string, ...parm: any[]): string;
    /**
     * 時刻用の書式に合わせて文字列を組み立てる
     * - `YYYY-MM-DD hh:mm:ss` のように指定できる。
     * @param {String} text
     * @param {Date} date 時刻情報
     * @returns {String}
     */
    static datef(text: string, date: Date): string;
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
     * @param {any} obj
     * @param {any} key
     * @returns {boolean}
     */
    static containsKey(obj: any, key: any): boolean;
    /**
     * 指定した値が含まれるか
     * @param {any} obj
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
     * @param {any} obj
     * @returns {string}
     */
    static toString(obj: any): string;
    /**
     * 指定したキー、その値を登録
     * @param {any} obj
     * @param {string} key
     * @param {any} value
     * @returns {null|any}
     */
    static put(obj: any, key: string, value: any): null | any;
    /**
     * 指定したキー、その値を全て登録
     * @param {any} obj
     * @param {Object<string, any>} hashmap
     */
    static putAll(obj: any, hashmap: {
        [key: string]: any;
    }): void;
    /**
     * 指定したキーの値を削除
     * @param {any} obj
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
     * 指定した関数を全ての文字に一律に処理を行う
     * @param {string} text
     * @param {function(number, string, number): boolean} func - 文字番号, 文字列, 文字コード。戻り値がfalseで処理を終了。
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
 * 大きさ情報
 * @typedef {Object} WSHRobotRect
 * @property {number} x 座標x
 * @property {number} y 座標y
 * @property {number} width 横幅
 * @property {number} height 縦幅
 */
declare type WSHRobotRect = {
    x: number;
    y: number;
    width: number;
    height: number;
};

/**
 * 位置情報
 * @typedef {Object} WSHRobotPosition
 * @property {number} x 座標x
 * @property {number} y 座標y
 */
declare type WSHRobotPosition = {
    x: number;
    y: number;
};

/**
 * 仮想キーコード
 * @typedef {Object} VirtualKeyCode
 * @property {number} code
 */
declare type VirtualKeyCode = {
    code: number;
};

/**
 * 仮想キーコード一覧
 * @typedef {Object} VirtualKeyCodes
 * @property {VirtualKeyCode} VK_LBUTTON
 * @property {VirtualKeyCode} VK_RBUTTON
 * @property {VirtualKeyCode} VK_CANCEL
 * @property {VirtualKeyCode} VK_MBUTTON
 * @property {VirtualKeyCode} VK_XBUTTON1
 * @property {VirtualKeyCode} VK_XBUTTON2
 * @property {VirtualKeyCode} VK_BACK
 * @property {VirtualKeyCode} VK_TAB
 * @property {VirtualKeyCode} VK_CLEAR
 * @property {VirtualKeyCode} VK_RETURN
 * @property {VirtualKeyCode} VK_SHIFT
 * @property {VirtualKeyCode} VK_CONTROL
 * @property {VirtualKeyCode} VK_MENU
 * @property {VirtualKeyCode} VK_PAUSE
 * @property {VirtualKeyCode} VK_CAPITAL
 * @property {VirtualKeyCode} VK_KANA
 * @property {VirtualKeyCode} VK_HANGEUL
 * @property {VirtualKeyCode} VK_HANGUL
 * @property {VirtualKeyCode} VK_JUNJA
 * @property {VirtualKeyCode} VK_FINAL
 * @property {VirtualKeyCode} VK_HANJA
 * @property {VirtualKeyCode} VK_KANJI
 * @property {VirtualKeyCode} VK_ESCAPE
 * @property {VirtualKeyCode} VK_CONVERT
 * @property {VirtualKeyCode} VK_NONCONVERT
 * @property {VirtualKeyCode} VK_ACCEPT
 * @property {VirtualKeyCode} VK_MODECHANGE
 * @property {VirtualKeyCode} VK_SPACE
 * @property {VirtualKeyCode} VK_PRIOR
 * @property {VirtualKeyCode} VK_NEXT
 * @property {VirtualKeyCode} VK_END
 * @property {VirtualKeyCode} VK_HOME
 * @property {VirtualKeyCode} VK_LEFT
 * @property {VirtualKeyCode} VK_UP
 * @property {VirtualKeyCode} VK_RIGHT
 * @property {VirtualKeyCode} VK_DOWN
 * @property {VirtualKeyCode} VK_SELECT
 * @property {VirtualKeyCode} VK_PRINT
 * @property {VirtualKeyCode} VK_EXECUTE
 * @property {VirtualKeyCode} VK_SNAPSHOT
 * @property {VirtualKeyCode} VK_INSERT
 * @property {VirtualKeyCode} VK_DELETE
 * @property {VirtualKeyCode} VK_HELP
 * @property {VirtualKeyCode} VK_0
 * @property {VirtualKeyCode} VK_1
 * @property {VirtualKeyCode} VK_2
 * @property {VirtualKeyCode} VK_3
 * @property {VirtualKeyCode} VK_4
 * @property {VirtualKeyCode} VK_5
 * @property {VirtualKeyCode} VK_6
 * @property {VirtualKeyCode} VK_7
 * @property {VirtualKeyCode} VK_8
 * @property {VirtualKeyCode} VK_9
 * @property {VirtualKeyCode} VK_A
 * @property {VirtualKeyCode} VK_B
 * @property {VirtualKeyCode} VK_C
 * @property {VirtualKeyCode} VK_D
 * @property {VirtualKeyCode} VK_E
 * @property {VirtualKeyCode} VK_F
 * @property {VirtualKeyCode} VK_G
 * @property {VirtualKeyCode} VK_H
 * @property {VirtualKeyCode} VK_I
 * @property {VirtualKeyCode} VK_J
 * @property {VirtualKeyCode} VK_K
 * @property {VirtualKeyCode} VK_L
 * @property {VirtualKeyCode} VK_M
 * @property {VirtualKeyCode} VK_N
 * @property {VirtualKeyCode} VK_O
 * @property {VirtualKeyCode} VK_P
 * @property {VirtualKeyCode} VK_Q
 * @property {VirtualKeyCode} VK_R
 * @property {VirtualKeyCode} VK_S
 * @property {VirtualKeyCode} VK_T
 * @property {VirtualKeyCode} VK_U
 * @property {VirtualKeyCode} VK_V
 * @property {VirtualKeyCode} VK_W
 * @property {VirtualKeyCode} VK_X
 * @property {VirtualKeyCode} VK_Y
 * @property {VirtualKeyCode} VK_Z
 * @property {VirtualKeyCode} VK_LWIN
 * @property {VirtualKeyCode} VK_RWIN
 * @property {VirtualKeyCode} VK_APPS
 * @property {VirtualKeyCode} VK_SLEEP
 * @property {VirtualKeyCode} VK_NUMPAD0
 * @property {VirtualKeyCode} VK_NUMPAD1
 * @property {VirtualKeyCode} VK_NUMPAD2
 * @property {VirtualKeyCode} VK_NUMPAD3
 * @property {VirtualKeyCode} VK_NUMPAD4
 * @property {VirtualKeyCode} VK_NUMPAD5
 * @property {VirtualKeyCode} VK_NUMPAD6
 * @property {VirtualKeyCode} VK_NUMPAD7
 * @property {VirtualKeyCode} VK_NUMPAD8
 * @property {VirtualKeyCode} VK_NUMPAD9
 * @property {VirtualKeyCode} VK_MULTIPLY
 * @property {VirtualKeyCode} VK_ADD
 * @property {VirtualKeyCode} VK_SEPARATOR
 * @property {VirtualKeyCode} VK_SUBTRACT
 * @property {VirtualKeyCode} VK_DECIMAL
 * @property {VirtualKeyCode} VK_DIVIDE
 * @property {VirtualKeyCode} VK_F1
 * @property {VirtualKeyCode} VK_F2
 * @property {VirtualKeyCode} VK_F3
 * @property {VirtualKeyCode} VK_F4
 * @property {VirtualKeyCode} VK_F5
 * @property {VirtualKeyCode} VK_F6
 * @property {VirtualKeyCode} VK_F7
 * @property {VirtualKeyCode} VK_F8
 * @property {VirtualKeyCode} VK_F9
 * @property {VirtualKeyCode} VK_F10
 * @property {VirtualKeyCode} VK_F11
 * @property {VirtualKeyCode} VK_F12
 * @property {VirtualKeyCode} VK_F13
 * @property {VirtualKeyCode} VK_F14
 * @property {VirtualKeyCode} VK_F15
 * @property {VirtualKeyCode} VK_F16
 * @property {VirtualKeyCode} VK_F17
 * @property {VirtualKeyCode} VK_F18
 * @property {VirtualKeyCode} VK_F19
 * @property {VirtualKeyCode} VK_F20
 * @property {VirtualKeyCode} VK_F21
 * @property {VirtualKeyCode} VK_F22
 * @property {VirtualKeyCode} VK_F23
 * @property {VirtualKeyCode} VK_F24
 * @property {VirtualKeyCode} VK_NUMLOCK
 * @property {VirtualKeyCode} VK_SCROLL
 * @property {VirtualKeyCode} VK_LSHIFT
 * @property {VirtualKeyCode} VK_RSHIFT
 * @property {VirtualKeyCode} VK_LCONTROL
 * @property {VirtualKeyCode} VK_RCONTROL
 * @property {VirtualKeyCode} VK_LMENU
 * @property {VirtualKeyCode} VK_RMENU
 * @property {VirtualKeyCode} VK_BROWSER_BACK
 * @property {VirtualKeyCode} VK_BROWSER_FORWARD
 * @property {VirtualKeyCode} VK_BROWSER_REFRESH
 * @property {VirtualKeyCode} VK_BROWSER_STOP
 * @property {VirtualKeyCode} VK_BROWSER_SEARCH
 * @property {VirtualKeyCode} VK_BROWSER_FAVORITES
 * @property {VirtualKeyCode} VK_BROWSER_HOME
 * @property {VirtualKeyCode} VK_VOLUME_MUTE
 * @property {VirtualKeyCode} VK_VOLUME_DOWN
 * @property {VirtualKeyCode} VK_VOLUME_UP
 * @property {VirtualKeyCode} VK_MEDIA_NEXT_TRACK
 * @property {VirtualKeyCode} VK_MEDIA_PREV_TRACK
 * @property {VirtualKeyCode} VK_MEDIA_STOP
 * @property {VirtualKeyCode} VK_MEDIA_PLAY_PAUSE
 * @property {VirtualKeyCode} VK_LAUNCH_MAIL
 * @property {VirtualKeyCode} VK_LAUNCH_MEDIA_SELECT
 * @property {VirtualKeyCode} VK_LAUNCH_APP1
 * @property {VirtualKeyCode} VK_LAUNCH_APP2
 * @property {VirtualKeyCode} VK_OEM_1
 * @property {VirtualKeyCode} VK_OEM_PLUS
 * @property {VirtualKeyCode} VK_OEM_COMMA
 * @property {VirtualKeyCode} VK_OEM_MINUS
 * @property {VirtualKeyCode} VK_OEM_PERIOD
 * @property {VirtualKeyCode} VK_OEM_2
 * @property {VirtualKeyCode} VK_OEM_3
 * @property {VirtualKeyCode} VK_OEM_4
 * @property {VirtualKeyCode} VK_OEM_5
 * @property {VirtualKeyCode} VK_OEM_6
 * @property {VirtualKeyCode} VK_OEM_7
 * @property {VirtualKeyCode} VK_OEM_8
 * @property {VirtualKeyCode} VK_PROCESSKEY
 * @property {VirtualKeyCode} VK_ATTN
 * @property {VirtualKeyCode} VK_CRSEL
 * @property {VirtualKeyCode} VK_EXSEL
 * @property {VirtualKeyCode} VK_EREOF
 * @property {VirtualKeyCode} VK_PLAY
 * @property {VirtualKeyCode} VK_ZOOM
 * @property {VirtualKeyCode} VK_NONAME
 * @property {VirtualKeyCode} VK_PA1
 * @property {VirtualKeyCode} VK_OEM_CLEAR
 */
declare type VirtualKeyCodes = {
    VK_LBUTTON: VirtualKeyCode;
    VK_RBUTTON: VirtualKeyCode;
    VK_CANCEL: VirtualKeyCode;
    VK_MBUTTON: VirtualKeyCode;
    VK_XBUTTON1: VirtualKeyCode;
    VK_XBUTTON2: VirtualKeyCode;
    VK_BACK: VirtualKeyCode;
    VK_TAB: VirtualKeyCode;
    VK_CLEAR: VirtualKeyCode;
    VK_RETURN: VirtualKeyCode;
    VK_SHIFT: VirtualKeyCode;
    VK_CONTROL: VirtualKeyCode;
    VK_MENU: VirtualKeyCode;
    VK_PAUSE: VirtualKeyCode;
    VK_CAPITAL: VirtualKeyCode;
    VK_KANA: VirtualKeyCode;
    VK_HANGEUL: VirtualKeyCode;
    VK_HANGUL: VirtualKeyCode;
    VK_JUNJA: VirtualKeyCode;
    VK_FINAL: VirtualKeyCode;
    VK_HANJA: VirtualKeyCode;
    VK_KANJI: VirtualKeyCode;
    VK_ESCAPE: VirtualKeyCode;
    VK_CONVERT: VirtualKeyCode;
    VK_NONCONVERT: VirtualKeyCode;
    VK_ACCEPT: VirtualKeyCode;
    VK_MODECHANGE: VirtualKeyCode;
    VK_SPACE: VirtualKeyCode;
    VK_PRIOR: VirtualKeyCode;
    VK_NEXT: VirtualKeyCode;
    VK_END: VirtualKeyCode;
    VK_HOME: VirtualKeyCode;
    VK_LEFT: VirtualKeyCode;
    VK_UP: VirtualKeyCode;
    VK_RIGHT: VirtualKeyCode;
    VK_DOWN: VirtualKeyCode;
    VK_SELECT: VirtualKeyCode;
    VK_PRINT: VirtualKeyCode;
    VK_EXECUTE: VirtualKeyCode;
    VK_SNAPSHOT: VirtualKeyCode;
    VK_INSERT: VirtualKeyCode;
    VK_DELETE: VirtualKeyCode;
    VK_HELP: VirtualKeyCode;
    VK_0: VirtualKeyCode;
    VK_1: VirtualKeyCode;
    VK_2: VirtualKeyCode;
    VK_3: VirtualKeyCode;
    VK_4: VirtualKeyCode;
    VK_5: VirtualKeyCode;
    VK_6: VirtualKeyCode;
    VK_7: VirtualKeyCode;
    VK_8: VirtualKeyCode;
    VK_9: VirtualKeyCode;
    VK_A: VirtualKeyCode;
    VK_B: VirtualKeyCode;
    VK_C: VirtualKeyCode;
    VK_D: VirtualKeyCode;
    VK_E: VirtualKeyCode;
    VK_F: VirtualKeyCode;
    VK_G: VirtualKeyCode;
    VK_H: VirtualKeyCode;
    VK_I: VirtualKeyCode;
    VK_J: VirtualKeyCode;
    VK_K: VirtualKeyCode;
    VK_L: VirtualKeyCode;
    VK_M: VirtualKeyCode;
    VK_N: VirtualKeyCode;
    VK_O: VirtualKeyCode;
    VK_P: VirtualKeyCode;
    VK_Q: VirtualKeyCode;
    VK_R: VirtualKeyCode;
    VK_S: VirtualKeyCode;
    VK_T: VirtualKeyCode;
    VK_U: VirtualKeyCode;
    VK_V: VirtualKeyCode;
    VK_W: VirtualKeyCode;
    VK_X: VirtualKeyCode;
    VK_Y: VirtualKeyCode;
    VK_Z: VirtualKeyCode;
    VK_LWIN: VirtualKeyCode;
    VK_RWIN: VirtualKeyCode;
    VK_APPS: VirtualKeyCode;
    VK_SLEEP: VirtualKeyCode;
    VK_NUMPAD0: VirtualKeyCode;
    VK_NUMPAD1: VirtualKeyCode;
    VK_NUMPAD2: VirtualKeyCode;
    VK_NUMPAD3: VirtualKeyCode;
    VK_NUMPAD4: VirtualKeyCode;
    VK_NUMPAD5: VirtualKeyCode;
    VK_NUMPAD6: VirtualKeyCode;
    VK_NUMPAD7: VirtualKeyCode;
    VK_NUMPAD8: VirtualKeyCode;
    VK_NUMPAD9: VirtualKeyCode;
    VK_MULTIPLY: VirtualKeyCode;
    VK_ADD: VirtualKeyCode;
    VK_SEPARATOR: VirtualKeyCode;
    VK_SUBTRACT: VirtualKeyCode;
    VK_DECIMAL: VirtualKeyCode;
    VK_DIVIDE: VirtualKeyCode;
    VK_F1: VirtualKeyCode;
    VK_F2: VirtualKeyCode;
    VK_F3: VirtualKeyCode;
    VK_F4: VirtualKeyCode;
    VK_F5: VirtualKeyCode;
    VK_F6: VirtualKeyCode;
    VK_F7: VirtualKeyCode;
    VK_F8: VirtualKeyCode;
    VK_F9: VirtualKeyCode;
    VK_F10: VirtualKeyCode;
    VK_F11: VirtualKeyCode;
    VK_F12: VirtualKeyCode;
    VK_F13: VirtualKeyCode;
    VK_F14: VirtualKeyCode;
    VK_F15: VirtualKeyCode;
    VK_F16: VirtualKeyCode;
    VK_F17: VirtualKeyCode;
    VK_F18: VirtualKeyCode;
    VK_F19: VirtualKeyCode;
    VK_F20: VirtualKeyCode;
    VK_F21: VirtualKeyCode;
    VK_F22: VirtualKeyCode;
    VK_F23: VirtualKeyCode;
    VK_F24: VirtualKeyCode;
    VK_NUMLOCK: VirtualKeyCode;
    VK_SCROLL: VirtualKeyCode;
    VK_LSHIFT: VirtualKeyCode;
    VK_RSHIFT: VirtualKeyCode;
    VK_LCONTROL: VirtualKeyCode;
    VK_RCONTROL: VirtualKeyCode;
    VK_LMENU: VirtualKeyCode;
    VK_RMENU: VirtualKeyCode;
    VK_BROWSER_BACK: VirtualKeyCode;
    VK_BROWSER_FORWARD: VirtualKeyCode;
    VK_BROWSER_REFRESH: VirtualKeyCode;
    VK_BROWSER_STOP: VirtualKeyCode;
    VK_BROWSER_SEARCH: VirtualKeyCode;
    VK_BROWSER_FAVORITES: VirtualKeyCode;
    VK_BROWSER_HOME: VirtualKeyCode;
    VK_VOLUME_MUTE: VirtualKeyCode;
    VK_VOLUME_DOWN: VirtualKeyCode;
    VK_VOLUME_UP: VirtualKeyCode;
    VK_MEDIA_NEXT_TRACK: VirtualKeyCode;
    VK_MEDIA_PREV_TRACK: VirtualKeyCode;
    VK_MEDIA_STOP: VirtualKeyCode;
    VK_MEDIA_PLAY_PAUSE: VirtualKeyCode;
    VK_LAUNCH_MAIL: VirtualKeyCode;
    VK_LAUNCH_MEDIA_SELECT: VirtualKeyCode;
    VK_LAUNCH_APP1: VirtualKeyCode;
    VK_LAUNCH_APP2: VirtualKeyCode;
    VK_OEM_1: VirtualKeyCode;
    VK_OEM_PLUS: VirtualKeyCode;
    VK_OEM_COMMA: VirtualKeyCode;
    VK_OEM_MINUS: VirtualKeyCode;
    VK_OEM_PERIOD: VirtualKeyCode;
    VK_OEM_2: VirtualKeyCode;
    VK_OEM_3: VirtualKeyCode;
    VK_OEM_4: VirtualKeyCode;
    VK_OEM_5: VirtualKeyCode;
    VK_OEM_6: VirtualKeyCode;
    VK_OEM_7: VirtualKeyCode;
    VK_OEM_8: VirtualKeyCode;
    VK_PROCESSKEY: VirtualKeyCode;
    VK_ATTN: VirtualKeyCode;
    VK_CRSEL: VirtualKeyCode;
    VK_EXSEL: VirtualKeyCode;
    VK_EREOF: VirtualKeyCode;
    VK_PLAY: VirtualKeyCode;
    VK_ZOOM: VirtualKeyCode;
    VK_NONAME: VirtualKeyCode;
    VK_PA1: VirtualKeyCode;
    VK_OEM_CLEAR: VirtualKeyCode;
};

/**
 * 仮想キーコード一覧
 * @type {VirtualKeyCodes}
 */
declare const VK_DATA: VirtualKeyCodes;

/**
 * マウスイベント用コード
 * @typedef {Object} MouseEventFCodes
 * @property {number} MOUSEEVENTF_ABSOLUTE
 * @property {number} MOUSEEVENTF_MOVE
 * @property {number} MOUSEEVENTF_LEFTDOWN
 * @property {number} MOUSEEVENTF_LEFTUP
 * @property {number} MOUSEEVENTF_RIGHTDOWN
 * @property {number} MOUSEEVENTF_RIGHTUP
 * @property {number} MOUSEEVENTF_MIDDLEDOWN
 * @property {number} MOUSEEVENTF_MIDDLEUP
 * @property {number} MOUSEEVENTF_WHEEL
 * @property {number} MOUSEEVENTF_XDOWN
 * @property {number} MOUSEEVENTF_XUP
 */
declare type MouseEventFCodes = {
    MOUSEEVENTF_ABSOLUTE: number;
    MOUSEEVENTF_MOVE: number;
    MOUSEEVENTF_LEFTDOWN: number;
    MOUSEEVENTF_LEFTUP: number;
    MOUSEEVENTF_RIGHTDOWN: number;
    MOUSEEVENTF_RIGHTUP: number;
    MOUSEEVENTF_MIDDLEDOWN: number;
    MOUSEEVENTF_MIDDLEUP: number;
    MOUSEEVENTF_WHEEL: number;
    MOUSEEVENTF_XDOWN: number;
    MOUSEEVENTF_XUP: number;
};

/**
 * マウスイベント用コード一覧
 * @type {MouseEventFCodes}
 */
declare const MOUSEEVENTF_DATA: MouseEventFCodes;

/**
 * キーイベント発生時のオプション
 * @typedef {Object} KeyEventOption
 * @property {number} [count_max=1] 繰り返す回数
 * @property {boolean} [is_not_pushed=false] 押さない
 * @property {boolean} [is_not_released=false] 離さない
 * @property {number} [push_time_sec=0] 押下時間
 * @property {boolean} [is_pressed_shift=false]
 * @property {boolean} [is_pressed_alt=false]
 * @property {boolean} [is_pressed_ctrl=false]
 */
declare type KeyEventOption = {
    count_max?: number;
    is_not_pushed?: boolean;
    is_not_released?: boolean;
    push_time_sec?: number;
    is_pressed_shift?: boolean;
    is_pressed_alt?: boolean;
    is_pressed_ctrl?: boolean;
};

/**
 * マウスイベント発生時のオプション
 * @typedef {Object} MouseEventOption
 * @property {number} [count_max=1] 繰り返す回数
 * @property {boolean} [is_not_pushed=false] 押さない
 * @property {boolean} [is_not_released=false] 離さない
 * @property {number} [push_time_sec=0] 押下時間
 */
declare type MouseEventOption = {
    count_max?: number;
    is_not_pushed?: boolean;
    is_not_released?: boolean;
    push_time_sec?: number;
};

/**
 * ハンドルを取得する際に必要なデータ
 * @typedef {Object} RobotGetHandleData
 * @property {string|number} [classname=0] クラス名
 * @property {string|number} [windowtext=0] ウィンドウ名
 */
declare type RobotGetHandleData = {
    classname?: string | number;
    windowtext?: string | number;
};

/**
 * ウィンドウやマウスなどを自動操作するためのクラス
 */
declare class Robot {
    /**
     * キーを入力する
     * @param {VirtualKeyCode} vkcode - キーコード（利用可能なコードは、Robot.getVK() で取得可能）
     * @param {KeyEventOption} [option] - オプション
     */
    static setKeyEvent(vkcode: VirtualKeyCode, option?: KeyEventOption): void;
    /**
     * 仮想キーコードの一覧を取得します
     * @returns {VirtualKeyCodes}
     */
    static getVK(): VirtualKeyCodes;
    /**
     * マウスのクリックを行う
     * @param {string} type - "LEFT", "RIGHT", "CLICK", "DOUBLE_CLICK"といった文字列
     * @param {KeyEventOption} [option] - オプション
     */
    static setMouseEvent(type: string, option?: KeyEventOption): void;
    /**
     * マウスの座標を調べる
     * @returns {WSHRobotPosition}
     */
    static getCursorPosition(): WSHRobotPosition;
    /**
     * マウスの座標を設定する
     * @param {WSHRobotPosition} position
     */
    static setCursorPosition(position: WSHRobotPosition): void;
    /**
     * 指定したハンドルを取得する
     * @param {RobotGetHandleData} get_handle_data
     * @returns {number}
     */
    static getHandle(get_handle_data: RobotGetHandleData): number;
    /**
     * 指定したクラス名のハンドルを取得する
     * @param {string} classname
     * @returns {number}
     */
    static getHandleOfClassName(classname: string): number;
    /**
     * 指定したハンドルのクラス名を取得する
     * @param {number} handle
     * @returns {string}
     */
    static getClassName(handle: number): string;
    /**
     * 指定したウィンドウ名のハンドルを取得する
     * @param {string} windowname
     * @returns {number}
     */
    static getHandleOfWindowText(windowname: string): number;
    /**
     * 指定したハンドルのウィンドウ名を取得する
     * @param {number} handle
     * @returns {string}
     */
    static getWindowText(handle: number): string;
    /**
     * 指定したハンドルの位置とサイズを取得する
     * @param {number} handle
     * @returns {WSHRobotRect}
     */
    static getWindowRect(handle: number): WSHRobotRect;
    /**
     * 指定したハンドルの位置とサイズを設定する
     * @param {number} handle
     * @param {WSHRobotRect} rect
     * @returns {void}
     */
    static setWindowRect(handle: number, rect: WSHRobotRect): void;
    /**
     * アクティブなウィンドウのハンドルを取得する
     * @returns {number}
     */
    static getActiveWindow(): number;
    /**
     * アクティブなウィンドウを設定する
     * @param {number} handle
     * @returns {void}
     */
    static setActiveWindow(handle: number): void;
    /**
     * 指定したハンドルのプロセスIDを取得する
     * @param {number} handle
     * @returns {number}
     */
    static getPID(handle: number): number;
    /**
     * 指定したプロセスIDを終了させる
     * @param {number} pid
     */
    static terminateProcess(pid: number): void;
}

/**
 * 初期化
 * @param {string|SFile} pathname ファイル名／フォルダ名／URLアドレス
 */
declare class SFile {
    constructor(pathname: string | SFile);
    /**
     * ファイルの削除（ゴミ箱には入りません）
     * @param {boolean} [is_force=false] - 読み取り専用でも削除する
     * @returns {boolean}
     */
    remove(is_force?: boolean): boolean;
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
     * URLなら最後にスラッシュをつけて返す
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
     * 読み取り専用ファイルかどうか
     * @returns {boolean}
     */
    isReadOnly(): boolean;
    /**
     * 読み取り専用ファイルかどうかを設定する
     * @param {boolean} is_readonly
     * @param {boolean} [is_allfiles=false]
     * @returns {boolean}
     */
    setReadOnly(is_readonly: boolean, is_allfiles?: boolean): boolean;
    /**
     * 隠しファイルかどうか
     * @returns {boolean}
     */
    isHidden(): boolean;
    /**
     *隠しファイルかどうかを設定する
     * @param {boolean} is_hidden
     * @param {boolean} [is_allfiles=false]
     * @returns {boolean}
     */
    setHidden(is_hidden: boolean, is_allfiles?: boolean): boolean;
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
     * 実行ファイルを起動する
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
     * @param {boolean} [issetBOM=true] - BOMの有無(`utf-8`のみ有効 )
     * @returns {boolean}
     */
    setTextFile(text: string, charset?: string, newline?: string, issetBOM?: boolean): boolean;
    /**
     * バイナリファイルを開く
     * - 参考速度：0.5 sec/MB
     * - 巨大なファイルの一部を調べる場合は、位置とサイズを指定した方がよい
     *
     * @param {number} [offset] - 位置（※ 指定すると速度が低下する）
     * @param {number} [size] - サイズ（※ 指定すると速度が低下する）
     * @returns {number[]}
     */
    getBinaryFile(offset?: number, size?: number): number[];
    /**
     * バイナリファイルを保存
     * - 参考速度：1.0 sec/MB
     *
     * @param {number[]} array_
     * @param {number} [offset] - 位置（※ 指定すると速度が低下する）
     * @returns {boolean}
     */
    setBinaryFile(array_: number[], offset?: number): boolean;
    /**
     * ファイルのハッシュ値を計算する
     * @param {string} [algorithm="MD5"] - アルゴリズム
     * @returns {string} 半角英数の16進数で表したハッシュ値、失敗時は`"0"`
     */
    getHashCode(algorithm?: string): string;
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
     * フォルダの中のフォルダとファイルに対して指定した関数を実行する
     * @param {function(SFile): boolean} func 戻り値が`false`で処理を終了。
     * @returns {boolean} result
     */
    each(func: (...params: any[]) => any): boolean;
    /**
     * サブフォルダの中まで探索して全てのファイルとフォルダを取得
     * @returns {SFile[]}
     */
    getAllFiles(): SFile[];
    /**
     * 指定した条件にあうファイルを探す
     * 関数を指定する場合は、ファイル名とフルパスが引数に渡されます
     * @param {string|SFile|function(string, string): boolean} file_obj
     * @returns {SFile|null}
     */
    searchFile(file_obj: string | SFile | ((...params: any[]) => any)): SFile | null;
    /**
     * 圧縮する
     * - 圧縮後のファイル名の拡張子で圧縮したい形式を指定する
     * - Windows標準の機能を使用して圧縮する( `zip` のみ対応)
     * - 外部ツール `7-Zip` がインストール／設定されている場合は、それを利用して圧縮する
     *
     * @param {SFile|string|SFile[]|string[]} input_file 圧縮したいファイル
     * @param {SFile|string} output_file 圧縮後のファイル名
     * @returns {boolean} result
     */
    static compress(input_file: SFile | string | SFile[] | string[], output_file: SFile | string): boolean;
    /**
     * 展開する
     * - Windows標準の機能を使用して展開する( `zip` のみ対応)
     * - 外部ツール `7-Zip` がインストール／設定されている場合は、それを利用して展開する
     *
     * @param {SFile|string} input_file 展開したいファイル
     * @param {SFile|string} output_file 展開先のフォルダ
     * @returns {boolean} result
     */
    static extract(input_file: SFile | string, output_file: SFile | string): boolean;
    /**
     * 圧縮／展開用のツールを設定する
     * - このツールを利用して `compress`, `extract` が実行されます
     * - 未設定/未インストールの場合は、Windows標準の機能のみを利用し、`zip`のみ対応します
     * - `7-zip` のコマンドライン版 (`7za.exe`)のみ対応
     * @param {SFile|string} tool_path ツールのファイルパス
     * @returns {boolean} result
     */
    static setCompressTool(tool_path: SFile | string): boolean;
    /**
     * 圧縮／展開用のツールを取得する
     * - このツールを利用して `compress`, `extract` が実行されます
     * - 未設定/未インストールの場合は、Windows標準の機能のみを利用し、`zip`のみ対応します
     * - 取得できない場合は `null` を返します
     * @returns {SFile|null} result
     */
    static getCompressTool(): SFile | null;
}

/**
 * 実行結果
 * @typedef {Object} SystemExecResult
 * @property {string} out
 * @property {string} error
 * @property {number} exit_code
 */
declare type SystemExecResult = {
    out: string;
    error: string;
    exit_code: number;
};

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
     * @param {number} time_sec 停止する秒数
     */
    static sleep(time_sec: number): void;
    /**
     * 処理を停止
     */
    static stop(): void;
    /**
     * ビープ音を鳴らす
     * @param {number} frequency_hz - 周波数
     * @param {number} time_sec - 鳴らす秒数
     */
    static beep(frequency_hz: number, time_sec: number): void;
    /**
     * 指定したコマンドを別プロセスとして実行する
     * @param {string} command - コマンド
     * @param {number} [style=1] - 起動オプション
     * @param {boolean} [is_wait=false] - プロセスが終了するまで待つ
     */
    static run(command: string, style?: number, is_wait?: boolean): void;
    /**
     * 指定したコマンドを子プロセスとして実行する
     * @param {string} command
     * @returns {SystemExecResult}
     */
    static exec(command: string): SystemExecResult;
    /**
     * 指定した変数が定義されているか調べる
     * @param {string} variable_name
     * @returns {boolean}
     */
    static isDefined(variable_name: string): boolean;
    /**
     * プログラムを終了させます。
     * @param {number} [exit_code=0]
     */
    static exit(exit_code?: number): void;
    /**
     * CUIで起動しなおす
     * @param {boolean} [is_use_chakra] - 高速なChakraエンジンを利用する（wsfが開けなくなる）
     */
    static executeOnCScript(is_use_chakra?: boolean): void;
    /**
     * GUIで起動しなおす
     */
    static executeOnWScript(): void;
    /**
     * 指定した環境変数の値を取得する
     * @param {string} env_name 環境変数（%は省略可能）
     * @returns {string}
     */
    static getEnvironmentString(env_name: string): string;
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
    /**
     * PowerShell を実行する
     *
     * @param {string} source
     * @returns {string}
     */
    static PowerShell(source: string): string;
    /**
     * WindowsAPI を実行する
     *
     * 例
     * - `dll_name` : `"user32.dll"`
     * - `function_text` : `"int MessageBox(IntPtr hWnd, string lpText, string lpCaption, UInt32 uType)""`
     * - `exec_text` : `"$api::MessageBox(0, \"テキスト\", \"キャプション\", 0);"`
     * @param {string} dll_name - 利用するdll
     * @param {string} function_text - 関数の定義データ(`$api`に代入されます。)
     * @param {string} exec_text - 実行コマンド
     * @returns {string}
     */
    static WindowsAPI(dll_name: string, function_text: string, exec_text: string): string;
    /**
     * クリップボードからテキストを取得する
     * @returns {string}
     */
    static getClipBoardText(): string;
    /**
     * クリップボードへテキストを設定する
     * @param {string} text
     */
    static setClipBoardText(text: string): void;
    /**
     * `XMLHttpRequest` を作成
     * - 取得できない場合は `null`
     *
     * @returns {XMLHttpRequest}
     */
    static createXMLHttpRequest(): XMLHttpRequest;
    /**
     * `MSXML2.DOMDocument` を作成
     * - 取得できない場合は `null`
     *
     * @returns {any}
     */
    static createMSXMLDOMDocument(): any;
    /**
     * `Byte 配列` から数値配列を作成する
     * - `ADODB.Stream` などを用いて取得したバイナリ配列を `JavaScript` でも扱える型へ変更する
     *
     * @param {any} byte_array
     * @returns {number[]}
     */
    static createNumberArrayFromByteArray(byte_array: any): number[];
    /**
     * 数値配列から`Byte 配列`を作成する
     * - `ADODB.Stream` などを用いて取得したバイナリ配列を `JavaScript` でも扱える型へ変更する
     * - `offset` を指定した場合は、出力したバイト配列はその位置までは `NUL` で埋まった配列となる
     *
     * @param {number[]} number_array
     * @param {number} [offset = 0]
     * @returns {any}
     */
    static createByteArrayFromNumberArray(number_array: number[], offset?: number): any;
}

/**
 * SenkoWSH
 */
declare const SenkoWSH: any;


