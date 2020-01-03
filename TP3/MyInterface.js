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

        // add a group of controls (and open/expand by defult)

        this.initKeys();

        //Checkbox element in GUI
        this.gui.add(this.scene, 'displayAxis').name('Display Axis');
        //Dropdown for scenes
        this.gui.add(this.scene, 'selectedScene', this.scene.allScenes).name('Scene').onChange(() => { this.scene.graph.changeScene(this.scene.selectedScene) });

        return true;
    }

    reset() {
        //alert("lightsssssss:" + this.lights);
        if (this.lights != undefined) { this.gui.removeFolder(this.lights); }
        if (this.camera != undefined) { this.gui.remove(this.camera); }
        if (this.gameMode != undefined) { this.gui.remove(this.gameMode); }
        if (this.difficulty != undefined) { this.gui.remove(this.difficulty); }
        if (this.startGame != undefined) { this.gui.remove(this.startGame); }
        if (this.playMovie != undefined) { this.gui.remove(this.playMovie); }
        if (this.undo != undefined) { this.gui.remove(this.undo); }
    }

    setUpCameras() {
        //Dropdown for cameras
        this.camera = this.gui.add(this.scene, 'currentCamera', this.scene.cameraIDs).name('Camera').onChange(this.scene.updateAppliedCamera.bind(this.scene));
    }

    setUpLights(lights) {
        this.lights = this.gui.addFolder('Lights');
        this.lights.open();

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                //Checkbox for lights
                this.scene.lightGroup[key] = lights[key][0];
                this.lights.add(this.scene.lightGroup, key);
            }
        }
    }

    setUpGameModes() {
        //Dropdown for game modes
        this.gameMode = this.gui.add(this.scene, 'selectedGameMode', this.scene.gameModes).name('Game Mode').onChange(this.scene.updateGameMode.bind(this.scene));
    }

    setUpGameDifficulty() {
        //Dropdown for game difficulty
        this.difficulty = this.gui.add(this.scene, 'selectedGameDifficulty', this.scene.gameDifficulty).name('Game Difficulty').onChange(this.scene.updateGameDifficulty.bind(this.scene));
    }

    setUpOther() {
        this.startGame = this.gui.add(this.scene, 'startGame').name('Start Game');
        this.playMovie = this.gui.add(this.scene, 'playMovie').name('Play Movie');
        this.undo = this.gui.add(this.scene, 'undoMovement').name('Undo Movement');
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function () { };
        this.activeKeys = {};
    }

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}
