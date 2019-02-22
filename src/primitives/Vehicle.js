/**
 * Instance: Vehicle
 *
 * @param {CGFScene} scene
 * @param {Array} args
 */
function Vehicle(scene) {
    CGFobject.call(this, scene);
    //height,botrad,toprad,stacks,slices
    this.vehicleBody = new Cylinder2(this.scene, [1, 0.5, 0.5, 100, 20]);
    this.vehicleHead = new Cylinder2(this.scene, [0.5, 0.5, 0, 100, 20]);
    this.vehicleHelice = this.createHelice();
    this.parachute = this.createParachute();
    this.parachuteCylinder = new Cylinder2(this.scene,[5,0.1,0.1,100,20]);

    //this.vehicleTexture = new CGFtexture(this.scene,'scenes/images/greencamo.jpg');
};

Vehicle.prototype = Object.create(CGFobject.prototype);
Vehicle.prototype.constructor = Vehicle;

Vehicle.prototype.createParachute = function () {

    controlPoints =
        [	// U = 0
            [ // V = 0..3;
                [-1.5, -1.5, 0.0, 1],
                [-2.0, -2.0, 2.0, 1],
                [-2.0, 2.0, 2.0, 1],
                [-1.5, 1.5, 0.0, 1]

            ],
            // U = 1
            [ // V = 0..3
                [0, 0, 3.0, 1],
                [0, -2.0, 3.0, 5],
                [0, 2.0, 3.0, 5],
                [0, 0, 3.0, 1]
            ],
            // U = 2
            [ // V = 0..3
                [1.5, -1.5, 0.0, 1],
                [2.0, -2.0, 2.0, 1],
                [2.0, 2.0, 2.0, 1],
                [1.5, 1.5, 0.0, 1]
            ]
        ]

    let npointsU = controlPoints.length;
    let npointsV = controlPoints[0].length;
    let args = [npointsU, npointsV, 20, 20, controlPoints];

    return new Patch(this.scene, args);
}


Vehicle.prototype.createHelice = function () {
    controlPoints = [
        //U = 0
        [
            [0.0, 0.0, 0.0, 1],
            [0.0, 0.0, 0.0, 1]
        ],
        [
            [-0.3, 0.3, 0.0, 1],
            [0.3, 0.3, 0.0, 1]
        ],
        [
            [-0.2, 0.4, 0.0, 1],
            [0.2, 0.4, 0.0, 1]
        ],
        [
            [-0.1, 0.5, 0.0, 1],
            [0.1, 0.5, 0.0, 1]
        ]
    ]

    let npointsU = controlPoints.length;
    let npointsV = controlPoints[0].length;
    let args = [npointsU, npointsV, 20, 20, controlPoints];

    return new Patch(this.scene, args);

};

Vehicle.prototype.display = function () {
    this.vehicleBody.display();

    this.scene.pushMatrix();
    this.scene.translate(0, 0, 1);
    this.vehicleHead.display();
    this.scene.popMatrix();

    //top helice
    this.scene.pushMatrix();
    this.scene.translate(0, 0, 1.5);
    this.scene.rotate(Math.PI, 0, 1, 0);
    //this.vehicleTexture.bind();
    this.vehicleHelice.display();
    this.scene.popMatrix();

    //bottom helice
    this.scene.pushMatrix();
    this.scene.translate(0, 0, 1.5);
    this.scene.rotate(Math.PI, 1, 0, 0);
    //this.vehicleTexture.bind();
    this.vehicleHelice.display();
    this.scene.popMatrix();

    //left helice
    this.scene.pushMatrix();
    this.scene.translate(0, 0, 1.5);
    this.scene.rotate(Math.PI / 2, 0, 0, 1);
    this.scene.rotate(Math.PI, 0, 1, 0);
    //this.vehicleTexture.bind();
    this.vehicleHelice.display();
    this.scene.popMatrix();

    //right helice
    this.scene.pushMatrix();
    this.scene.translate(0, 0, 1.5);
    this.scene.rotate(-Math.PI / 2, 0, 0, 1);
    this.scene.rotate(Math.PI, 0, 1, 0);
    //this.vehicleTexture.bind();
    this.vehicleHelice.display();
    this.scene.popMatrix();

    //parachute with cylinders
    this.scene.pushMatrix();
    this.scene.rotate(-1/2*Math.PI, 1, 0, 0);
    this.scene.scale(0.7,0.7,0.7);
    this.scene.translate(0,-1,0);
    //this.vehicleTexture.bind(0);
    this.parachute.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI/2,1,0,0);
    this.scene.scale(0.5,0.5,0.3);
    this.scene.translate(0,2,-5.5);
    //this.vehicleTexture.bind(0);
    this.parachuteCylinder.display();
    this.scene.popMatrix();


};

Vehicle.prototype.updateTextureScaling = function (ampS, ampT) { }
