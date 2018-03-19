/* global System, SComponent, S3System.SYSTEM_MODE, IDTools, S3Mesh, File, S3System.FRONT_FACE, S3LightMode */

﻿function test3D(canvas) {
	
	var s3 = new S3GLSystem();
	var controller = new CameraController();
	var camera = s3.createCamera();

	s3.setCanvas(canvas);
	controller.setCanvas(canvas);
	
	var program = s3.createProgram();
	program.setFragmentShader("../../library/SenkoLib/S3DGL.fs");
	program.setVertexShader("../../library/SenkoLib/S3DGL.vs");
	
	s3.setProgram(program);
	s3.setSystemMode(S3System.SYSTEM_MODE.OPEN_GL);
	s3.setFrontMode(S3System.FRONT_FACE.CLOCKWISE);
	
	var model = s3.createModel();
	var mesh = s3.createMesh();
	mesh.inputData("../resource/teapod.mqo", S3Mesh.DATA_MQO);
	model.setMesh(mesh);
	model.setScale(5);

	camera.setEye(new S3Vector( 20,  30,  50));
	camera.setCenter(new S3Vector( 0,  0,  0));
	controller.setCamera(camera);
	
	var scene = s3.createScene();
	scene.setCamera(camera);
	scene.addModel(model);
	
	var light_down = s3.createLight();
	light_down.setMode(S3LightMode.DIRECTIONAL_LIGHT);
	light_down.setColor(new S3Vector( 0.6,  0.6,  1.0));
	light_down.setDirection(new S3Vector( 0,  -1,  0));
	scene.addLight(light_down);
	
	var light_ambient = s3.createLight();
	light_ambient.setMode(S3LightMode.AMBIENT_LIGHT);
	light_ambient.setColor(new S3Vector( 0.0,  0.1,  0.05));
	scene.addLight(light_ambient);
	
//	var light_up = s3.createLight();
//	light_up.setMode(S3LightMode.DIRECTIONAL_LIGHT);
//	light_up.setColor(new S3Vector( 0.0,  0.05,  0.0));
//	light_up.setDirection(new S3Vector( 0,  1,  0));
//	scene.addLight(light_up);
	
	var light_point = s3.createLight();
	light_point.setMode(S3LightMode.POINT_LIGHT);
	light_point.setColor(new S3Vector( 0.9,  0.9,  1.0));
	light_point.setPosition(new S3Vector( 100,  0,  0));
	light_point.setRange(200);
	scene.addLight(light_point);
	
	var redraw = function() {
		scene.setCamera(controller.getCamera());
		
		s3.clear();
		
		model.addRotateY(3);
		s3.drawScene(scene);
	};
	
	console.log(model);
	
	//setTimeout(redraw, 50);
	setInterval(redraw, 50);

}



﻿function main(args) {
	
	System.out.println("S3DGL クラスのサンプル");
	
	// 縦スクロール防止
	IDTools.noScroll();
	
	var panel;
	// パネルを作って、指定した ID の要素内に入れる。
	panel = new SCanvas();
	panel.putMe("scomponent", SComponent.putype.IN);
	panel.setUnit(SComponent.unittype.PX);
	panel.setPixelSize(640, 480);
	panel.setSize(640, 480);
	
	test3D(panel.getCanvas());
	
}

