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
 * ES3相当のJScirptのArray拡張用クラス
 * - ES3 に機能拡張する予定でしたが for in の動作に支障が出るため拡張なしとする
 */
export default class ExtendsArray {

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

}
