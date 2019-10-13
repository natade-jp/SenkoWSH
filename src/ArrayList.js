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
 */
export default class ArrayList {
	
	/**
	 * 配列
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
	 * 内部で利用しているArrayデータのディープコピーを取得する
	 * @return {any[]}
	 */
	getArray() {
		return this.clone().element;
	}

	/**
	 * 各要素に指定した関数を実行する
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
	 * 文字列化
	 * @returns {string}
	 */
	toString() {
		return this.join(", ");
	}
	
	/**
	 * 空にする
	 * @returns {boolean}
	 */
	isEmpty() {
		return this.element.length === 0;
	}
	
	/**
	 * 指定したデータが含まれるか
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
	 * 配列長
	 * @returns {number}
	 */
	size() {
		return this.element.length;
	}

	/**
	 * 配列を空にする
	 */
	clear() {
		this.element.length = 0;
	}
	
	/**
	 * 結合する
	 * @param {string} [separator = ","]
	 * @returns {string}
	 */
	join(separator) {
		const sep = separator === undefined ? "," : separator;
		return this.element.join(sep);
	}
	
	/**
	 * ディープコピー
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
	 * 指定したデータが何番目に含まれるか
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
	 * 配列長
	 * @returns {number}
	 */
	length() {
		return this.element.length;
	}
	
	/**
	 * 指定したデータが何番目に含まれるか（後ろから調べる）
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
	 * 指定した位置の配列値を取得
	 * @param {number} index 
	 */
	get(index) {
		return this.element[index];
	}
	
	/**
	 * 指定したデータを挿入
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
	 * 指定した配列を挿入
	 * @param {ArrayList|any[]|number} index_or_arraylist
	 * @param {ArrayList|any[]} [arraylist]
	 */
	addAll(index_or_arraylist, arraylist) {
		if(arguments.length === 1) {
			let list;
			if(index_or_arraylist instanceof ArrayList) {
				list = index_or_arraylist.element;
			}
			else if(typeof index_or_arraylist !== "number") {
				list = index_or_arraylist;
			}
			let j = this.element.length;
			for(let i = 0; i < list.length; i++) {
				this.element[j++] = list[i];
			}
		}
		else if(arguments.length === 2) {
			if(typeof index_or_arraylist === "number") {
				let index = index_or_arraylist;
				let list;
				if(arraylist instanceof ArrayList) {
					list = arraylist.element;
				}
				else {
					list = arraylist;
				}
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
	}
	
	/**
	 * 指定したデータで置き換える
	 * @param {number} index 
	 * @param {any} object 
	 */
	set(index, object) {
		this.element[index] = object;
	}
	
	/**
	 * 指定した位置のデータを削除
	 * @param {number} index 
	 */
	remove(index) {
		this.element.splice(index, 1);
	}
	
	/**
	 * 指定した範囲を削除
	 * @param {number} fromIndex 
	 * @param {number} toIndex 
	 */
	removeRange(fromIndex, toIndex) {
		this.element.splice(fromIndex, toIndex - fromIndex);
	}
	
	/**
	 * 安定ソート
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
	 * 昇順ソート用の関数
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
