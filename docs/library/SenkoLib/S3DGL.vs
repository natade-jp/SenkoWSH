// 配列で渡す情報
attribute vec3 vertexNormal;
attribute vec3 vertexPosition;
attribute vec2 vertexTextureCoord;
attribute float vertexMaterialFloat;

// 頂点移動
uniform mat4 matrixLocalToPerspective;
uniform mat4 matrixLocalToWorld;

// シェーダー間情報
varying float interpolationMaterialFloat;
varying vec3 interpolationNormal;
varying vec3 interpolationReflectNormal;
varying vec3 interpolationPosition;
varying vec2 interpolationTextureCoord;

void main(void) {
	
	interpolationMaterialFloat	= vertexMaterialFloat;
	interpolationNormal			= vertexNormal;
	interpolationReflectNormal	= (matrixLocalToPerspective * vec4(vertexNormal, 0.0)).xyz;
	interpolationPosition		= (matrixLocalToWorld * vec4(vertexPosition, 1.0)).xyz;
	interpolationTextureCoord	= vertexTextureCoord;
	gl_Position = matrixLocalToPerspective * vec4(vertexPosition, 1.0);
}