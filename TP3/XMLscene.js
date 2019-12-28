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
        this.lightGroup = [];
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

        this.axis = new CGFaxis(this);
        this.RTT = new CGFtextureRTT(this, this.gl.canvas.width, this.gl.canvas.height);
        this.pickingBoard = new PickingBoard(this);
        this.nudge = new Nudge(this);

        this.setUpdatePeriod(80);

        this.displayAxis = true;
        this.last_time = 0;
        this.time = 0;
    }

    update(time) {
        if (this.sceneInited) {
            this.keyInput();

            var delta_time = time - this.last_time;

            for (var node in this.graph.vecNodes) {
                if (this.graph.vecNodes[node].animation != null) {
                    this.graph.vecNodes[node].animation.update(this.time / 1000);
                }
            }

            this.time += delta_time;
        }

        this.last_time = time;
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.defaultCamera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
        this.camera = this.defaultCamera;
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                switch (light[6]) {
                    case "constant":
                        this.lights[i].setConstantAttenuation(1.0);
                        break;
                    case "linear":
                        this.lights[i].setLinearAttenuation(1.0);
                        break;
                    case "quadratic":
                        this.lights[i].setQuadraticAttenuation(1.0);
                        break;
                }

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[7]);
                    this.lights[i].setSpotExponent(light[8]);
                    this.lights[i].setSpotDirection(light[9][0], light[9][1], light[9][2]);
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else {
                    this.lights[i].disable();
                }

                this.lights[i].update();
                i++;
            }
        }
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initLights();
        this.defaultCamera = this.graph.views[this.graph.defaultView];
        this.camera = this.defaultCamera;
        this.interface.setActiveCamera(this.camera);

        this.cameraIDs = Object.keys(this.graph.views);
        this.currentCamera = this.graph.defaultView;

        this.interface.setUpCameras();
        this.interface.setUpLights(this.graph.lights);

        this.sceneInited = true;

        this.setPickEnabled(true);
    }

    updateAppliedCamera() {
        this.defaultCamera = this.graph.views[this.currentCamera];
        this.camera = this.defaultCamera;
        this.interface.setActiveCamera(this.camera);
    }

    display() {
        this.RTT.attachToFrameBuffer();
        this.RTT.detachFromFrameBuffer();

        this.render(this.defaultCamera);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.DEPTH_TEST);

        this.logPicking();
        this.clearPickRegistration();

        this.pickingBoard.display();
        this.nudge.display();
    }

    logPicking() {
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i = 0; i < this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj) {
                        var customId = this.pickResults[i][1];
                        this.nudge.checkPick(customId);
                        console.log("Picked object: " + obj + ", with pick id " + customId);
                    }
                }
                this.pickResults.splice(0, this.pickResults.length);
            }
        }
    }

    /**
     * Renders the scene.
     */
    render(camera) {

        // ---- BEGIN Background, camera and axis setup

        this.camera = camera;
        this.interface.setActiveCamera(this.camera);

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        // Draw axis
        if (this.displayAxis)
            this.axis.display();

        if (this.sceneInited) {
            // Draw axis
            this.setDefaultAppearance();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }

        this.popMatrix();

        var j = 0;

        for (var key in this.lightGroup) {
            if (this.lightGroup.hasOwnProperty(key)) {
                if (this.lightGroup[key]) {
                    this.lights[j].setVisible(true);
                    this.lights[j].enable();
                }
                else {
                    this.lights[j].setVisible(false);
                    this.lights[j].disable();
                }
                this.lights[j].update();
                j++;
            }
        }

        // ---- END Background, camera and axis setup
    }

    keyInput() {
        if (this.interface.isKeyPressed('KeyM')) {
            for (var key in this.graph.vecNodes) {
                var obj = this.graph.vecNodes[key];
                if (!obj.primitive) {
                    var index = (obj.currentMat + 1) % obj.material.length;
                    obj.currentMat = index;
                }
            }
        }
    }
}
