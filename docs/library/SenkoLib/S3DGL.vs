// 配列で渡す情報
attribute vec3 vertexNormal;
attribute vec3 vertexPosition;
attribute vec4 materialColor;

// 共通行列
uniform mat4 mvpMatrix;

// フラグメントシェーダへ渡す情報
varying vec4 vColor;

void main(void) {
	
	vColor = vec4(vertexNormal.xyz, 1.0);
	gl_Position = mvpMatrix * vec4(vertexPosition, 1.0);
}