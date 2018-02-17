// 配列で渡す情報
attribute vec3 vertexNormal;
attribute vec3 vertexPosition;
attribute float vertexMaterialFloat;

// 素材の色など
#define MATERIALS_MAX			6
uniform vec4	materialsColor[MATERIALS_MAX];
uniform float	materialsDiffuse[MATERIALS_MAX];
uniform vec3	materialsEmission[MATERIALS_MAX];
uniform vec3	materialsSpecular[MATERIALS_MAX];
uniform float	materialsPower[MATERIALS_MAX];
uniform vec3	materialsAmbient[MATERIALS_MAX];
uniform float	materialsReflect[MATERIALS_MAX];

// 共通行列
uniform mat4 matrixWorldToLocal;
uniform mat4 matrixLocalToPerspective;

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

// フラグメントシェーダへ渡す情報
varying vec4 vColor;

void main(void) {
	
	int		vertexMaterial = int(vertexMaterialFloat);

	vec4	materialColor		= materialsColor[vertexMaterial];
	float	materialDiffuse		= materialsDiffuse[vertexMaterial];
	vec3	materialEmission	= materialsEmission[vertexMaterial];
	vec3	materialSpecular	= materialsSpecular[vertexMaterial];
	float	materialPower		= materialsPower[vertexMaterial];
	vec3	materialAmbient		= materialsAmbient[vertexMaterial];
	float	materialReflect		= materialsReflect[vertexMaterial];

	vec3	eyeDirection = normalize(matrixWorldToLocal * vec4(eyeWorldDirection, 0.0)).xyz;
	vec3	destColor = materialEmission;

	{
		for(int i = 0; i < LIGHTS_MAX; i++) {
			vec3 lightDirection = normalize(matrixWorldToLocal * vec4(lightsDirection[i], 0.0)).xyz;
			if(lightsMode[i] == LIGHT_MODE_DIRECTIONAL) {
				float diffuse	= clamp(dot(vertexNormal, lightDirection), 0.1, 1.0);
				destColor		+= materialsColor[vertexMaterial].xyz * diffuse;
			}
			if(i == lightsLength) {
				break;
			}
		}
	}

	vColor = vec4(destColor, 1.0);
	gl_Position = matrixLocalToPerspective * vec4(vertexPosition, 1.0);
}