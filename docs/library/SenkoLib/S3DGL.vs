// 配列で渡す情報
attribute vec3 normal;
attribute vec3 position;
attribute vec4 color;

// 共通行列
uniform mat4 mvpMatrix;

// フラグメントシェーダへ渡す情報
varying vec4 vColor;

void main(void) {
	
	vColor = vec4(normal.xyz, 1.0);
	gl_Position = mvpMatrix * vec4(position, 1.0);
}