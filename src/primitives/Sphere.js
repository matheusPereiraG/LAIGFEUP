/**
 * Instance: Sphere
 * 
 * @param {CGFScene} scene
 * @param {Array} args 
 */
 function Sphere(scene, args) {
 	CGFobject.call(this,scene);

 	this.radius = args[0];
	this.stacks = args[1];
	this.slices = args[2];

 	this.initBuffers();
 };

 Sphere.prototype = Object.create(CGFobject.prototype);
 Sphere.prototype.constructor = Sphere;

 Sphere.prototype.initBuffers = function() {

	var stepAng = 2*Math.PI / this.slices; 
	this.vertices = new Array();
	this.indices = new Array();
	this.normals = new Array();
	this.texCoords = new Array();
	var radius = Math.PI / this.stacks; 
	var currtRadius;

 	for (var i = 0; i <this.stacks; i++){
		currtRadius = i * radius;
		for (var j = 0; j < this.slices; j++){
			this.vertices.push(this.radius * Math.sin(currtRadius) * Math.cos(j*stepAng), this.radius * Math.sin(currtRadius) * Math.sin(j*stepAng), this.radius * Math.cos(currtRadius));
			this.normals.push(this.radius * Math.sin(currtRadius) * Math.cos(j*stepAng), this.radius * Math.sin(currtRadius) * Math.sin(j*stepAng), this.radius * Math.cos(currtRadius));

			this.vertices.push(this.radius * Math.sin(currtRadius + radius) * Math.cos(j*stepAng), this.radius * Math.sin(currtRadius + radius) * Math.sin(j*stepAng), this.radius * Math.cos(radius * (i+1)));
			this.normals.push(this.radius * Math.sin(currtRadius + radius) * Math.cos(j*stepAng), this.radius * Math.sin(currtRadius + radius) * Math.sin(j*stepAng), this.radius * Math.cos(radius * (i+1))); //Normals in line with the vertexes

			this.texCoords.push(((i + 1)/this.stacks) * (Math.cos(j*stepAng)/2 + 0.5), (i + 1)/this.stacks) * (1- (Math.sin(j*stepAng)/2 + 0.5));
			this.texCoords.push(((i + 1)/this.stacks) * (Math.cos(j*stepAng)/2 + 0.5), (i + 2)/this.stacks) * (1- (Math.sin(j*stepAng)/2 + 0.5));


      		this.indices.push((i*2*this.slices)+(2*j)+0);
			this.indices.push((i*2*this.slices)+(2*j)+1);
      		this.indices.push((i*2*this.slices)+(((2*j)+3)% (this.slices * 2)));

      		this.indices.push((i*2*this.slices)+(((2*j)+2) % (this.slices * 2)));	
			this.indices.push((i*2*this.slices)+(((2*j)+0) % (this.slices * 2))); //This doesn't need integer division
      		this.indices.push((i*2*this.slices)+(((2*j)+3) % (this.slices * 2)));

		}
 	}


 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
Sphere.prototype.updateTextureScaling = function(ampS, ampT){}