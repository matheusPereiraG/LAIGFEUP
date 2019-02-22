var animId = 0;

function Bishop(scene, x, z, pieceChar) {
    this.scene = scene;
    this.x = x;
    this.z = z;
    this.pieceChar = pieceChar;
    this.obj = new CGFOBJModel(this.scene, 'MadBishops/bishop.obj');
    //in movement type defines what kind of movement the piece must do in order to move
    this.type = null;
    this.animation = null;
}

Bishop.prototype.constructor = Bishop;

Bishop.prototype.display = function () {
    this.scene.pushMatrix();
    this.scene.translate(this.x, 0, this.z);
    if (this.animation != null) {
        if (this.animation.finished) {
            //update new coords of the piece
            this.x = this.animation.getXf();
            this.z = this.animation.getYf();
            this.animation = null;
            return;
        }
        else {
            this.scene.multMatrix(this.animation.getAnimationMatrix(this.scene.currTime));
        }
    }

    this.scene.scale(0.1, 0.1, 0.1);
    this.obj.display();
    this.scene.popMatrix();
}

Bishop.prototype.getZ = function () {
    return this.x / 2 + 1;
}
Bishop.prototype.getX = function () {
    return this.z / 2 + 1;
}
Bishop.prototype.setX = function (x) {
    this.x = x;
}
Bishop.prototype.setZ = function (z) {
    this.z = z;
}
Bishop.prototype.getPieceChar = function () {
    return this.pieceChar;
}
Bishop.prototype.getType = function () {
    return this.type;
}
Bishop.prototype.setType = function (type) {
    this.type = type;
}
Bishop.prototype.createAnimation = function (targetCell) {
    let yf = (targetCell[0] - 1) * 2;
    let xf = (targetCell[1] - 1) * 2;

    this.animation = new PieceAnimation(3, this.x, this.z, xf, yf);
}