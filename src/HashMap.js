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
 * 文字列と任意のデータを組み合わせるハッシュマップ
 */
export default class HashMap {
	
	/**
	 * 初期化
	 * @param {HashMap|Object<string, any>} [hash_map]
	 */
	constructor(hash_map) {

		/**
		 * @type {Object<string, any>}
		 * @private
		 */
		this.map = {};

		/**
		 * @type {number}
		 * @private
		 */
		this._size = 0;
		
		if(hash_map !== undefined) {
			if(hash_map.map && hash_map._size) {
				for(const key in hash_map.map) {
					this.map[key] = hash_map.map[key];
				}
				this._size = hash_map._size;
			}
			else if(typeof hash_map === "object") {
				for(const key in hash_map) {
					if(typeof key === "string") {
						// @ts-ignore
						this.map[key] = hash_map[key];
					}
				}
			}
		}
	}

	/**
	 * 内部で利用しているArrayデータのディープコピーを取得する
	 * @return {any}
	 */
	getArray() {
		return this.clone().map;
	}

	/**
	 * 各要素に指定した関数を実行する
	 * @param {function(number, any): boolean} func 
	 * @returns {boolean} result
	 */
	each(func) {
		let out = true;
		for(const key in this.map) {
			const x = this.map[key];
			if(func.call(x, key, x) === false) {
				out = false;
				break;
			}
		}
		return out;
	}
	
	/**
	 * 文字列化
	 * @returns {string}
	 */
	toString() {
		let output = "";
		let i = 0;
		for(const key in this.map) {
			output += key + "=>" + this.map[key];
			i++;
			if(i !== this._size) {
				output += "\n";
			}
		}
		return output;
	}
	
	/**
	 * 指定したキーが含まれるか
	 * @param {string} key 
	 * @returns {boolean}
	 */
	containsKey(key) {
		return typeof this.map[key] !== "undefined";
	}
	
	/**
	 * 指定した値が含まれるか
	 * @param {any} value 
	 * @returns {boolean}
	 */
	containsValue(value) {
		for(const key in this.map) {
			if(this.map[key] === value) {
				return true;
			}
		}
		return false;
	}
	
	/**
	 * 空かどうか
	 * @returns {boolean}
	 */
	isEmpty() {
		return this._size === 0;
	}
	
	/**
	 * 空にする
	 */
	clear() {
		this.map = [];
		this._size = 0;
	}
	
	/**
	 * ディープコピー
	 * @returns {HashMap}
	 */
	clone() {
		const out = new HashMap();
		for(const key in this.map) {
			out.map[key] = this.map[key];
		}
		out._size = this._size;
		return out;
	}
	
	/**
	 * ハッシュの長さ
	 * @returns {number}
	 */
	size() {
		return this._size;
	}
	
	/**
	 * 指定したキーに対して対応する値を取得
	 * @param {string} key 
	 * @returns {any}
	 */
	get(key) {
		return this.map[key];
	}
	
	/**
	 * 指定したキー、その値を登録
	 * @param {string} key 
	 * @param {any} value 
	 * @returns {null|any}
	 */
	put(key, value) {
		if(this.containsKey(key) === false) {
			this.map[key] = value;
			this._size = this._size + 1;
			return null;
		}
		else {
			const output = this.map[key];
			this.map[key] = value;
			return output;
		}
	}
	
	/**
	 * 指定したキー、その値を全て登録
	 * @param {HashMap|Object<string, any>} hashmap 
	 */
	putAll(hashmap) {
		let list;
		if(hashmap instanceof HashMap) {
			list = hashmap.map;
		}
		else {
			list = hashmap;
		}
		for(const key in list) {
			if(typeof this.map[key] === "undefined") {
				this.map[key] = list[key];
				this._size = this._size + 1;
			}
		}
	}
	
	/**
	 * 指定したキーの値を削除
	 * @param {string} key 
	 * @returns {null|any}
	 */
	remove(key) {
		if(this.containsKey(key) === false) {
			return null;
		}
		else {
			const output = this.map[key];
			delete this.map[key];
			this._size = this._size - 1;
			return output;
		}
	}
}

