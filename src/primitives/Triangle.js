/**
 * Instance: Triangle
 *
 * @param {CGFScene} scene
 * @param {Array} args
 */
function Triangle(scene, args) {
	CGFobject.call(this, scene);
	this.args = args;
	this.initBuffers();
};

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor = Triangle;

Triangle.prototype.initBuffers = function () {

	var v1x = this.args[0];
	var v1y = this.args[1];
	var v1z = this.args[2];
	var v2x = this.args[3];
	var v2y = this.args[4];
	var v2z = this.args[5];
	var v3x = this.args[6];
	var v3y = this.args[7];
	var v3z = this.args[8];


	this.vertices = [
		v1x, v1y, v1z,
		v2x, v2y, v2z,
		v3x, v3y, v3z,
	];

	this.indices = [
		0, 1, 2,
		2, 1, 0
	];

	this.normals = [
		0, 1, 0,
		0, 1, 0,
		0, 1, 0
	];

	this.a = Math.sqrt(Math.pow(v1x - v3x, 2) + Math.pow(v1y - v3y, 2) + Math.pow(v1z - v3z, 2));
	this.b = Math.sqrt(Math.pow(v2x - v1x, 2) + Math.pow(v2y - v1y, 2) + Math.pow(v2z - v1z, 2));
	this.c = Math.sqrt(Math.pow(v3x - v2x, 2) + Math.pow(v3y - v2y, 2) + Math.pow(v3z - v2z, 2));

	this.cosAlpha = Math.cos((- Math.pow(this.a, 2) + Math.pow(this.b, 2) + Math.pow(this.c, 2)) / (2 * this.b * this.c));
	this.cosBeta = Math.cos((Math.pow(this.a, 2) - Math.pow(this.b, 2) + Math.pow(this.c, 2)) / (2 * this.a * this.c));
	this.cosTeta = Math.cos((Math.pow(this.a, 2) + Math.pow(this.b, 2) - Math.pow(this.c, 2)) / (2 * this.b * this.a));
	this.sinBeta = Math.sqrt(1 - Math.pow(this.cosBeta, 2));

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

Triangle.prototype.updateTextureScaling = function (ampS, ampT) {
	this.texCoords = [
		0, 1,
		this.c / ampS, 1,
		(this.c - (this.a * this.cosBeta)) / ampS, (1 - this.a * this.sinBeta) / (ampT)
	];
	this.updateTexCoordsGLBuffers();
}
