/**
 * Instance: Rectangle
 * 
 * @param {CGFScene} scene
 * @param {Array} args
 */
function Rectangle(scene, args) { 
	CGFobject.call(this,scene);		  
	this.args = args;

	this.x1 = args[0];
	this.y1 = args[1];
	this.x2 = args[2];
	this.y2 = args[3];

    this.minS = 0.0;
    this.maxS = 1.0;
    this.minT = 0.0;
	this.maxT = 1.0;
	
	this.initBuffers();
};

Rectangle.prototype = Object.create(CGFobject.prototype);
Rectangle.prototype.constructor=Rectangle;


Rectangle.prototype.initBuffers = function () {

	this.dx = this.x2 - this.x1;
	this.dy = this.y1 - this.y2;
	

	this.vertices = [
            this.x1, this.y1, 0, 
            this.x2, this.y1, 0,  
            this.x1, this.y2, 0,  
            this.x2, this.y2, 0  
	];

	this.indices = [
			0,1,2,
			3,2,1,
			1,2,3,
			2,1,0
    ];

    this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
	];

    this.texCoords = [
		this.minS, this.maxT, 
        this.maxS, this.maxT,  
        this.minS, this.minT,  
        this.maxS, this.minT
	];

	
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

Rectangle.prototype.updateTextureScaling = function(ampS, ampT){
		this.texCoords = [
			this.minS, this.dy/ampT,
			this.dx / ampS, this.dy/ampT,
			this.minS, this.minT,
			this.dx / ampS, this.minT
	];
	this.updateTexCoordsGLBuffers();
};