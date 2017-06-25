/* global System, SComponent */

var s3 = new S3System();


﻿function test3D() {
	var v0 = new S3Vertex( new S3Vector(-5,  0, -10));
	var v1 = new S3Vertex( new S3Vector( 0, 10, -20));
	var v2 = new S3Vertex( new S3Vector( 5,  0, -30));
	
	var i1 = new S3TriangleIndex(0 ,1, 2);
	
	var mesh = new S3Mesh();
	mesh.addVertex(v0);
	mesh.addVertex(v1);
	mesh.addVertex(v2);
	mesh.addTriangleIndex(i1);

	var model = new S3Model();
	model.mesh		= mesh;

	var camera = new S3Camera();
	camera.setEye(new S3Vector( 0,  0,  50));
	camera.setLookAt(new S3Vector( 0,  0,  0));
	
	var scene = new S3Scene();
	scene.setCamera(camera);
	scene.addModel(model);

	s3.drawScene(scene);
}



﻿function main(args) {
	
	System.out.println("S3D クラスのサンプル");
	
	var m = new S3Matrix(
		3, -2, -6, 4,
		-7, -6, 8, 21,
		-4, -7, 9, 11,
		2, -3, -5, 8
	);
	
	System.out.println("行列を作成");
	System.out.println(m);
	
	System.out.println("行列の行列式");
	System.out.println(m.det());
	
	System.out.println("行列の逆行列");
	System.out.println(m.inverse());
	
	System.out.println("行列の掛け算");
	System.out.println(m.mul(m));
	
	var panel;
	// パネルを作って、指定した ID の要素内に入れる。
	panel = new SCanvas();
	panel.putMe("scomponent", SComponent.putype.IN);
	panel.setUnit(SComponent.unittype.PX);
	panel.setPixelSize(640, 480);
	panel.setSize(640, 480);
	
	s3.setCanvas(panel.getCanvas());
	
	test3D();
	
	
	
}

