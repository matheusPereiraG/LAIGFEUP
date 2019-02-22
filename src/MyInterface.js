/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();
        this.group = this.gui.addFolder("Lights");
        this.group1 = this.gui.addFolder("Views");

        // add a group of controls (and open/expand by defult)

        return true;
    }

    /**
     * 
     * @param {array} views
     */
    addViewsGroup(views) {

        this.group1.open();

        for (var key in views) {
            //this.scene.camera = views[key];
            //this.group1.add(key);
        }




    }

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {


        this.group.open();

        // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
        // e.g. this.option1=true; this.option2=false;

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightValues[key] = lights[key][0];
                this.group.add(this.scene.lightValues, key);
            }
        }
    }

    addGameConfigGroup() {

        var group = this.gui.addFolder("Game Configs");
        group.open();

        group.add(this.scene, 'player1Char', {
            "White": 'W',
            "Black": 'B',
        }).name('Player 1 Char');
        /*group.add(this.scene, 'selectedTimeout', 30, 300).name('Time Control');*/

        group.add(this.scene, 'startGame').name('Start Game');
    };

}