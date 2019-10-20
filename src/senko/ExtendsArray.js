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
 * ES3相当のJScirptのArray拡張用
 * - Array.prototypeに拡張します
 */
export default class ExtendsArray {

	/**
	 * @param {any[]} array
	 * @param {any} object
	 * @returns {boolean}
	 */
	static includes(array, object) {
		return ExtendsArray.indexOf(array, object) !== -1;
	}

	/**
	 * @param {any[]} array
	 * @param {any} object
	 * @param {number} [fromIndex=0]
	 * @returns {number}
	 */
	static indexOf(array, object, fromIndex) {
		let i = fromIndex !== undefined ? fromIndex : 0;
		for(; i < array.length; i++) {
			if(array[i] === object) {
				return i;
			}
		}
		return -1;
	}

	/**
	 * @param {any[]} array
	 * @param {any} object
	 * @param {number} [fromIndex]
	 * @returns {number}
	 */
	static lastIndexOf(array, object, fromIndex) {
		let i = fromIndex !== undefined ? fromIndex : array.length - 1;
		for(; i >= 0; i--) {
			if(array[i] === object) {
				return i;
			}
		}
		return -1;
	}

	/**
	 * 安定ソート
	 * @param {any[]} array
	 * @param {function(any, any): number} [compareFunction]
	 * @returns {any[]}
	 */
	static sort(array, compareFunction) {
		let compare;
		if(compareFunction === undefined) {
			/**
			 * 昇順ソート用の関数
			 * @param {any} a
			 * @param {any} b
			 * @returns {number}
			 * @private
			 */
			compare = function(a, b) {
				if(a === b) {
					return 0;
				}
				if(typeof a === typeof b) {
					return (a < b ? -1 : 1);
				}
				return ((typeof a < typeof b) ? -1 : 1);
			};
		}
		else {
			compare = compareFunction;
		}
		/**
		 * @type {any[]}
		 * @private
		 */
		const temp = [];
		/**
		 * ソート関数（安定マージソート）
		 * @param {any[]} element 
		 * @param {number} first 
		 * @param {number} last 
		 * @param {function(any, any): number} cmp_function
		 * @private
		 */
		const sort = function(element, first, last, cmp_function) { 
			if(first < last) {
				const middle = Math.floor((first + last) / 2);
				sort(element, first, middle, cmp_function);
				sort(element, middle + 1, last, cmp_function);
				let p = 0, i, j, k;
				for(i = first; i <= middle; i++) {
					temp[p++] = element[i];
				}
				i = middle + 1;
				j = 0;
				k = first;
				while((i <= last) && (j < p)) {
					if(cmp_function(element[i], temp[j]) >= 0) {
						element[k++] = temp[j++];
					}
					else {
						element[k++] = element[i++];
					}
				}
				while(j < p) {
					element[k++] = temp[j++];
				}
			}
			return true;
		};
		sort(array, 0, array.length - 1, compare);
		return array;
	}

	/**
	 * @param {any[]} array
	 * @returns {string}
	 */
	static toString(array) {
		return array.join(", ");
	}

	/**
	 * ディープコピー
	 * @param {any[]} array
	 * @returns {any[]}
	 */
	static clone(array) {
		const out = new Array(array.length);
		for(let i = 0; i < array.length; i++) {
			out[i] = array[i];
		}
		return out;
	}
	

	/**
	 * 指定したデータを挿入
	 * @param {any[]} array
	 * @param {any|number} index_or_object
	 * @param {any} [object]
	 */
	static add(array, index_or_object, object) {
		if(object === undefined) {
			array.push(index_or_object);
		}
		else {
			array.splice(index_or_object, 0, object);
		}
	}
	
	/**
	 * 指定した配列を挿入
	 * @param {any[]} array
	 * @param {any[]|number} index_or_arraylist
	 * @param {any[]} [arraylist]
	 */
	static addAll(array, index_or_arraylist, arraylist) {
		if((arraylist === undefined) && ((typeof index_or_arraylist !== "number"))) {
			const list = index_or_arraylist;
			let j = array.length;
			for(let i = 0; i < list.length; i++) {
				array[j++] = list[i];
			}
		}
		else if(typeof index_or_arraylist === "number") {
			let index = index_or_arraylist;
			let list = arraylist;
			if(list === array) {
				list = array.slice(0);
			}
			let size = array.length - index;
			let target_i = array.length + list.length - 1;
			let source_i = array.length - 1;
			for(let i = 0; i < size ; i++ ) {
				array[target_i--] = array[source_i--];
			}
			size = list.length;
			for(let i = 0; i < size; i++) {
				array[index++] = list[i];
			}
		}
	}
	
	/**
	 * 指定した位置のデータを削除
	 * @param {any[]} array
	 * @param {number} index 
	 */
	static remove(array, index) {
		array.splice(index, 1);
	}
	
	/**
	 * 指定した範囲を削除
	 * @param {any[]} array
	 * @param {number} fromIndex 
	 * @param {number} toIndex 
	 */
	static removeRange(array, fromIndex, toIndex) {
		array.splice(fromIndex, toIndex - fromIndex);
	}
	
	/**
	 * 空かどうか
	 * @param {any[]} array
	 * @returns {boolean}
	 */
	static isEmpty(array) {
		return array.length === 0;
	}

}
