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

        return true;
    }

    setUpCameras() {
        //Dropdown for cameras
        this.gui.add(this.scene, 'currentCamera', this.scene.cameraIDs).name('Selected Camera').onChange(this.scene.updateAppliedCamera.bind(this.scene));
    }

    setUpLights(lights) {
        var group = this.gui.addFolder("Lights");
        group.open();
        
        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                //Checkbox for lights
                this.scene.lightGroup[key] = lights[key][0];
                group.add(this.scene.lightGroup, key);
            }
        }
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