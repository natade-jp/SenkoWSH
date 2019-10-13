/**
 * The script is part of SenkoWSH.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

export default class ArrayList {
	
	/**
	 * @param {{element: any[]}} [array]
	 */
	constructor(array) {

		/**
		 * @type {Array}
		 * @private
		 */
		this.element = [];

		if(array !== undefined) {
			for(let i = 0; i < array.element.length; i++) {
				this.element[i] = array.element[i];
			}
		}
	}

	/**
	 * @param {function(number, any): boolean} func 
	 * @returns {boolean} result
	 */
	each(func) {
		let out = true;
		for(let i = 0; i < this.element.length; i++) {
			const x = this.element[i];
			if(func.call(x, i, x) === false) {
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
		return this.join(", ");
	}
	
	/**
	 * @returns {boolean}
	 */
	isEmpty() {
		return this.element.length === 0;
	}
	
	/**
	 * @param {any} object
	 * @returns {boolean}
	 */
	contains(object) {
		for(let i = 0; i < this.element.length; i++) {
			if(this.element[i] === object) {
				return true;
			}
		}
		return false;
	}
	
	/**
	 * @returns {number}
	 */
	size() {
		return this.element.length;
	}

	clear() {
		this.element.length = 0;
	}
	
	/**
	 * @param {string} [separator = ","]
	 * @returns {string}
	 */
	join(separator) {
		const sep = separator === undefined ? "," : separator;
		return this.element.join(sep);
	}
	
	/**
	 * @returns {ArrayList}
	 */
	clone() {
		const out = new ArrayList();
		for(let i = 0; i < this.element.length; i++) {
			out.element[i] = this.element[i];
		}
		return out;
	}
	
	/**
	 * @param {any} object 
	 * @returns {number}
	 */
	indexOf(object) {
		for(let i = 0; i < this.element.length; i++) {
			if(this.element[i] === object) {
				return i;
			}
		}
		return -1;
	}

	/**
	 * @returns {number}
	 */
	length() {
		return this.element.length;
	}
	
	/**
	 * @param {any} object 
	 * @returns {number}
	 */
	lastIndexOf(object) {
		for(let i = this.element.length - 1; i !== -1; i--) {
			if(this.element[i] === object) {
				return i;
			}
		}
		return -1;
	}
	
	/**
	 * @param {number} index 
	 */
	get(index) {
		return this.element[index];
	}
	
	/**
	 * @param {any|number} index_or_object
	 * @param {any} [object]
	 */
	add(index_or_object, object) {
		if(arguments.length === 1) {
			this.element.push(index_or_object);
		}
		else if(arguments.length === 2) {
			this.element.splice(index_or_object, 0, object);
		}
	}
	
	/**
	 * @param {ArrayList|number} index_or_arraylist
	 * @param {ArrayList} [arraylist]
	 */
	addAll(index_or_arraylist, arraylist) {
		if(index_or_arraylist instanceof ArrayList) {
			const list  = index_or_arraylist.element;
			let j = this.element.length;
			for(let i = 0; i < list.length; i++) {
				this.element[j++] = list[i];
			}
		}
		else if(typeof index_or_arraylist === "number") {
			let index = index_or_arraylist;
			let list  = arraylist.element;
			if(list === this.element) {
				list = this.element.slice(0);
			}
			let size = this.element.length - index;
			let target_i = this.element.length + list.length - 1;
			let source_i = this.element.length - 1;
			for(let i = 0; i < size ; i++ ) {
				this.element[target_i--] = this.element[source_i--];
			}
			size = list.length;
			for(let i = 0; i < size; i++) {
				this.element[index++] = list[i];
			}
		}
	}
	
	/**
	 * @param {number} index 
	 * @param {any} object 
	 */
	set(index, object) {
		this.element[index] = object;
	}
	
	/**
	 * @param {number} index 
	 */
	remove(index) {
		this.element.splice(index, 1);
	}
	
	/**
	 * @param {number} fromIndex 
	 * @param {number} toIndex 
	 */
	removeRange(fromIndex, toIndex) {
		this.element.splice(fromIndex, toIndex - fromIndex);
	}
	
	/**
	 * @param { function(any, any): number } [compareFunction]
	 */
	sort(compareFunction) {
		let compare;
		if(arguments.length === 0) {
			// 比較関数
			compare = ArrayList.COMPARE_DEFAULT;
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
		sort(this.element, 0, this.element.length - 1, compare);
	}

	/**
	 * @param {any} a
	 * @param {any} b
	 * @returns {number}
	 */
	static COMPARE_DEFAULT(a, b) {
		if(a === b) {
			return 0;
		}
		if(typeof a === typeof b) {
			return (a < b ? -1 : 1);
		}
		return ((typeof a < typeof b) ? -1 : 1);
	}

}
