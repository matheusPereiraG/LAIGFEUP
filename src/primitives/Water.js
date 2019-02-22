/**
 * Instance: Water
 *
 * @param {CGFScene} scene
 * @param {Array} args
 */
function Water(scene, graph, args) { //we pass the graph too to get acess to textures
    CGFobject.call(this, scene);
    this.graph = graph;
    this.idTexture = args[0];
    this.idwavemap = args[1]; //another texture
    this.parts = args[2];
    this.heightscale = args[3];
    this.textscale = args[4];

    this.offset= 0;

    this.time = 0;

    this.WaterS = new CGFshader(this.scene.gl, "shaders/Water.vert", "shaders/Water.frag");
    this.plane = new Plane(this.scene,[20,20]); 

    

    this.WaterS.setUniformsValues({normScale: this.heightscale});
    

    //go get the textures
    //this.texture = this.graph.textures[this.idTexture];
    //this.heightTexture = this.graph.textures[this.idwavemap];
};

Water.prototype = Object.create(CGFobject.prototype);
Water.prototype.constructor = Water;

Water.prototype.display = function () {
    if (this.time == 0) this.time = this.scene.elapsedTime;
    let secondsPassed = this.scene.elapsedTime - this.time;

    //let factor = (Math.sin((secondsPassed * 3.0) % 3141 * 0.002)+1.0)*.5;

    this.offset += 1/this.parts * 0.02;

    this.WaterS.setUniformsValues({offset: this.offset });
    this.WaterS.setUniformsValues({textscale: this.textscale});
    
    this.WaterS.setUniformsValues({timeFactor: secondsPassed});
    this.scene.setActiveShader(this.WaterS);
    //this.texture.bind();
    //this.heightTexture.bind(1);
    this.plane.display();
    this.scene.setActiveShader(this.scene.defaultShader);
};

Water.prototype.updateTextureScaling = function (ampS, ampT) { }
