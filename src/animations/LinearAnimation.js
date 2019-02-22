/**
 * Linear Animation
 * @constructor
 */
function LinearAnimation(scene, id, span, controlP) {
    this.scene = scene;
    this.id = id;
    this.span = span;
    this.controlP = controlP
    this.elapsedTime = 0;
    this.done = false; //to tell if we finished the animation
    this.distance = 0; //distance between two control points
    this.distanceControl = []; //distance between all control points 
    this.currDist = 0; //helps the apply method knowing how much distance it travelled

    for (var i = 0; i < controlP.length - 1; i++) {
        this.distance += vec3.dist(vec3.fromValues(controlP[i][0], controlP[i][1], controlP[i][2]), vec3.fromValues(controlP[i + 1][0], controlP[i + 1][1], controlP[i + 1][2]));
        this.distanceControl.push(this.distance);
    }

    this.vel = this.distance / span;
}

LinearAnimation.prototype = new Animation(this.id, this.span, 'linear');

LinearAnimation.prototype.apply = function (currTime, node) {
    if (this.elapsedTime == 0) this.elapsedTime = currTime;
    let secondsPassed = currTime - this.elapsedTime;
    if (secondsPassed > this.span) {
        secondsPassed = this.span;
        this.done = true;
    }

    if (node != null) {
        if (node.animationIndex < node.animations.length) {
            node.animationIndex++;
        }
    }


    this.currDist = this.vel * secondsPassed;
    //------------------------------------NEEDS CHANGE---------------------------------
    //encontra segmento
    let i = 0;
    while (this.currDist > this.distanceControl[i] && i < this.distanceControl.length)
        i++;
    //encontra pontos de controlo do segmento
    let p1 = this.controlP[i];
    let p2 = this.controlP[i + 1];

    var dist1 = p2[0] - p1[0];
    var dist2 = p2[1] - p1[1];
    var dist3 = p2[2] - p1[2];


    let lastDist;
    if (i == 0)
        lastDist = 0;
    else
        lastDist = this.distanceControl[i - 1];

    var displacement = (this.currDist - lastDist) / (this.distanceControl[i] - lastDist);

    this.scene.translate(dist1 * displacement + p1[0], dist2 * displacement + p1[1], dist3 * displacement * p1[2]);

}
LinearAnimation.prototype.update = function () {
}
