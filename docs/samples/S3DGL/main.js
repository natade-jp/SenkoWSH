/* global System, SComponent, S3SystemMode, IDTools, S3Mesh, File, S3FrontFace */

﻿function test3D(canvas) {
	
	var s3 = new S3SystemGL();
	var controller = new CameraController();
	var camera = new S3Camera();

	s3.setCanvas(canvas);
	controller.setCanvas(canvas);
	
	s3.setShaderURL("../../library/SenkoLib/S3DGL.fs");
	s3.setShaderURL("../../library/SenkoLib/S3DGL.vs");
	
	s3.setSystemMode(S3SystemMode.OPEN_GL);
	s3.setFrontMode(S3FrontFace.CLOCKWISE);
	
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
	model.setMesh(mesh);

	camera.setEye(new S3Vector( 20,  30,  50));
	camera.setCenter(new S3Vector( 0,  0,  0));
	controller.setCamera(camera);
	
	var scene = new S3Scene();
	scene.setCamera(camera);
	scene.addModel(model);

	var redraw = function() {
		scene.setCamera(controller.getCamera());
		
		s3.clear();
		
		model.addRotateY(5);
		s3.drawScene(scene);
	};
	
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
	
	// ファイルロード
	var test = new File("./index.html");
	File.downloadFileList([test], function() {
		test3D(panel.getCanvas());
	});
	
	
}

