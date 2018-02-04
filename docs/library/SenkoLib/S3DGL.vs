// 配列で渡す情報
attribute vec3 vertexNormal;
attribute vec3 vertexPosition;

// 素材の色など
attribute vec4 materialColor;
attribute float materialDiffuse;
attribute vec3 materialEmission;
attribute vec3 materialSpecular;
attribute float materialPower;
attribute vec3 materialAmbient;

// 共通行列
uniform mat4 matrixLocalToWorld;
uniform mat4 matrixLocalToPerspective;

// ライト
#define LIGHTS_MAX 4
uniform int lightsLength;
uniform int lightsMode[LIGHTS_MAX];
uniform float lightsPower[LIGHTS_MAX];
uniform float lightsRange[LIGHTS_MAX];
uniform vec3 lightsPosition[LIGHTS_MAX];
uniform vec3 lightsDirection[LIGHTS_MAX];
uniform vec3 lightsColor[LIGHTS_MAX];

// フラグメントシェーダへ渡す情報
varying vec4 vColor;

void main(void) {
	vColor = vec4(vec3(0.5, 0.5, 0.5) + vertexNormal * 0.5, 1.0);
//	vColor = vec4( materialAmbient , materialDiffuse);
	gl_Position = matrixLocalToPerspective * vec4(vertexPosition, 1.0);
}