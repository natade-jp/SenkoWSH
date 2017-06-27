/* global System, SComponent */


var CameraController = function() {
	this.mouse		= new PCMouse();
	this.data		= new PCMouse();
	this.moveDistance	= 4.0;
	this.moveRotate		= 0.1;
	this.moveTranslateRelative	= 0.1;
};
CameraController.prototype.setElement = function(element) {
	this.mouse.setListenerOnElement(element);
};
CameraController.prototype.setCamera = function(camera) {
	this.camera = camera.clone();
};
CameraController.prototype.getCamera = function() {
	this.mouse.pickInput(this.data);
	{
		this.camera.translateRelative(
			new S3Vector(
				- this.data.left.dragged.x * this.moveTranslateRelative,
				this.data.left.dragged.y * this.moveTranslateRelative,
				0
			)
		);
	}
	{
		this.camera.addRotateY( this.data.right.dragged.x * this.moveRotate );
//		this.camera.addRotateX( this.data.right.dragged.y * this.moveRotate );
		System.out.println(this.camera);
	}
	{
		var distance = this.camera.getDistance();
		var l = this.data.wheelrotation;
		distance -= l * this.moveDistance * Math.log(distance);
		this.camera.setDistance(distance);
	}
	return this.camera;
};

var s3 = new S3System();
var controller = new CameraController();


﻿function test3D() {
	var v0 = new S3Vertex( new S3Vector(-10,  0, -20));
	var v1 = new S3Vertex( new S3Vector(-10, 20, -20));
	var v2 = new S3Vertex( new S3Vector( 10,  0, -20));
	var v3 = new S3Vertex( new S3Vector(  0,  5, -40));
	
	var i1 = new S3TriangleIndex(0, 1, 2);
	var i2 = new S3TriangleIndex(0, 1, 3);
	var i3 = new S3TriangleIndex(0, 3, 2);
	var i4 = new S3TriangleIndex(3, 1, 2);
	
	var mesh = new S3Mesh();
	mesh.addVertex(v0);
	mesh.addVertex(v1);
	mesh.addVertex(v2);
	mesh.addVertex(v3);
	mesh.addTriangleIndex(i1);
	mesh.addTriangleIndex(i2);
	mesh.addTriangleIndex(i3);
	mesh.addTriangleIndex(i4);

	var model = new S3Model();
	model.mesh		= mesh;

	var camera = new S3Camera();
	camera.setEye(new S3Vector( 0,  0,  50));
	camera.setCenter(new S3Vector( 0,  0,  0));
	controller.setCamera(camera);
	
	var scene = new S3Scene();
	scene.setCamera(camera);
	scene.addModel(model);

	var redraw = function() {
		scene.setCamera(controller.getCamera());
		s3.clear();
		s3.drawScene(scene);
	};


	setInterval(redraw, 50);

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
	controller.setElement(panel.getCanvas());
	
	test3D();
	
	
	
}

