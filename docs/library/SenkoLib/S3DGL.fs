// 精度
precision mediump float;

// 材質
#define MATERIALS_MAX			4
uniform vec4	materialsColor[MATERIALS_MAX];
uniform vec4	materialsSpecular[MATERIALS_MAX];
uniform vec3	materialsEmission[MATERIALS_MAX];
uniform vec4	materialsAmbientAndReflect[MATERIALS_MAX];

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
uniform float	lightsRange[LIGHTS_MAX];
uniform vec3	lightsVector[LIGHTS_MAX];
uniform vec3	lightsColor[LIGHTS_MAX];

// 視線
uniform vec3 eyeWorldDirection;

// シェーダー間情報
varying float interpolationMaterialFloat;
varying vec3 interpolationNormal;
varying vec3 interpolationWorldNormal;
varying vec3 interpolationPosition;
varying vec2 interpolationTextureCoord;

void main(void) {

	// 頂点シェーダーから受け取った情報
	int		vertexMaterial		= int(interpolationMaterialFloat);
	vec3	vertexNormal		= normalize(interpolationNormal);
	vec3	vertexReflectVector	= reflect(eyeWorldDirection, normalize(interpolationWorldNormal));

	// 材質を取得
	vec3	materialColor;
	float	materialDiffuse;
	vec3	materialSpecular;
	float	materialPower;
	vec3	materialEmission;
	vec3	materialAmbient;
	float	materialReflect;
	if(vertexMaterial < 4) {
		if(vertexMaterial < 2) {
			if(vertexMaterial == 0) {
				materialColor		= materialsColor[0].xyz;
				materialDiffuse		= materialsColor[0].z;
				materialSpecular	= materialsSpecular[0].xyz;
				materialPower		= materialsSpecular[0].w;
				materialEmission	= materialsEmission[0];
				materialAmbient		= materialsAmbientAndReflect[0].xyz;
				materialReflect		= materialsAmbientAndReflect[0].w;
			}
			else {
				materialColor		= materialsColor[1].xyz;
				materialDiffuse		= materialsColor[1].z;
				materialSpecular	= materialsSpecular[1].xyz;
				materialPower		= materialsSpecular[1].w;
				materialEmission	= materialsEmission[1];
				materialAmbient		= materialsAmbientAndReflect[1].xyz;
				materialReflect		= materialsAmbientAndReflect[1].w;
			}
		}
		else {
			if(vertexMaterial == 2) {
				materialColor		= materialsColor[2].xyz;
				materialDiffuse		= materialsColor[2].z;
				materialSpecular	= materialsSpecular[2].xyz;
				materialPower		= materialsSpecular[2].w;
				materialEmission	= materialsEmission[2];
				materialAmbient		= materialsAmbientAndReflect[2].xyz;
				materialReflect		= materialsAmbientAndReflect[2].w;
			}
			else {
				materialColor		= materialsColor[3].xyz;
				materialDiffuse		= materialsColor[3].z;
				materialSpecular	= materialsSpecular[3].xyz;
				materialPower		= materialsSpecular[3].w;
				materialEmission	= materialsEmission[3];
				materialAmbient		= materialsAmbientAndReflect[3].xyz;
				materialReflect		= materialsAmbientAndReflect[3].w;
			}
		}
	}

	// カメラが向いている方向を取得
	vec3	eyeDirection = normalize(matrixWorldToLocal * vec4(eyeWorldDirection, 0.0)).xyz;
	
	// 物質の色の初期値
	vec3	destDiffuse		= materialEmission;
	vec3	destSpecular	= vec3(0.0, 0.0, 0.0);
	vec3	destAmbient		= materialAmbient * 0.2;
	
	// 光の色の平均
	vec3	averageLightsColor = vec3(0.0, 0.0, 0.0);
	
	// 光による物体の色を計算
	{
		for(int i = 0; i < LIGHTS_MAX; i++) {
			// 平行光源か点光源
			if((lightsMode[i] == LIGHT_MODE_DIRECTIONAL)||(lightsMode[i] == LIGHT_MODE_POINT)) {
				bool is_direction = lightsMode[i] == LIGHT_MODE_DIRECTIONAL;
				// 光源の種類によって、ピクセルと光への方向ベクトルの計算を変える
				// lightsVector は、点光源なら位置を、平行光源なら方向を指す値
				vec3 lightDirection = is_direction ?
					normalize(matrixWorldToLocal * vec4(lightsVector[i], 0.0)).xyz :
					normalize(matrixWorldToLocal * vec4(interpolationPosition - lightsVector[i], 0.0)).xyz;
				float d = is_direction ? -1.0 : length(lightsVector[i] - interpolationPosition);
				if(d < lightsRange[i]) {
					// 点光源の場合は遠いほど暗くする
					float rate = is_direction ? 1.0 : pow(1.0 - (d / lightsRange[i]), 0.5);
					// 拡散反射
					float diffuse	= clamp(((dot(vertexNormal, lightDirection) * 0.9) + 0.1) * materialDiffuse, 0.0, 1.0);
					destDiffuse		+= lightsColor[i].xyz * materialColor.xyz * diffuse * rate;
					// 鏡面反射
					vec3  halfLightEye	= normalize(lightDirection + eyeDirection);
					float specular = pow(clamp(dot(vertexNormal, halfLightEye), 0.0, 1.0), materialPower);
					destSpecular	+= lightsColor[i].xyz * materialSpecular.xyz * specular * rate;
				}
			}
			// アンビエント光
			else if(lightsMode[i] == LIGHT_MODE_AMBIENT) {
				destDiffuse		+= lightsColor[i].xyz * materialColor.xyz;
				destAmbient		+= lightsColor[i].xyz * materialAmbient.xyz;
			}
			// 光の色の平均
			averageLightsColor += lightsColor[i].xyz;
			
			if(i == lightsLength) {
				break;
			}
		}
		if(0 < lightsLength) {
			averageLightsColor /= vec3(lightsLength, lightsLength, lightsLength);
		}
	}
	
	// 最終的な色を計算
	vec3 destColor = vec3(0.0, 0.0, 0.0);
	
	{
		// ラフネス値(0...1)を暫定計算(大きいほどざらざらしている)
		float materialRoughness = (100.0 - materialPower) * 0.01;
		
		// アンビエント光
		destColor += destAmbient;
		
		// 拡散反射(ただし反射が大きいほど、拡散反射は弱くなるとする)
		destColor += clamp(destDiffuse * (1.0 - materialReflect * 0.8), 0.0, 1.0);
		
		// 鏡面反射
		destColor += destSpecular;
		
		// 周囲の反射
		if(materialReflect > 0.0001) {
			// 周囲の模様を作る
			//　ラフネスが大きいほどぼんやりしている
			float x = vertexReflectVector.y;
			float x1 = mix(-0.1, -0.5, materialRoughness);
			float x2 = mix(0.01,  0.5, materialRoughness);
			float c1 = mix(-0.3,  0.5, materialRoughness);
			float c2 = mix( 0.9,  0.6, materialRoughness);
			float c3 = mix( 0.3,  0.4, materialRoughness);
			float c4 = mix( 1.2,  0.8, materialRoughness);
			float c5 = mix( 0.3,  0.5, materialRoughness);
			x = x < x1	?	mix( c1, c2,	(x + 1.0)	* (1.0 / (1.0 + x1)))	:
				x < 0.0 ?	mix( c2, c3,	(x - x1)	* (1.0 / -x1))			:
				x < x2	?	mix( c3, c4,	x			* (1.0 / x2))			:
							mix( c4, c5,	(x - x2)	* (1.0 / (1.0 - x2)))	;
			// 映り込む模様
			//  リフレクトが大きいほどはっきり強くうつりこむ
			//  映り込む模様は、周りの光の色に影響する
			vec3 reflectColor = vec3(x, x, x) * materialReflect * averageLightsColor;
			// 映り込む模様の色
			//  ラフネスが大きいほど、物体の色で映り込む
			//  ラフネスが小さいほど、スペキュラの色で映り込む
			reflectColor *= materialRoughness * materialColor + (1.0 - materialRoughness) * materialSpecular;
			destColor += reflectColor;
		}
	}
	
	gl_FragColor = vec4(destColor, 1.0);
}