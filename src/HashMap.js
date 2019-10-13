/**
 * The script is part of SenkoWSH.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

export default class HashMap {
	
	/**
	 * @param {HashMap} [hash_map]
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
			for(const key in hash_map.map) {
				this.map[key] = hash_map.map[key];
			}
			this._size = hash_map._size;
		}
	}

	/**
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
	 * @param {string} key 
	 * @returns {boolean}
	 */
	containsKey(key) {
		return typeof this.map[key] !== "undefined";
	}
	
	/**
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
	 * @returns {boolean}
	 */
	isEmpty() {
		return this._size === 0;
	}
	
	clear() {
		this.map = [];
		this._size = 0;
	}
	
	/**
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
	 * @returns {number}
	 */
	size() {
		return this._size;
	}
	
	/**
	 * @param {string} key 
	 * @returns {any}
	 */
	get(key) {
		return this.map[key];
	}
	
	/**
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
	 * @param {HashMap} hashmap 
	 */
	putAll(hashmap) {
		for(const key in hashmap.map) {
			if(typeof this.map[key] === "undefined") {
				this.map[key] = hashmap.map[key];
				this._size = this._size + 1;
			}
		}
	}
	
	/**
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

