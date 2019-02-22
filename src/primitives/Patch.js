/**
 * Instance: Patch
 * 
 * @param {CGFScene} scene
 * @param {array} args
 */
function Patch(scene, args) {

    this.scene = scene;
    this.npointsU = args[0];
    this.npointsV = args[1];
    this.npartsU = args[2];
    this.npartsV = args[3];
    this.controlPoints = args[4];

    this.degreeU = this.npointsU - 1;
    this.degreeV = this.npointsV - 1;

    let nurbsSurface = new CGFnurbsSurface(this.degreeU, this.degreeV, this.controlPoints);
    let nurbsSurface1 = new CGFnurbsSurface(this.degreeU, this.degreeV, this.controlPoints.reverse()); //draw other side too

    this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface);
    this.obj1 = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface1);
};

Patch.prototype = Object.create(CGFobject.prototype);
Patch.prototype.constructor = Patch;

Patch.prototype.display = function () {
    this.obj.display();
    this.obj1.display();
}

Patch.prototype.updateTextureScaling = function (ampS, ampT) {
}