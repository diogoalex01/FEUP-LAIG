var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.vecNodes = [];
        this.vecKeyFrameAnimations = [];
        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse primitives block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("everything parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;
        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        this.views = [];
        this.defaultView = this.reader.getString(viewsNode, 'default');
        var children = viewsNode.children;
        var grandChildren = [];

        var pID, nearP, farP, angle, fromP, toPersp;
        var oID, nearO, farO, left, right, top, bottom, fromO, toO, up = [0, 1, 0];

        if (children.length < 1) {
            this.onXMLError("define at least one view");
        }

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName == "perspective") {
                pID = this.reader.getString(children[i], 'id');
                nearP = this.reader.getFloat(children[i], 'near');
                farP = this.reader.getFloat(children[i], 'far');
                angle = this.reader.getFloat(children[i], 'angle') * Math.PI / 180; // To radians

                grandChildren = children[i].children;

                for (var j = 0; j < grandChildren.length; j++) {
                    if (grandChildren[j].nodeName == "from") {
                        fromP = this.parseCoordinates3D(grandChildren[j], "from component of perspective of ID " + pID);
                    }
                    else if (grandChildren[j].nodeName == "to") {
                        toPersp = this.parseCoordinates3D(grandChildren[j], "to component of perspective of ID " + pID);
                    }
                    else {
                        this.onXMLError("not valid perspective child node type");
                    }
                }

                var perspectiveCam = new CGFcamera(angle, nearP, farP, fromP, toPersp);
                this.views[pID] = perspectiveCam;
            }

            if (children[i].nodeName == "ortho") {
                oID = this.reader.getString(children[i], 'id');
                nearO = this.reader.getFloat(children[i], 'near');
                farO = this.reader.getFloat(children[i], 'far');
                left = this.reader.getFloat(children[i], 'left');
                right = this.reader.getFloat(children[i], 'right');
                top = this.reader.getFloat(children[i], 'top');
                bottom = this.reader.getFloat(children[i], 'bottom');

                grandChildren = children[i].children;

                for (var j = 0; j < grandChildren.length; j++) {
                    if (grandChildren[j].nodeName == "from") {
                        fromO = this.parseCoordinates3D(grandChildren[j], "from component of ortho of ID " + oID);
                    }
                    else if (grandChildren[j].nodeName == "to") {
                        toO = this.parseCoordinates3D(grandChildren[j], "to component of ortho of ID " + oID);
                    }
                    else if (grandChildren.length == 3 && grandChildren[j].nodeName == "up") {
                        up = this.parseCoordinates3D(grandChildren[j], "to component of ortho of ID " + oID);
                    }
                    else {
                        this.onXMLError("not valid perspective child node type");
                    }
                }

                var orthoCam = new CGFcameraOrtho(left, right, bottom, top, nearO, farO, fromO, toO, up);
                this.views[oID] = orthoCam;
            }
        }

        this.log("Parsed views");
        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {
        var children = ambientsNode.children;
        this.ambient = [];
        this.background = [];
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed globals");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular", "attenuation"]);
                attributeTypes.push(...["position", "color", "color", "color", "value"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            if (aux == null) {
                enableLight = true;
            }
            else {
                enableLight = aux;
            }

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position") {
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    }
                    // parse attenuation
                    else if (attributeTypes[j] == "value") {
                        var constant = this.reader.getFloat(grandChildren[attributeIndex], 'constant');
                        var linear = this.reader.getFloat(grandChildren[attributeIndex], 'linear');
                        var quadratic = this.reader.getFloat(grandChildren[attributeIndex], 'quadratic');

                        if (!(constant != null && !isNaN(constant)))
                            return "unable to parse attenuation of the light for ID = " + lightId;

                        if (!(linear != null && !isNaN(linear)))
                            return "unable to parse attenuation of the light for ID = " + lightId;

                        if (!(quadratic != null && !isNaN(quadratic)))
                            return "unable to parse attenuation of the light for ID = " + lightId;

                        if (constant == 1 && linear == 0 && quadratic == 0) {
                            global.push("constant");
                        }
                        else if (constant == 0 && linear == 1 && quadratic == 0) {
                            global.push("linear");
                        }
                        else if (constant == 0 && linear == 0 && quadratic == 1) {
                            global.push("quadratic");
                        }
                        else {
                            this.onXMLMinorError("unable to parse light attenuation " + lightId);
                        }
                    }
                    else {
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);
                    }

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        //For each texture in textures block, check ID and file URL
        var children = texturesNode.children;
        this.textures = [];

        // Any number of textures.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current texture.
            var textureID = this.reader.getString(children[i], 'id');
            if (textureID == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.textures[textureID] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureID + ")";

            // Get id of the current texture.
            var filePath = this.reader.getString(children[i], 'file');
            if (filePath == null)
                return "no file path defined for texture";
            // Checks for repeated file paths.
            if (this.textures[textureID] != null)
                return "file paths must be unique for each texture (conflict: ID = " + textureID + ")";

            var texture = new CGFtexture(this.scene, filePath);
            this.textures[textureID] = texture;
        }

        this.log("Parsed textures");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        this.materials = [];
        var children = materialsNode.children;
        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            // Get shininess of the current material.
            var shininess = this.reader.getFloat(children[i], 'shininess');
            if (shininess == null || isNaN(shininess))
                return "unable to parse shininess of the material with ID = " + materialID;

            grandChildren = children[i].children;
            nodeNames = [];

            // Validate the material components
            if (grandChildren.length != 4) {
                return "There must be exactly 4 material components in the following order (emission, ambient, diffuse, specular) on material with ID" + materialID;
            }

            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var emissionIndex = nodeNames.indexOf("emission");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            if (grandChildren[emissionIndex].nodeName != "emission") {
                return "unknown tag <" + grandChildren[i].nodeName + ">";
            }

            var emission = this.parseColor(grandChildren[emissionIndex], "emission for material " + materialID);
            if (emission == null)
                return "no emission defined for material";

            var ambient = this.parseColor(grandChildren[ambientIndex], "ambient for material " + materialID);
            if (ambient == null)
                return "no ambient defined for material";

            var diffuse = this.parseColor(grandChildren[diffuseIndex], "diffuse for material " + materialID);
            if (diffuse == null)
                return "no diffuse defined for material";

            var specular = this.parseColor(grandChildren[specularIndex], "specular for material " + materialID);
            if (specular == null)
                return "no specular defined for material";

            var material = new CGFappearance(this.scene);
            material.setShininess(shininess);
            material.setEmission(emission[0], emission[1], emission[2]);
            material.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
            material.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
            material.setSpecular(specular[0], specular[1], specular[2], specular[3]);
            this.materials[materialID] = material;
        }

        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];
        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();

            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "scale transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'rotate':
                        var coordinates = this.parseRotation2D(grandChildren[j], "rotate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.rotate(transfMatrix, transfMatrix, coordinates[1], coordinates[0]);
                        break;
                }
            }
            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} animationsNode
     */
    parseAnimations(animationsNode) {
        var children = animationsNode.children;

        this.animations = [];
        var grandChildren = [];
        var grandgrandChildren = [];

        // Any number of animations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current animation.
            var animationID = this.reader.getString(children[i], 'id');
            if (animationID == null)
                return "no ID defined for animation";

            // Checks for repeated IDs.
            if (this.animations[animationID] != null)
                return "ID must be unique for each animation (conflict: ID = " + animationID + ")";

            grandChildren = children[i].children;

            //console.log(animationID);
            //console.dir(grandChildren);

            if (grandChildren[0].nodeName != "keyframe") {
                this.onXMLMinorError("unknown tag <" + grandChildren[i].nodeName + ">");
                continue;
            }

            var initialKeyFrame = new KeyFrame(animationID);
            initialKeyFrame.instant = 0;
            initialKeyFrame.translate = [0, 0, 0];
            initialKeyFrame.rotate = [0, 0, 0];
            initialKeyFrame.scale = [1, 1, 1];
            var keyFrameAnimation = new KeyframeAnimation();

            keyFrameAnimation.keyFrames.push(initialKeyFrame);

            // Specifications for the current animation.
            var transfMatrix = mat4.create();

            for (var j = 0; j < grandChildren.length; j++) {

                var grandgrandChildren = grandChildren[j].children;
                var keyFrame = new KeyFrame(animationID);

                // Get instant of the current animation.
                var animationInstant = this.reader.getFloat(grandChildren[j], 'instant');
                if (animationInstant == null)
                    return "no instant defined for animation";

                keyFrame.instant = animationInstant;

                for (var k = 0; k < grandgrandChildren.length; k++) {

                    switch (grandgrandChildren[k].nodeName) {
                        case 'translate': // TODO
                            var coordinates = this.parseCoordinates3D(grandgrandChildren[k], "translate animation for ID " + animationID);
                            if (!Array.isArray(coordinates))
                                return coordinates;

                            keyFrame.translate = coordinates;
                            break;

                        case 'scale':
                            var coordinates = this.parseCoordinates3D(grandgrandChildren[k], "scale animation for ID " + animationID);
                            if (!Array.isArray(coordinates))
                                return coordinates;

                            keyFrame.scale = coordinates;
                            break;

                        case 'rotate':
                            var rotation = [];

                            var rotX = this.reader.getFloat(grandgrandChildren[k], 'angle_x');
                            if (rotX == null || isNaN(rotX))
                                return "unable to parse rotX " + messageError;

                            var angRX = (Math.PI * rotX) / 180;
                            rotation.push(angRX);

                            var rotY = this.reader.getFloat(grandgrandChildren[k], 'angle_y');
                            if (rotY == null || isNaN(rotX))
                                return "unable to parse rotY " + messageError;

                            var angRY = (Math.PI * rotY) / 180;
                            rotation.push(angRY);

                            var rotZ = this.reader.getFloat(grandgrandChildren[k], 'angle_z');
                            if (rotZ == null || isNaN(rotX))
                                return "unable to parse rotZ " + messageError;

                            var angRZ = (Math.PI * rotZ) / 180;
                            rotation.push(angRZ);

                            if (!Array.isArray(rotation))
                                return rotation;

                            keyFrame.rotate = rotation;
                            break;
                    }
                }

                keyFrameAnimation.keyFrames.push(keyFrame);
            }
            //console.log(keyFrameAnimation.keyFrames);
            this.vecKeyFrameAnimations[animationID] = keyFrameAnimation;
        }

        this.log("Parsed animations");
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];
        var grandChildren = [];
        var grandgrandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus' && grandChildren[0].nodeName != 'plane' &&
                    grandChildren[0].nodeName != 'patch' && grandChildren[0].nodeName != 'cylinder2' &&
                    grandChildren[0].nodeName != 'piece')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere, torus, patch, plane, cylinder2 or piece)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);
                this.primitives[primitiveId] = rect;
            }
            else if (primitiveType == 'triangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // z1
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // z2
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3)))
                    return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

                // z3
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;

                var tri = new MyTriangle(this.scene, primitiveId, x1, x2, x3, y1, y2, y3, z1, z2, z3);
                this.primitives[primitiveId] = tri;
            }
            else if (primitiveType == 'cylinder') {
                // base
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base)))
                    return "unable to parse base of the primitive coordinates for ID = " + primitiveId;

                // top
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top of the primitive coordinates for ID = " + primitiveId;

                // height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                var cyl = new MyCylinder(this.scene, primitiveId, base, top, height, slices, stacks);
                this.primitives[primitiveId] = cyl;
            }
            else if (primitiveType == 'sphere') {
                // radius
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius)))
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var sph = new MySphere(this.scene, primitiveId, radius, slices, stacks);

                this.primitives[primitiveId] = sph;
            }
            else if (primitiveType == 'torus') {
                // inner
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner)))
                    return "unable to parse inner of the primitive coordinates for ID = " + primitiveId;

                // outer
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer)))
                    return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // loops
                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops)))
                    return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;

                var tor = new MyTorus(this.scene, primitiveId, inner, outer, slices, loops);
                this.primitives[primitiveId] = tor;
            }
            else if (primitiveType == 'plane') {
                // npartsU
                var npartsU = this.reader.getFloat(grandChildren[0], 'npartsU');
                if (!(npartsU != null && !isNaN(npartsU)))
                    return "unable to parse inner of the primitive coordinates for ID = " + primitiveId;

                // npartsV
                var npartsV = this.reader.getFloat(grandChildren[0], 'npartsV');
                if (!(npartsV != null && !isNaN(npartsV)))
                    return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;

                var plane = new Plane(this.scene, npartsU, npartsV);
                this.primitives[primitiveId] = plane;
            }
            else if (primitiveType == 'patch') {
                // npointsU
                var npointsU = this.reader.getFloat(grandChildren[0], 'npointsU');
                if (!(npartsU != null && !isNaN(npointsU)))
                    return "unable to parse inner of the primitive coordinates for ID = " + primitiveId;

                // npointsV
                var npointsV = this.reader.getFloat(grandChildren[0], 'npointsV');
                if (!(npointsV != null && !isNaN(npointsV)))
                    return "unable to parse inner of the primitive coordinates for ID = " + primitiveId;

                // npartsV
                var npartsU = this.reader.getFloat(grandChildren[0], 'npartsU');
                if (!(npartsU != null && !isNaN(npartsU)))
                    return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;

                // npartsV
                var npartsV = this.reader.getFloat(grandChildren[0], 'npartsV');
                if (!(npartsV != null && !isNaN(npartsV)))
                    return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;

                grandgrandChildren = grandChildren[0].children;
                var controlPoints = [];

                for (var j = 0; j < npointsU; j++) {
                    var npV = [];

                    for (var k = 0; k < npointsV; k++) {
                        // xx
                        var xx = this.reader.getFloat(grandgrandChildren[k + j * npointsV], 'xx');
                        if (!(xx != null && !isNaN(xx)))
                            return "unable to parse xx of the primitive coordinates for ID = " + primitiveId;

                        // yy
                        var yy = this.reader.getFloat(grandgrandChildren[k], 'yy');
                        if (!(yy != null && !isNaN(yy)))
                            return "unable to parse yy of the primitive coordinates for ID = " + primitiveId;

                        // zz
                        var zz = this.reader.getFloat(grandgrandChildren[k], 'zz');
                        if (!(zz != null && !isNaN(zz)))
                            return "unable to parse zz of the primitive coordinates for ID = " + primitiveId;

                        npV[k] = [xx, yy, zz, 1.0];
                    }
                    controlPoints[j] = npV;
                }
                var patch = new Patch(this.scene, npointsU, npointsV, npartsU, npartsV, controlPoints);
                this.primitives[primitiveId] = patch;
            }
            else if (primitiveType == 'cylinder2') {
                // base
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base)))
                    return "unable to parse base of the primitive coordinates for ID = " + primitiveId;

                // top
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top of the primitive coordinates for ID = " + primitiveId;

                // height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                var cyl2 = new Cylinder2(this.scene, base, top, height, slices, stacks);
                this.primitives[primitiveId] = cyl2;
            }
            else if (primitiveType == 'piece') {
                // radius
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius)))
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                // posX
                var posX = this.reader.getFloat(grandChildren[0], 'posX');
                if (!(posX != null && !isNaN(posX)))
                    return "unable to parse posX of the primitive coordinates for ID = " + primitiveId;

                // posY
                var posY = this.reader.getFloat(grandChildren[0], 'posY');
                if (!(posY != null && !isNaN(posY)))
                    return "unable to parse posY of the primitive coordinates for ID = " + primitiveId;

                // posZ
                var posZ = this.reader.getFloat(grandChildren[0], 'posZ');
                if (!(posZ != null && !isNaN(posZ)))
                    return "unable to parse posZ of the primitive coordinates for ID = " + primitiveId;

                var pie = new MyPiece(this.scene, radius, slices, stacks, posX, posY, posZ);

                this.primitives[primitiveId] = pie;
            }
            else {
                console.warn("Not a default primitive!");
            }

            this.vecNodes[primitiveId] = new MyNode(primitiveId, true);
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = [];
        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            grandChildren = children[i].children;
            nodeNames = [];

            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            var animationIndex = nodeNames.indexOf("animationref");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");

            // Transformations
            grandgrandChildren = grandChildren[transformationIndex].children;

            var node = new MyNode(componentID, false);
            this.vecNodes[componentID] = node;

            if (grandChildren[transformationIndex].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + grandChildren[transformationIndex].nodeName + ">");
                continue;
            }

            var transfMatrix = mat4.create();

            if (grandgrandChildren.length != 0) {
                if (grandgrandChildren[0].nodeName != "transformationref") {
                    for (var j = 0; j < grandgrandChildren.length; j++) {
                        switch (grandgrandChildren[j].nodeName) {
                            case 'translate':
                                var coordinates = this.parseCoordinates3D(grandgrandChildren[j], "translate transformation for ID " + componentID);
                                if (!Array.isArray(coordinates))
                                    return coordinates;

                                transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                                break;
                            case 'scale':
                                var coordinates = this.parseCoordinates3D(grandgrandChildren[j], "scale transformation for ID " + componentID);
                                if (!Array.isArray(coordinates))
                                    return coordinates;

                                transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                                break;
                            case 'rotate':
                                var coordinates = this.parseRotation2D(grandgrandChildren[j], "rotate transformation for ID " + componentID);
                                if (!Array.isArray(coordinates))
                                    return coordinates;

                                transfMatrix = mat4.rotate(transfMatrix, transfMatrix, coordinates[1], coordinates[0]);
                                break;
                        }
                    }
                }
                else {
                    transfMatrix = this.transformations[this.reader.getString(grandgrandChildren[0], 'id')];
                }
            }

            node.matrix = transfMatrix;


            // Animation
            if (grandChildren.length == 5) {
                if (grandChildren[animationIndex].nodeName == "animationref") {
                    node.animation = this.vecKeyFrameAnimations[this.reader.getString(grandChildren[animationIndex], 'id')];
                }
            }

            // Materials
            if (grandChildren[materialsIndex].nodeName != "materials") {
                this.onXMLMinorError("unknown tag <" + grandChildren[materialsIndex].nodeName + ">");
                continue;
            }

            grandgrandChildren = grandChildren[materialsIndex].children;

            var materialID = [];

            for (var j = 0; j < grandgrandChildren.length; j++) {
                materialID.push(this.reader.getString(grandgrandChildren[j], 'id'));
            }

            node.material = materialID;
            node.currentMat = 0;

            // Texture
            if (grandChildren[textureIndex].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + grandChildren[textureIndex].nodeName + ">");
                continue;
            }

            node.texture = this.reader.getString(grandChildren[textureIndex], 'id');

            //console.log(grandChildren[textureIndex].id);
            if (grandChildren[textureIndex].id != 'none' && grandChildren[textureIndex].id != 'inherit') {
                node.length_s = this.reader.getString(grandChildren[textureIndex], 'length_s');
                node.length_t = this.reader.getString(grandChildren[textureIndex], 'length_t');
            }
            else {
                node.length_s = 1;
                node.length_t = 1;
            }

            // Children
            var childrenID = [];

            if (grandChildren[childrenIndex].nodeName != "children") {
                this.onXMLMinorError("unknown tag <" + grandChildren[i].nodeName + ">");
                continue;
            }

            grandgrandChildren = grandChildren[childrenIndex].children;

            for (var j = 0; j < grandgrandChildren.length; j++) {
                if (grandgrandChildren[j].nodeName != "primitiveref" && grandgrandChildren[j].nodeName != "componentref") {
                    this.onXMLMinorError("unknown tag <" + grandgrandChildren[j].nodeName + ">");
                }
                else {
                    childrenID.push(this.reader.getString(grandgrandChildren[j], 'id'));
                }
            }

            node.descendants = childrenID;
            this.log("Parsed component");
        }

        this.log("Parsed components");
        //console.dir(this.vecNodes);
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * 
     * @param {block element} node 
     * @param {message to be displayed in case of error} messageError 
     */
    parseRotation2D(node, messageError) {
        var rotation = [];

        var axis = this.reader.getString(node, 'axis');
        if (axis == null)
            return "unable to parse axis " + messageError;

        switch (axis) {
            case 'x':
                rotation.push([1, 0, 0]);
                break;
            case 'y':
                rotation.push([0, 1, 0]);
                break;
            case 'z':
                rotation.push([0, 0, 1]);
                break;
        }

        var ang = this.reader.getFloat(node, 'angle');
        if (ang == null || isNaN(ang))
            return "unable to parse ang " + messageError;

        var angR = (Math.PI * ang) / 180;
        rotation.push(angR);

        return rotation;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        // Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;

        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    processNode(nodeID, material, texture, leng_s, leng_t) {
        var node = this.vecNodes[nodeID];
        var mat = material;
        var text = texture;
        var len_s = leng_s;
        var len_t = leng_t;

        if (nodeID == null)
            return;

        if (node.primitive) {
            if (len_s != 1) {
                //console.log(len_s);
                this.primitives[node.nodeID].updateLengthS(len_s);
                this.primitives[node.nodeID].updateTexCoords();
            }

            if (len_t != 1) {
                //console.log(len_t);
                this.primitives[node.nodeID].updateLengthT(len_t);
                this.primitives[node.nodeID].updateTexCoords();
            }

            if (mat != null && text != null) {
                this.materials[mat].setTexture(this.textures[text]);
                this.materials[mat].setTextureWrap('REPEAT', 'REPEAT');
                this.materials[mat].apply();
            }

            this.primitives[node.nodeID].display();
        }
        else {
            if (node.material[node.currentMat] != null) {
                if (node.material[node.currentMat] != 'inherit') {
                    mat = node.material[node.currentMat];
                }
            }

            if (node.texture != null) {
                if (node.texture == 'none') {
                    text = null;
                }
                else if (node.texture != 'inherit') {
                    text = node.texture;
                    len_s = node.length_s;
                    len_t = node.length_t;
                }
            }

            if (node.matrix != null) {
                this.scene.multMatrix(node.matrix);
                if (node.animation != null) {
                    if (node.animation.apply() != null) {
                        this.scene.multMatrix(node.animation.apply());
                    }
                }
            }

            for (var i = 0; i < node.descendants.length; i++) {
                this.scene.pushMatrix();
                this.processNode(node.descendants[i], mat, text, len_s, len_t);
                this.scene.popMatrix();
            }
        }
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        //To do: Create display loop for transversing the scene graph
        //To test the parsing/creation of the primitives, call the display function directly

        this.processNode(this.idRoot, this.vecNodes[this.idRoot].currentMat, this.vecNodes[this.idRoot].texture,
            this.vecNodes[this.idRoot].length_s, this.vecNodes[this.idRoot].length_t);
    }
}