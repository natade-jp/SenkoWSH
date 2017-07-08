// 精度
precision mediump float;

// バーテックスシェーダからもらう情報
varying vec4 vColor;

void main(void) {
	gl_FragColor = vColor;
}