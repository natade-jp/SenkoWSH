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
 * ES3相当のJScirptのObject拡張用
 * - Object.prototypeに拡張します
 */
export default class ExtendsObject {


	/**
	 * 指定したキーが含まれるか
	 * @param {Object} obj
	 * @param {any} key 
	 * @returns {boolean}
	 */
	static containsKey(obj, key) {
		return typeof obj[key] !== "undefined";
	}
	
	/**
	 * 指定した値が含まれるか
	 * @param {Object} obj
	 * @param {any} value 
	 * @returns {boolean}
	 */
	static containsValue(obj, value) {
		for(const key in obj) {
			if(obj[key] === value) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 名前の配列
	 * @param {Object} obj
	 * @returns {string[]}
	 */
	static keys(obj) {
		const data = [];
		for(const key in obj) {
			data.push(key);
		}
		return data;
	}
	
	/**
	 * 空かどうか
	 * @param {Object} obj
	 * @returns {boolean}
	 */
	static isEmpty(obj) {
		return ExtendsObject.keys(obj).length === 0;
	}
	
	/**
	 * 文字列化
	 * @param {Object} obj
	 * @returns {string}
	 */
	static toString(obj) {
		const length = ExtendsObject.keys(obj).length;
		let output = "";
		let i = 0;
		for(const key in obj) {
			output += key + "=>" + obj[key];
			i++;
			if(i !== length) {
				output += "\n";
			}
		}
		return output;
	}

	/**
	 * 指定したキー、その値を登録
	 * @param {Object} obj
	 * @param {string} key 
	 * @param {any} value 
	 * @returns {null|any}
	 */
	static put(obj, key, value) {
		if(!ExtendsObject.containsKey(obj, key)) {
			obj[key] = value;
			return null;
		}
		else {
			const output = obj[key];
			obj[key] = value;
			return output;
		}
	}

	/**
	 * 指定したキー、その値を全て登録
	 * @param {Object} obj
	 * @param {Object<string, any>} hashmap 
	 */
	static putAll(obj, hashmap) {
		for(const key in hashmap) {
			if(typeof obj[key] === "undefined") {
				obj[key] = hashmap[key];
			}
		}
	}
	
	/**
	 * 指定したキーの値を削除
	 * @param {Object} obj
	 * @param {string} key 
	 * @returns {null|any}
	 */
	static remove(obj, key) {
		if(!ExtendsObject.containsKey(obj, key)) {
			return null;
		}
		else {
			const output = obj[key];
			delete obj[key];
			return output;
		}
	}

}
