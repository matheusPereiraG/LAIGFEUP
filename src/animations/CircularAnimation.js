/**
 * Circular Animation
 * @constructor
 */
function CircularAnimation(scene, id, span, center, radius, startAng, rotAng) {
    this.scene = scene;
    this.id = id;
    this.span = span;
    this.center = center;
    this.radius = radius;
    this.startAng = startAng;
    this.rotAng = rotAng;

    this.elapsedTime = 0;
    this.done = false;

    this.vel = this.rotAng / this.span;

}

CircularAnimation.prototype = new Animation(this.id, this.span, 'circular');

CircularAnimation.prototype.apply = function (currTime, node) {

    if (this.elapsedTime == 0)
        this.elapsedTime = currTime;

    let secondsPassed = currTime - this.elapsedTime;
    if (secondsPassed > this.span) {
        secondsPassed = this.span;
        this.done = true;
    }

    if (node.animationIndex < node.animations.length) {
        node.animationIndex++;
    }

    this.scene.translate(this.center[0], this.center[1], this.center[2]);

    let ang = this.startAng + this.rotAng / this.span * secondsPassed;

    //console.log(ang);

    this.scene.rotate(ang, 0, 1, 0);

    this.scene.translate(this.radius, 0, 0);


}
CircularAnimation.prototype.update = function () {
}
