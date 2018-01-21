// 配列で渡す情報
attribute vec3 vertexNormal;
attribute vec3 vertexPosition;
attribute vec4 materialColor;

// 共通行列
uniform mat4 matrixLocalToWorld;
uniform mat4 matrixLocalToPerspective;

// ライト
#define LIGHTS_MAX 4
uniform int lightsMode[LIGHTS_MAX];
uniform float lightsPower[LIGHTS_MAX];
uniform float lightsRange[LIGHTS_MAX];
uniform vec3 lightsPosition[LIGHTS_MAX];
uniform vec3 lightsDirection[LIGHTS_MAX];
uniform vec3 lightsColor[LIGHTS_MAX];

// フラグメントシェーダへ渡す情報
varying vec4 vColor;

void main(void) {
	vec3 tNormal = normalize(matrixLocalToWorld * vec4(vertexNormal, 0.0)).xyz;
	vColor = vec4(tNormal.xyz, 1.0);
	gl_Position = matrixLocalToPerspective * vec4(vertexPosition, 1.0);
}