﻿/* global System, SComponent, S3SystemMode, IDTools, S3Mesh, File */

﻿function test3D(canvas, mqodata) {
	
	var s3 = new S3System();
	var controller = new CameraController();
	var camera = new S3Camera();

	s3.setCanvas(canvas);
	controller.setCanvas(canvas);
	
	s3.setSystemMode(S3SystemMode.OPEN_GL);
	camera.setSystemMode(S3SystemMode.OPEN_GL);
	
	System.out.println("json形式での読み書きのテスト");
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
	System.out.println(".json");
	System.out.println(mesh.toJSON());

	System.out.println("MQOでの出力テスト");
	System.out.println(".mqo");
	System.out.println(mesh.toMQO());
	
	System.out.println("MQOでの入力テスト");
	mesh = S3Mesh.fromMQO(mqodata);
	
	var model = new S3Model();
	model.setMesh(mesh);
	model.setScale(5);
	
	console.log(model);
	
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
		s3.drawAxis(scene);
		s3.drawScene(scene);
	};

	//setTimeout(redraw, 50);
	setInterval(redraw, 50);

}

﻿function main(args) {
	
	System.out.println("S3D クラスのサンプル");
	
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
	var fModel = new File("./teapod.mqo");
	File.downloadFileList([fModel], function() {
		test3D(panel.getCanvas(), fModel.getText());
	});
	
	
}

