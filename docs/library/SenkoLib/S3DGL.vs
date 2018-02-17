// 配列で渡す情報
attribute vec3 vertexNormal;
attribute vec3 vertexPosition;
attribute float vertexMaterialFloat;

// 頂点移動
uniform mat4 matrixLocalToPerspective;

// シェーダー間情報
varying float interpolationMaterialFloat;
varying vec3 interpolationNormal;

void main(void) {
	
	interpolationMaterialFloat = vertexMaterialFloat;
	interpolationNormal = vertexNormal;
	gl_Position = matrixLocalToPerspective * vec4(vertexPosition, 1.0);
}