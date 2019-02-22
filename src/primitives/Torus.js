/**
 * Torus
 * @constructor
 */
function Torus(scene, args) {
    CGFobject.call(this, scene);

    this.r = args[0];
    this.R = args[1];
    this.slices = args[2];
    this.stacks = args[3];

    this.initBuffers();
}

Torus.prototype = Object.create(CGFobject.prototype);
Torus.prototype.constructor = Torus;

Torus.prototype.initBuffers = function() {

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    for (var stack = 0; stack <= this.stacks; stack++) {
        var alpha = stack * 2 * Math.PI / this.stacks;
        var sinA = Math.sin(alpha);
        var cosA = Math.cos(alpha);

        for (var slice = 0; slice <= this.slices; slice++) {
            var beta = slice * 2 * Math.PI / this.slices;
            var sinB = Math.sin(beta);
            var cosB = Math.cos(beta);

            var x = (this.R + (this.r * cosA)) * cosB;
            var y = (this.R + (this.r * cosA)) * sinB;
            var z = this.r * sinA;
            var s = 1 - (stack / this.stacks);
            var t = 1 - (slice / this.slices);

            this.vertices.push(x, y, z);
            this.normals.push(x, y, z);
            this.texCoords.push(s, t);
        }
    }

    for (var stack = 0; stack < this.stacks; stack++) {
        for (var slice = 0; slice < this.slices; slice++) {
            var vert1 = (stack * (this.slices + 1)) + slice;
            var vert2 = vert1 + this.slices + 1;

            this.indices.push(vert2, vert1, vert1 + 1);
            this.indices.push(vert2, vert1 + 1, vert2 + 1);
        }
    }


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
Torus.prototype.updateTextureScaling = function(ampS, ampT){}