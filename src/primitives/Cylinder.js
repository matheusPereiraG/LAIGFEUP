/**
 * Instance: Cylinder
 *
 * @param {CGFScene} scene
 * @param {Array} args
 */
function Cylinder(scene, args) {
	CGFobject.call(this, scene);

	this.height = args[0];
	this.botRad = args[1];
	this.topRad = args[2];
	this.stacks = args[3];
	this.slices = args[4];

	this.heightInc = this.height / this.stacks;

	this.cylinder = new CylinderNoTops(this.scene, this.height, this.botRad, this.topRad, this.stacks, this.slices);
	this.top = new Circle(this.scene, this.slices);
	this.bot = new Circle(this.scene, this.slices);

};

Cylinder.prototype = Object.create(CGFobject.prototype);
Cylinder.prototype.constructor = Cylinder;

Cylinder.prototype.display = function () {

	this.scene.pushMatrix();
	this.cylinder.display();
	this.scene.popMatrix();

	/*
	this.scene.pushMatrix();
	this.scene.translate(0, 0, this.height - 0.02);
	this.scene.scale(this.topRad, this.topRad, 1);
	this.top.display();
	this.scene.popMatrix();*/

	
	this.scene.pushMatrix();
	this.scene.rotate(Math.PI, 0, 1, 0);
	this.scene.scale(this.botRad, this.botRad, 1);
	this.bot.display();
	this.scene.popMatrix();

};

Cylinder.prototype.updateTextureScaling = function (ampS, ampT) { }
