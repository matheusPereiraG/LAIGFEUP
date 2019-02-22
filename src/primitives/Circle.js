/**
 * Instance: Circle
 *
 * @param {CGFScene} scene
 * @param {number} slices
 */
 function Circle(scene, slices) {
 	CGFobject.call(this,scene);

	this.slices = slices;

 	this.initBuffers();
 };

 Circle.prototype = Object.create(CGFobject.prototype);
 Circle.prototype.constructor = Circle;

 Circle.prototype.initBuffers = function() {
	var angulo = 2*Math.PI/this.slices;
	var currRad = this.botRad;
	var radiusInc = (this.topRad - this.botRad)/this.stacks;

 	this.vertices = [];

 	this.indices = [];

 	this.normals = [];

 	this.texCoords = [];


 	for (i = 0; i < this.slices; i++){
 	    this.vertices.push(Math.cos(i*angulo), Math.sin(i*angulo), 0);
 	    this.normals.push(0,0,1);
 	    this.texCoords.push((-Math.cos(i*angulo)+1)/2,(Math.sin(i*angulo)+1)/2);
 	}

 	for (j = 0; j < this.slices-2; j++){
		this.indices.push(0,j+1,j+2);
    this.indices.push(0,j+2,j+1);
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
 Circle.prototype.updateTextureScaling = function(ampS, ampT){

}
