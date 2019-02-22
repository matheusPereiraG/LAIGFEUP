/**
 * Instance: Terrain
 *
 * @param {CGFScene} scene
 * @param {Array} args
 */
function Terrain(scene, graph, args) { //we pass the graph too to get acess to textures
    CGFobject.call(this, scene);
    this.graph = graph;
    this.idTexture = args[0];
    this.idheightmap = args[1]; //another texture
    this.parts = args[2];
    this.heightscale = args[3];

    this.terrainS = new CGFshader(this.scene.gl, "shaders/terrain.vert", "shaders/terrain.frag");
    this.plane = new Plane(this.scene,[this.parts,this.parts]); 

    this.terrainS.setUniformsValues({normScale: this.heightscale});

    //go get the textures
    this.texture = this.graph.textures[this.idTexture];
    this.heightTexture = this.graph.textures[this.idheightmap];
    
};

Terrain.prototype = Object.create(CGFobject.prototype);
Terrain.prototype.constructor = Terrain;

Terrain.prototype.display = function () {
    this.scene.setActiveShader(this.terrainS);
    this.texture.bind();
    this.heightTexture.bind(1);
    this.plane.display();
    this.scene.setActiveShader(this.scene.defaultShader);
};

Terrain.prototype.updateTextureScaling = function (ampS, ampT) { }
