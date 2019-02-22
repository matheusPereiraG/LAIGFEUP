var id = 0;
/**
 * Instance: Plane
 * 
 * @param {CGFScene} scene
 * @param {array} args
 */
function Plane(scene, args) {

    this.scene = scene;
    this.npartsU = args[0];
    this.npartsV = args[1];
    this.id = id++;

    this.initBuffers();
};

Plane.prototype = Object.create(CGFobject.prototype);
Plane.prototype.constructor = Plane;

Plane.prototype.getId = function () {
    return this.id;
}

Plane.prototype.initBuffers = function () {

    controlvertexes = [	// U = 0
        [ // V = 0..1;
            [-1.0, -1.0, 0.0, 1],
            [-1.0, 1.0, 0.0, 1]

        ],
        // U = 1
        [ // V = 0..1
            [1.0, -1.0, 0.0, 1],
            [1.0, 1.0, 0.0, 1]
        ]
    ]

    let nurbsSurface = new CGFnurbsSurface(1, 1, controlvertexes);

    this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface);

}

Plane.prototype.display = function () {
    this.scene.rotate(-90 * DEGREE_TO_RAD, 1, 0, 0);
    this.obj.display();
}

Plane.prototype.updateTextureScaling = function (ampS, ampT) {
}