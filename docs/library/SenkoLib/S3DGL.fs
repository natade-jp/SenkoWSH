﻿// 精度
precision mediump float;

// 材質
#define MATERIALS_MAX			4
uniform vec4	materialsColor[MATERIALS_MAX];
uniform float	materialsDiffuse[MATERIALS_MAX];
uniform vec3	materialsEmission[MATERIALS_MAX];
uniform vec3	materialsSpecular[MATERIALS_MAX];
uniform float	materialsPower[MATERIALS_MAX];
uniform vec3	materialsAmbient[MATERIALS_MAX];
uniform float	materialsReflect[MATERIALS_MAX];

// 頂点移動
uniform mat4 matrixWorldToLocal;

// ライト
#define LIGHTS_MAX				4
#define LIGHT_MODE_NONE			0
#define LIGHT_MODE_AMBIENT		1
#define LIGHT_MODE_DIRECTIONAL	2
#define LIGHT_MODE_POINT		3
uniform int		lightsLength;
uniform int		lightsMode[LIGHTS_MAX];
uniform float	lightsPower[LIGHTS_MAX];
uniform float	lightsRange[LIGHTS_MAX];
uniform vec3	lightsPosition[LIGHTS_MAX];
uniform vec3	lightsDirection[LIGHTS_MAX];
uniform vec3	lightsColor[LIGHTS_MAX];

// 視線
uniform vec3 eyeWorldDirection;

// シェーダー間情報
varying float interpolationMaterialFloat;
varying vec3 interpolationNormal;
varying vec3 interpolationPosition;

void main(void) {

	// 頂点シェーダーから受け取った情報
	int		vertexMaterial	= int(interpolationMaterialFloat);
	vec3	vertexNormal	= normalize(interpolationNormal);

	// 材質を取得
	vec4	materialColor;
	float	materialDiffuse;
	vec3	materialEmission;
	vec3	materialSpecular;
	float	materialPower;
	vec3	materialAmbient;
	float	materialReflect;
	if(vertexMaterial < 4) {
		if(vertexMaterial < 2) {
			if(vertexMaterial == 0) {
				materialColor		= materialsColor[0];
				materialDiffuse		= materialsDiffuse[0];
				materialEmission	= materialsEmission[0];
				materialSpecular	= materialsSpecular[0];
				materialPower		= materialsPower[0];
				materialAmbient		= materialsAmbient[0];
				materialReflect		= materialsReflect[0];
			}
			else {
				materialColor		= materialsColor[1];
				materialDiffuse		= materialsDiffuse[1];
				materialEmission	= materialsEmission[1];
				materialSpecular	= materialsSpecular[1];
				materialPower		= materialsPower[1];
				materialAmbient		= materialsAmbient[1];
				materialReflect		= materialsReflect[1];
			}
		}
		else {
			if(vertexMaterial == 2) {
				materialColor		= materialsColor[2];
				materialDiffuse		= materialsDiffuse[2];
				materialEmission	= materialsEmission[2];
				materialSpecular	= materialsSpecular[2];
				materialPower		= materialsPower[2];
				materialAmbient		= materialsAmbient[2];
				materialReflect		= materialsReflect[2];
			}
			else {
				materialColor		= materialsColor[3];
				materialDiffuse		= materialsDiffuse[3];
				materialEmission	= materialsEmission[3];
				materialSpecular	= materialsSpecular[3];
				materialPower		= materialsPower[3];
				materialAmbient		= materialsAmbient[3];
				materialReflect		= materialsReflect[3];
			}
		}
	}

	// カメラが向いている方向を取得
	vec3	eyeDirection = normalize(matrixWorldToLocal * vec4(eyeWorldDirection, 0.0)).xyz;
	
	// 物質の色の初期値
	vec3	destColor = materialEmission + materialAmbient * 0.2;

	// 光の数だけ繰り返す
	for(int i = 0; i < LIGHTS_MAX; i++) {
		
		// 平行光源か点光源
		if((lightsMode[i] == LIGHT_MODE_DIRECTIONAL)||(lightsMode[i] == LIGHT_MODE_POINT)) {
			bool is_direction = lightsMode[i] == LIGHT_MODE_DIRECTIONAL;
			// 光源の種類によって、ピクセルと光への方向ベクトルの計算を変える
			vec3 lightDirection = is_direction ?
				normalize(matrixWorldToLocal * vec4(lightsDirection[i], 0.0)).xyz :
				normalize(matrixWorldToLocal * vec4(interpolationPosition - lightsPosition[i], 0.0)).xyz;
			float d = is_direction ? -1.0 : length(lightsPosition[i] - interpolationPosition);
			if(d < lightsRange[i]) {
				// 点光源の場合は遠いほど暗くする
				float rate = is_direction ? 1.0 : pow(1.0 - (d / lightsRange[i]), 0.5);
				// 拡散反射
				float diffuse	= clamp(dot(vertexNormal, lightDirection) * materialDiffuse, 0.0, 1.0);
				destColor		+= lightsColor[i].xyz * materialColor.xyz * diffuse * rate;
				// 鏡面反射
				vec3  halfLightEye	= normalize(lightDirection + eyeDirection);
				float specular = pow(clamp(dot(vertexNormal, halfLightEye), 0.0, 1.0), materialPower);
				destColor		+= materialSpecular.xyz * specular * rate;
			}
		}
		else if(lightsMode[i] == LIGHT_MODE_AMBIENT) {
			destColor		+= lightsColor[i].xyz * materialColor.xyz;
		}
		if(i == lightsLength) {
			break;
		}
	}

	gl_FragColor = vec4(destColor, 1.0);
}