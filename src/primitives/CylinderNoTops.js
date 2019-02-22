function CylinderNoTops(scene, height, botRad, topRad, stacks, slices) {
	CGFobject.call(this, scene);

	this.height = height;
	this.botRad = botRad;
	this.topRad = topRad;
	this.stacks = stacks;
	this.slices = slices;

	this.heightInc = this.height / this.stacks;

	this.initBuffers();
};

CylinderNoTops.prototype = Object.create(CGFobject.prototype);
CylinderNoTops.prototype.constructor = CylinderNoTops;

CylinderNoTops.prototype.initBuffers = function () {

	var angulo = 2 * Math.PI / this.slices;
	var currRad = this.botRad;
	var radiusInc = (this.topRad - this.botRad) / this.stacks;

	this.vertices = [];

	this.indices = [];

	this.normals = [];

	this.texCoords = [];

	for (j = 0; j <= this.stacks; j++) {
		for (i = 0; i <= this.slices; i++) {
			this.vertices.push(currRad * Math.cos(i * angulo), currRad * Math.sin(i * angulo), j * this.heightInc);

			//normais
			this.normals.push(currRad * Math.cos(angulo / 2 + i * angulo), currRad * Math.sin(angulo / 2 + i * angulo), 0);

			this.texCoords.push(i / this.slices, j / this.stacks);
		}
		currRad += radiusInc;
	}


	for (j = 0; j < this.stacks + 1; j++) {
		for (i = 0; i < this.slices; i++) {
			this.indices.push(j * this.slices + i, j * this.slices + ((i + 1) % this.slices), (j + 1) * this.slices + (i + 1) % this.slices);
			this.indices.push(j * this.slices + i, (j + 1) * this.slices + ((i + 1) % this.slices), (j + 1) * this.slices + i);
		}
	}



	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
CylinderNoTops.prototype.updateTextureScaling = function (ampS, ampT) { }