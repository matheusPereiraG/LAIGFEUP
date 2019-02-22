function MySemisphere(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;

 	this.initBuffers();
 };

 MySemisphere.prototype = Object.create(CGFobject.prototype);
 MySemisphere.prototype.constructor = MySemisphere;

 MySemisphere.prototype.initBuffers = function() {

 	this.vertices = [];
 	this.normals = [];
 	this.indices = [];
 	this.texCoords = [];

 	var alpha = 2*Math.PI/this.slices;
 	var alphaHor = Math.PI/2/this.stacks;

	for(i = 0; i <= this.stacks; i++) {
		for(j = 0; j < this.slices; j++) {
			var x = Math.cos(alpha*j) * Math.cos(alphaHor*i);
			var y = Math.sin(alpha*j) * Math.cos(alphaHor*i);
			this.vertices.push(x ,y, Math.sin(alphaHor*i));
			this.normals.push(Math.cos(alpha*j) * Math.cos(alphaHor*i),Math.sin(alpha*j) * Math.cos(alphaHor*i),0);
			this.texCoords.push(x * 0.5 + 0.5, y * 0.5 + 0.5);
		}
	}	
	for(i = 0; i < this.stacks; i++) {
		for(j = 0; j < this.slices - 1; j++) {
			this.indices.push(i*this.slices + j, i*this.slices + j+1, (i+1)*this.slices + j);
			this.indices.push(i*this.slices + j+1, (i+1)*this.slices + j+1, (i+1)*this.slices + j);
		}
		this.indices.push(i*this.slices + this.slices - 1, i*this.slices, (i+1)*this.slices + this.slices - 1);
		this.indices.push(i*this.slices, i*this.slices + this.slices, (i+1)*this.slices + this.slices - 1);
	}
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };