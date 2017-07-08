// 配列で渡す情報
attribute vec3 position;

// 共通行列
uniform mat4 mvpMatrix;

// フラグメントシェーダへ渡す情報
varying vec4 vColor;

void main(void) {
	vColor = vec4(1.0, 1.0, 1.0, 1.0);
	gl_Position = mvpMatrix * vec4(position, 1.0);
}