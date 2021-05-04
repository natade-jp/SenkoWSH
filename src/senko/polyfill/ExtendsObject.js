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
 * ES3相当のJScirptのObject拡張用クラス
 * - ES3 に機能拡張する予定でしたが for in の動作に支障が出るため拡張なしとする
 */
export default class ExtendsObject {

	/**
	 * 文字列化
	 * @param {any} obj
	 * @returns {string}
	 */
	static toString(obj) {
		/**
		 * 名前の配列
		 * @param {Object} obj
		 * @returns {string[]}
		 */
		const keys = function(obj) {
			const data = [];
			for(const key in obj) {
				data.push(key);
			}
			return data;
		}
		const length = keys(obj).length;
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

}
