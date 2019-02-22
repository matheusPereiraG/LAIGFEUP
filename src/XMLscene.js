var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.appearance = new CGFappearance(this); //current material
        this.materials = []; //array with materials in the scene (pressing key "m" will change them)
        this.materialIndex = 0;
        this.previousTexture = null;

        this.setUpdatePeriod(10);

        this.axis = new CGFaxis(this);

        //when piece selected give a shader
        this.shader = new CGFshader(this.gl, "shaders/uScale.vert", "shaders/uScale.frag");
        this.shader.setUniformsValues({ red: 1.0, green: 0.0, blue: 0.0 });

        //materials for cells
        this.whiteMaterial = new CGFappearance(this);
        this.whiteMaterial.setAmbient(0, 0, 0, 1);
        this.whiteMaterial.setDiffuse(0.82, 0.82, 0.82, 1);
        this.whiteMaterial.setSpecular(0, 0, 0, 1);
        this.whiteMaterial.setShininess(20);

        this.blackMaterial = new CGFappearance(this);
        this.blackMaterial.setAmbient(0, 0, 0, 1);
        this.blackMaterial.setDiffuse(0.1, 0.1, 0.1, 1);
        this.blackMaterial.setSpecular(0, 0, 0, 1);
        this.blackMaterial.setShininess(20);

        this.player1Char = null;

        //game cycle called here
        this.startGame = function () {
            if (this.player1Char == null) {
                alert('Please insert player 1 char first...');
                return;
            }
            this.game = new GameCycle(this);
            this.gameStarted = true;

        }
        this.gameStarted = false;

        //for picking objects
        this.setPickEnabled(true);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.omniLights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            //init omni lights
            if (this.graph.omniLights.hasOwnProperty(key)) {
                var light = this.graph.omniLights[key];

                //lights are predefined in cgfscene
                this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
                this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
        for (var key in this.graph.spotLights) {
            //init spot lights
            if (this.graph.spotLights.hasOwnProperty(key)) {
                var light = this.graph.spotLights[key];



                //lights are predefined in cgfscene
                this.lights[i].setPosition(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setAmbient(light[5][0], light[5][1], light[5][2], light[5][3]);
                this.lights[i].setDiffuse(light[6][0], light[6][1], light[6][2], light[6][3]);
                this.lights[i].setSpecular(light[7][0], light[7][1], light[7][2], light[7][3]);
                this.lights[i].setSpotDirection((light[4][0] - light[3][0]), (light[4][1] - light[3][1]), (light[4][2] - light[3][3]));
                this.lights[i].setSpotExponent(light[2]);
                this.lights[i].setSpotCutOff(light[1] * this.DEGREE_TO_RAD);

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    /* Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        //DONE: Change reference length according to parsed graph
        this.axis = new CGFaxis(this, this.graph.axisLength);

        this.gl.clearColor(this.graph.ambientB[0], this.graph.ambientB[1], this.graph.ambientB[2], this.graph.ambientB[3]);
        this.setGlobalAmbientLight(this.graph.ambientA[0], this.graph.ambientA[1], this.graph.ambientA[2], this.graph.ambientA[3]);

        this.initLights();


        //add lights to interface
        this.interface.addLightsGroup(this.graph.omniLights);
        this.interface.addLightsGroup(this.graph.spotLights);
        //add views to interface
        this.interface.addViewsGroup(this.graph.perspectives);
        this.interface.addViewsGroup(this.graph.ortho);

        this.sceneInited = true;

        //setting default appearance
        this.appearance = new CGFappearance(this);
        this.appearance.setAmbient(0.2, 0.2, 0.2, 1.0);
        this.appearance.setDiffuse(0.5, 0.5, 0.5, 1.0);
        this.appearance.setSpecular(0.5, 0.5, 0.5, 1.0);
        this.appearance.setShininess(10.0);
        this.appearance.setEmission(0.0, 0.0, 0.0, 1.0);

        this.appearance.apply();

        this.interface.addGameConfigGroup();

    }

    /**
     * Displays the scene.
     */
    display() {
        //picking objects
        this.clearPickRegistration();
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        //this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
        //this.gl.enable(this.gl.DEPTH_TEST);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        //this.setActiveShader(this.shaders[this.activeShader]);

        this.pushMatrix();

        if (this.sceneInited) {
            // Draw axis
            //this.axis.display();

            var i = 0;
            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            //RENDERS THE MAD BISHOPS GAME
            if (this.gameStarted) this.game.display();

            // Displays the xml scene (MySceneGraph function).
            this.graph.displayScene(this.graph.idRoot); //inits with root id
        }
        else {
            // Draw axis
            this.axis.display();
        }

        //this.setActiveShader(this.defaultShader);
        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    update(currTime) {

       // console.log(currTime);
        this.elapsedTime = currTime / 1000;

        if (this.graph.loadedOk) {
            for (let animationID in this.graph.animations) {
                this.graph.animations[animationID].update(currTime);
            }
        }

        this.currTime = currTime;

    }
}