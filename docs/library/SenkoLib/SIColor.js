/* global System, ImageData, SIData, SIDataRGBA, SIColorRGBA */

﻿/**
 * SIColor.js
 *  色数に関する処理をまとめました。
 *  オレンジビューアのソースコードを参考に作成しています。
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 *
 * DEPENDENT LIBRARIES:
 * 先に、SImageProcessing.js が必要です。
 */

/**
 * 使用している色数を取得します
 * @returns {Number}
 */
SIDataRGBA.prototype.getColorCount = function() {
	// 色を記録する領域
	// 0x200000 = 256 * 256 * 256 / 8 = 2097152
	var sw = new Uint8ClampedArray(0x200000);
	var count = 0;
	var x = 0, y = 0;
	for(; y < this.height; y++) {
		for(x = 0; x < this.width; x++) {
			var rrggbb = this.getPixelInside(x, y).getRRGGBB();
			var p1 = rrggbb >> 3; // x / 8
			var p2 = rrggbb  % 7; // x & 8
			if(((sw[p1] >> p2) & 1) === 0) {
				count++;
				sw[p1] = (sw[p1] ^ (1 << p2)) & 0xFF;
			}
		}
	}
	return count;
};

/**
 * メディアンカットで減色後のパレットを取得します。
 * @param {Number} colors 色の数
 * @returns {}
 */
SIDataRGBA.prototype.getPalletMedianCut = function(colors) {
	if(this.getColorCount()<=colors){
		return(null);
	}
	var i;
	var r, g, b;
	
	// 減色に用いる解像度
	var bit = 7;
	
	// 含まれる色数
	var color = new Uint32Array((1<<bit)*(1<<bit)*(1<<bit));
	
	// 現在の色数
	var colorcnt = 0;
	
	// 色から指定した解像度のrrggbb値を返す
	var RGBtoPositionForColor = function(color) {
		var r = color.getRed();
		var g = color.getGreen();
		var b = color.getBlue();
		return ((r>>(8-bit))<<(bit*2))|((g>>(8-bit))<<bit)|(b>>(8-bit));
	};
	
	// 0区切り目の初期値を計算する
	// それぞれの区切り幅に含まれた色数、及び区切り幅の最大値と最小値
	// R = 0, G = 1, B = 2 の位置とする
	var color_cnt = [];	
	var color_max = [[], [], []];
	var color_min = [[], [], []];
	// 色数は全画素
	color_cnt[0] = this.width * this.height;
	// 色の幅も最小から最大までとる
	for(i = 0; i < 3; i++) {
		color_min[i][colorcnt] = 0;					//bit最小値
		color_max[i][colorcnt] = (1 << bit) - 1;	//bit最大値
	}
	
	// あらかじめ各色が何画素含まれているかを調査する
	var x = 0, y = 0;
	for(; y < this.height; y++) {
		for(x = 0; x < this.width; x++) {
			color[RGBtoPositionForColor(this.getPixelInside(x, y))]++;
		}
	}
	
	// 色の幅
	var r_delta, g_delta, b_delta;
	// 色の最大幅
	var max_r_delta, max_g_delta, max_b_delta;
	// 区切った回数
	var kugiri;

	// ここからアルゴリズム頑張った……！
	
	colorcnt++;
	for(kugiri = 1; colorcnt < colors ;) {
		
		//区切る場所(R・G・Bのどれを区切るか)を大雑把に決める
		//基準は体積
		var max_volume = 0, tgt = 0;
		for(i = 0; i < kugiri; i++) {
			r_delta = color_max[0][i] - color_min[0][i];
			g_delta = color_max[1][i] - color_min[1][i];
			b_delta = color_max[2][i] - color_min[2][i];
			var this_volume = r_delta * g_delta * b_delta;
			if(max_volume < this_volume) {
				max_volume = this_volume;
				max_r_delta = r_delta;
				max_g_delta = g_delta;
				max_b_delta = b_delta;
				tgt = i;
			}
		}

		//その立方体のうちどの次元を区切るか大雑把に決める
		//基準は幅
		var max_delta = max_g_delta; // 緑を優先して区切る
		var tgt_col = 1;
		if(max_delta < max_r_delta) {
			max_delta = max_r_delta;
			tgt_col = 0;
		}
		if(max_delta < max_b_delta) {
			max_delta = max_b_delta;
			tgt_col = 2;
		}

		// それ以上区切れなかった場合は終了
		if(max_delta === 0) {
			break;
		}

		// tgt の範囲を
		// tgt_col  の次元の中央で区切る
		{
			//区切る位置を調べる(色数の中心)
			var point = color_min[tgt_col][tgt] + (max_delta >> 1); //実際の中心
			//
			//新しく区切った範囲を作成
			if(point === color_max[tgt_col][tgt]) {
				color_min[tgt_col][kugiri] = point;
				color_max[tgt_col][kugiri] = color_max[tgt_col][tgt];
				color_max[tgt_col][tgt]   = point - 1;
			}
			else {
				color_min[tgt_col][kugiri] = point + 1;
				color_max[tgt_col][kugiri] = color_max[tgt_col][tgt];
				color_max[tgt_col][tgt]   = point;
			}

			//その他の範囲は受け継ぐ
			for( i=0;i < 3;i++){
				if(i === tgt_col) {
					continue;
				}
				color_min[i][kugiri] = color_min[i][tgt];
				color_max[i][kugiri] = color_max[i][tgt];
			}
		}
		
		// 新しく区切った範囲に対して、含まれる色の画素数を計算しなおす
		color_cnt[kugiri] = 0;
		for( r = color_min[0][kugiri];r <= color_max[0][kugiri];r++) {
			for( g = color_min[1][kugiri];g <= color_max[1][kugiri];g++) {
				for( b = color_min[2][kugiri];b <= color_max[2][kugiri];b++) {
					color_cnt[kugiri] += color[(r<<(bit<<1))|(g<<bit)|b];
				}
			}
		}
		color_cnt[tgt] -= color_cnt[kugiri];

		// 新しく区切った先に画素が入って、区切り元の画素数がなくなった場合
		if(color_cnt[tgt] === 0) {
			// 区切った先のデータを、区切り元にコピーして、
			// 区切ったことをなかったことにする
			color_cnt[tgt] = color_cnt[kugiri];
			for(i = 0; i < 3; i++){
				color_min[i][tgt] = color_min[i][kugiri];
				color_max[i][tgt] = color_max[i][kugiri];
			}
		}
		// せっかく区切ったが、区切った先の画素数が0だった
		else if(color_cnt[kugiri] === 0) {
		}
		//色が両方とも分別できた場合
		else {
			kugiri++;
			colorcnt++;
		}
	}

	// 作成するパレット
	var pallet = [];
	
	//パレットを作る
	for(i = 0; i < colorcnt; i++) {
		//色数　×　色
		var avr_r = 0;
		var avr_g = 0;
		var avr_b = 0;
		for(r = color_min[0][i];r <= color_max[0][i];r++) {
			for(g = color_min[1][i];g <= color_max[1][i];g++) {
				for(b = color_min[2][i];b <= color_max[2][i];b++) {
					var color_sum = color[(r<<(bit<<1))|(g<<bit)|b];
					avr_r += color_sum * (r << (8-bit));
					avr_g += color_sum * (g << (8-bit));
					avr_b += color_sum * (b << (8-bit));
				}
			}
		}
		//平均を取る
		r = Math.round(avr_r / color_cnt[i]);
		g = Math.round(avr_g / color_cnt[i]);
		b = Math.round(avr_b / color_cnt[i]);
		r = r < 0 ? 0 : r > 255 ? 255 : r;
		g = g < 0 ? 0 : g > 255 ? 255 : g;
		b = b < 0 ? 0 : b > 255 ? 255 : b;

		//COLORREF 型で代入
		pallet[i] = new SIColorRGBA([r, g, b, 255]);
	}
	
	return pallet;
};

/**
 * パレットを用いて単純減色する
 * @param {Array} pallet
 * @returns {undefined}
 */
SIDataRGBA.prototype.filterSimpleReducingColor = function(pallet) {
	var x = 0, y = 0;
	for(; y < this.height; y++) {
		for(x = 0; x < this.width; x++) {
			var j, num;
			var thiscolor = this.getPixelInside(x, y);
			var sum = 0;
			var max = 0xffffff;
			for(j = 0; j < pallet.length; j++) {
				var difr = pallet[j].getColor()[0] - thiscolor.getColor()[0];
				var difg = pallet[j].getColor()[1] - thiscolor.getColor()[1];
				var difb = pallet[j].getColor()[2] - thiscolor.getColor()[2];
				difr *= difr;
				difg *= difg;
				difb *= difb;
				sum = difr + difg + difb;
				if(sum<max) {
					max = sum;
					num = j;
				}
			}
			var color = new SIColorRGBA(
				[
					pallet[num].getColor()[0],
					pallet[num].getColor()[1],
					pallet[num].getColor()[2],
					thiscolor.getColor()[3]
				]
			);
			this.setPixelInside(x, y, color);
		}
	}
};
