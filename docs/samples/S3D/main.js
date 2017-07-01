/* global System, SComponent, S3SystemMode, IDTools, S3Mesh */



﻿function test3D(canvas) {
	
	var s3 = new S3System();
	var controller = new CameraController();
	var camera = new S3Camera();

	s3.setCanvas2D(canvas);
	controller.setCanvas(canvas);
	
	s3.setSystemMode(S3SystemMode.OPEN_GL);
	camera.setSystemMode(S3SystemMode.OPEN_GL);
	
	var meshdata = {
		Indexes:{
			body:[
				[ 0, 1, 2],
				[ 3, 1, 0],
				[ 3, 0, 2],
				[ 3, 2, 1]
			]
		},
		Vertices:[
			[  0,  0,  -5],
			[  0, 20,  -5],
			[ 10,  0,  -5],
			[  0,  0, -20]
		]
	};
	var mesh = S3Mesh.fromJSON(meshdata);
	
	var model = new S3Model();
	model.mesh		= mesh;

	camera.setEye(new S3Vector( 20,  30,  50));
	camera.setCenter(new S3Vector( 0,  0,  0));
	controller.setCamera(camera);
	
	var scene = new S3Scene();
	scene.setCamera(camera);
	scene.addModel(model);

	var redraw = function() {
		scene.setCamera(controller.getCamera());
		
		s3.clear();
		
		model.angles.addRotateY(5);
		s3.drawAxis(scene);
		s3.drawScene(scene);
	};

	setInterval(redraw, 50);

}



﻿function main(args) {
	
	System.out.println("S3D クラスのサンプル");
	
	// 縦スクロール防止
	IDTools.noScroll();
	
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
	
	test3D(panel.getCanvas());
	
	
	
}

