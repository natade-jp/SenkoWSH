/* global System, SComponent, S3System.SYSTEM_MODE, IDTools, S3Mesh, File, S3System.FRONT_FACE, S3LightMode, S3System */


var S3DGLTest = function() {
	this.s3			= new S3GLSystem();
	this.controller	= new CameraController();
	this.camera		= null;
	this.mesh		= null;
	this.model		= null;
};
S3DGLTest.prototype.initCanvas = function(canvas) {
	var s3 = this.s3;
	s3.setBackgroundColor(new S3Vector(0, 0, 0));
	s3.setCanvas(canvas);
	this.controller.setCanvas(canvas);
	this.camera	= s3.createCamera();
	var program = s3.createProgram();
	program.setFragmentShader("../../library/SenkoWSH/S3DGL.fs");
	program.setVertexShader("../../library/SenkoWSH/S3DGL.vs");
	s3.setProgram(program);
	s3.setSystemMode(S3System.SYSTEM_MODE.OPEN_GL);
	s3.setFrontMode(S3System.FRONT_FACE.CLOCKWISE);
	this.camera.setEye(new S3Vector( 20,  30,  50));
	this.camera.setCenter(new S3Vector( 0,  0,  0));
	this.controller.setCamera(this.camera);
};
S3DGLTest.prototype.clearModel = function() {
	if(this.model) {
		this.model = null;
	}
	if(this.mesh) {
		this.mesh.disposeGLData();
		this.mesh = null;
	}
};
S3DGLTest.prototype.setModel = function(url) {
	var s3 = this.s3;
	var newmodel = s3.createModel();
	var newmesh = s3.createMesh();
	newmesh.inputData(url, S3Mesh.DATA_MQO);
	newmodel.setMesh(newmesh);
	this.clearModel();
	this.model = newmodel;
	this.mesh = newmesh;
};
S3DGLTest.prototype.draw = function() {
	var s3 = this.s3;
	
	var scene = s3.createScene();
	scene.setCamera(this.controller.getCamera());
	if(this.model !== null) {
		scene.addModel(this.model);
		this.model.setScale(5);
		this.model.addRotateY(3);
	}
	
	var light_down = s3.createLight();
	light_down.setMode(S3LightMode.DIRECTIONAL_LIGHT);
	light_down.setColor(new S3Vector( 0.6,  0.6,  1.0));
	light_down.setDirection(new S3Vector( 0,  -1,  0));
	scene.addLight(light_down);

	var light_ambient = s3.createLight();
	light_ambient.setMode(S3LightMode.AMBIENT_LIGHT);
	light_ambient.setColor(new S3Vector( 0.0,  0.1,  0.05));
	scene.addLight(light_ambient);

	var light_point = s3.createLight();
	light_point.setMode(S3LightMode.POINT_LIGHT);
	light_point.setColor(new S3Vector( 0.9,  0.9,  1.0));
	light_point.setPosition(new S3Vector( 100,  0,  0));
	light_point.setRange(200);
	scene.addLight(light_point);

	s3.clear();
	s3.drawScene(scene);
};

var gl = new S3DGLTest();

function createWebGLPanel2() {
	
	var panel = new SCanvas();
	panel.putMe("webglpanel", SComponent.putype.IN);
	panel.setUnit(SComponent.unittype.PX);
	panel.setPixelSize(1280, 720);
	
	var canvas = panel.getCanvas();
	
	gl.initCanvas(canvas);
	gl.setModel("../resource/teapod.mqo");
	
	var redraw = function() {
		gl.draw();
	};

	//setTimeout(redraw, 50);
	setInterval(redraw, 50);
};

function createOperationPanel() {
	
	var filepanel = new SPanel("ファイル");
	filepanel.putMe("operationpanel", SComponent.putype.IN);
	
	var filebox = new SComboBox(["../resource/teapod.mqo", "../resource/bumptest.mqo"]);
	filebox.putMe(filepanel, SComponent.putype.IN);
	
	var loadbutton = new SButton("load");
	loadbutton.putMe(filebox, SComponent.putype.NEWLINE);
	loadbutton.addListener(function () {
		var filename = filebox.getSelectedItem();
		System.out.println(filename);
		gl.setModel(filename);
	});
}

﻿function main(args) {
	
	System.out.println("S3DGL クラスのサンプル");
	
	// 縦スクロール防止
	IDTools.noScroll();
	
	createWebGLPanel2();
	createOperationPanel();
}

