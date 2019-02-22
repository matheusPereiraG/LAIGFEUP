/**
 * Instance: Cylinder2
 *
 * @param {CGFScene} scene
 * @param {Array} args
 */
function Cylinder2(scene, args) {
    CGFobject.call(this, scene);

    this.height = args[0]; //size in the direction of the positive z axis
    this.botRad = args[1]; //radius of the base
    this.topRad = args[2]; //radius of the top
    this.stacks = args[3]; //Number of divisions along the z direction
    this.slices = args[4]; //number of divisions around the circumference

    this.heightInc = this.height / this.stacks;
    this.radiusInc = (this.topRad - this.botRad) / this.stacks;

    this.controlPoints = this.getControlPoints();
    this.controlPoints.reverse(); //was drawing from the inside

    this.npointsU = this.controlPoints.length;
    this.npointsV = this.controlPoints[0].length;

    let PatchArgs = [this.npointsU, this.npointsV, 50, 50, this.controlPoints];

    this.NurbsObj = new Patch(this.scene, PatchArgs);

};

Cylinder2.prototype = Object.create(CGFobject.prototype);
Cylinder2.prototype.constructor = Cylinder2;

Cylinder2.prototype.getControlPoints = function () {
    let CP = [];

    let currAng = this.botRad;
    let ang = 2 * Math.PI / this.slices;

    for (let i = 0; i <= this.stacks; i++) {
        let v = [];
        for (let j = 0; j <= this.slices; j++) {
            let x = currAng * Math.cos(j * ang);
            let y = currAng * Math.sin(j * ang);
            let z = i * this.heightInc;
            v.push([x, y, z, 1]);
        }
        currAng += this.radiusInc;
        CP.push(v);
    }
    return CP;

}


Cylinder2.prototype.display = function () {
    this.NurbsObj.display();
};

Cylinder2.prototype.updateTextureScaling = function (ampS, ampT) { }
