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
uniform mat4 matrixWorldToLocal;
uniform mat4 matrixLocalToPerspective;

// ライト
#define LIGHTS_MAX		4
#define LIGHT_MODE_NONE			0
#define LIGHT_MODE_AMBIENT		1
#define LIGHT_MODE_DIRECTIONAL	2
#define LIGHT_MODE_POINT		3

#define LIGHTS_MAX 4
#define LIGHTS_MAX 4
uniform int lightsLength;
uniform int lightsMode[LIGHTS_MAX];
uniform float lightsPower[LIGHTS_MAX];
uniform float lightsRange[LIGHTS_MAX];
uniform vec3 lightsPosition[LIGHTS_MAX];
uniform vec3 lightsDirection[LIGHTS_MAX];
uniform vec3 lightsColor[LIGHTS_MAX];

// 視線
uniform vec3 eyeWorldDirection;

// フラグメントシェーダへ渡す情報
varying vec4 vColor;

void main(void) {
	
	vec3 eyeDirection = normalize(matrixWorldToLocal * vec4(eyeWorldDirection, 0.0)).xyz;
	vec3 destColor = materialEmission;
	
	{
		for(int i = 0; i < LIGHTS_MAX; i++) {
			vec3 lightDirection = normalize(matrixWorldToLocal * vec4(lightsDirection[i], 0.0)).xyz;
			if(lightsMode[i] == LIGHT_MODE_DIRECTIONAL) {
				float diffuse = clamp(dot(vertexNormal, lightDirection), 0.1, 1.0);
				destColor += materialColor.xyz * diffuse;
			}
			if(i == lightsLength) {
				break;
			}
		}
	}

	vColor = vec4(destColor, 1.0);
	gl_Position = matrixLocalToPerspective * vec4(vertexPosition, 1.0);
}