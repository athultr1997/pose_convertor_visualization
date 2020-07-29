import * as THREE from '/node_modules/three/build/three.module.js';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';

function TransformationVisualization(transformation) {	
	this.transformation = transformation
	this.origin = new THREE.Vector3(0, 0, 0);
	
	this.length = 10;
	this.headLength = 2;
	this.headWidth = 2;

	this.gridSize = 100;
	this.gridDivisions = 10;

	this.xDir = new THREE.Vector3(1, 0, 0);
	this.yDir = new THREE.Vector3(0, 1, 0);
	this.zDir = new THREE.Vector3(0, 0, 1);

	this.xColor = 0xff0000;
	this.yColor = 0x00ff00;
	this.zColor = 0x0000ff;	
	this.lineJoiningAxesColor = 0xffff00;

	this.scene = new THREE.Scene();

	this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	this.camera.position.set(0, 0, 100);
	this.camera.lookAt(0, 0, 0);

	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setSize(window.innerWidth/2, window.innerHeight/2);
	document.getElementById("transformationVisualization").appendChild(this.renderer.domElement);

	this.controls = new OrbitControls(this.camera, this.renderer.domElement);
}

TransformationVisualization.prototype.constructScene = function() {
	this.addGrid();
	this.addCoordinateAxes(new THREE.Matrix4());
	this.addCoordinateAxes(this.transformation);
	this.joinCoordinateAxes();
}

TransformationVisualization.prototype.addGrid = function() {
	var grid = new THREE.GridHelper(this.gridSize, this.gridDivisions);
	this.scene.add(grid);
}

TransformationVisualization.prototype.addCoordinateAxes = function(transformation) {	
	var xAxis = new THREE.ArrowHelper(this.xDir, this.origin, this.length, this.xColor, this.headLength, this.headWidth);
	var yAxis = new THREE.ArrowHelper(this.yDir, this.origin, this.length, this.yColor, this.headLength, this.headWidth);
	var zAxis = new THREE.ArrowHelper(this.zDir, this.origin, this.length, this.zColor, this.headLength, this.headWidth);
	
	xAxis.applyMatrix4(transformation)
	yAxis.applyMatrix4(transformation)
	zAxis.applyMatrix4(transformation)

	this.scene.add(xAxis);
	this.scene.add(yAxis);
	this.scene.add(zAxis);
}

TransformationVisualization.prototype.joinCoordinateAxes = function(transformation) {		
	var points = [];
	points.push(new THREE.Vector3(0, 0, 0));

	console.log(this.transformation.elements[12]);
	console.log(this.transformation.elements[13]);
	console.log(this.transformation.elements[14]);

	points.push(new THREE.Vector3(this.transformation.elements[12],
								  this.transformation.elements[13],
								  this.transformation.elements[14]));
	var geometry = new THREE.BufferGeometry().setFromPoints(points);
	var material = new THREE.LineBasicMaterial({color: this.lineJoiningAxesColor});
	var line = new THREE.Line(geometry, material);
	this.scene.add(line);
}

TransformationVisualization.prototype.animate = function() {
	requestAnimationFrame(() => this.animate());
	this.renderer.render(this.scene, this.camera);
}

var T = new THREE.Matrix4();
T.set(1, 0, 1, 1,
	  0, 1, 0, 1, 
	  0, 0, 1, 30,
	  0, 0, 0, 1);
var transformationVisualization = new TransformationVisualization(T);
transformationVisualization.constructScene();
transformationVisualization.animate();