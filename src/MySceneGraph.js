var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var ANIMATIONS_INDEX = 8;
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


        this.axisLength = 0;

        this.ambientB = []; //ambient background
        this.ambientA = []; //ambient

        this.nodes = [];
        this.omniLights = []; //enabled, location(x,y,z,w), ambient(r,g,b,a), diffuse(r,g,b,a), specular(r,g,b,a)
        this.spotLights = []; //enabled, angle, exponent, location(x,y,z,w), target(x,y,z), ambient(r,g,b,a) ...
        this.textures = [];
        this.perspectives = [];
        this.ortho = [];
        this.nodes = [];
        this.defaultViewId;
        this.primitives = [];
        this.materials = [];
        this.transformations = []; //mat4 matrix
        this.animations = [];


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
        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";

        let nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        let nodeNames = [];

        for (let i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.
        // <scene>
        let index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order");

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
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
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
    }

    /**
     * Parses the <scene> block.
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {
        this.idRoot = this.reader.getString(sceneNode, "root");
        this.axisLength = this.reader.getFloat(sceneNode, "axis_length");

        this.log("Parsed scene block");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {views block element} viewsNode
     */
    parseViews(viewsNode) {

        let children = viewsNode.children;

        let nodeNames = [];
        let arrayfromto = [];

        let perspectivearray = viewsNode.getElementsByTagName('perspective');
        let orthoarray = viewsNode.getElementsByTagName('ortho');

        for (let i = 0; i < children.length; i++) {
            nodeNames.push(children[i].nodeName);
        }

        if (viewsNode == -1) {
            this.onXMLMinorError("Views missing");
        }
        else {
            //set default view
            this.defaultViewId = this.reader.getString(viewsNode, 'default');
        }

        let perspectiveIndex = nodeNames.indexOf("perspective");
        let orthoIndex = nodeNames.indexOf("ortho");

        if (perspectiveIndex == -1 && orthoIndex == -1) {
            this.onXMLMinorError("perspective and ortho view missing");
        }
        else {
            if (perspectiveIndex != -1)
                for (var j = 0; j < perspectivearray.length; j++) {
                    let perspectivechildren = perspectivearray[j].children;
                    let idperspective = this.reader.getString(perspectivearray[j], 'id');
                    let near = this.reader.getFloat(perspectivearray[j], 'near');
                    let far = this.reader.getFloat(perspectivearray[j], 'far');
                    let angle = this.reader.getFloat(perspectivearray[j], 'angle');

                    for (let k = 0; k < perspectivechildren.length; k++) {
                        arrayfromto.push(perspectivechildren[k].nodeName);
                    }
                    let fromIndex = arrayfromto.indexOf("from");
                    let toIndex = arrayfromto.indexOf("to");

                    if (fromIndex == -1 || toIndex == -1) {
                        this.onXMLMinorError("perspective children missing");
                    }
                    else {
                        let xfrom = this.reader.getFloat(perspectivechildren[fromIndex], 'x');
                        let yfrom = this.reader.getFloat(perspectivechildren[fromIndex], 'y');
                        let zfrom = this.reader.getFloat(perspectivechildren[fromIndex], 'z');

                        let xto = this.reader.getFloat(perspectivechildren[toIndex], 'x');
                        let yto = this.reader.getFloat(perspectivechildren[toIndex], 'y');
                        let zto = this.reader.getFloat(perspectivechildren[toIndex], 'z');

                        angle = DEGREE_TO_RAD * angle;
                        let camera = new CGFcamera(angle, near, far, vec3.fromValues(xfrom, yfrom, zfrom), vec3.fromValues(xto, yto, zto));

                        this.perspectives[idperspective] = camera;
                    }
                }
            if (orthoIndex != -1) {
                for (var j = 0; j < orthoarray.length; j++) {

                    let orthoChildren = orthoarray[j].children;
                    let idOrtho = this.reader.getString(orthoarray[j], 'id');
                    let near = this.reader.getFloat(orthoarray[j], 'near');
                    let far = this.reader.getFloat(orthoarray[j], 'far');
                    let left = this.reader.getFloat(orthoarray[j], 'left');
                    let right = this.reader.getFloat(orthoarray[j], 'right');
                    let top = this.reader.getFloat(orthoarray[j], 'top');
                    let bot = this.reader.getFloat(orthoarray[j], 'bottom');


                    for (let k = 0; k < orthoChildren.length; k++) {
                        arrayfromto.push(orthoChildren[k].nodeName);
                    }
                    let fromIndex = arrayfromto.indexOf("from");
                    let toIndex = arrayfromto.indexOf("to");

                    if (fromIndex == -1 || toIndex == -1) {
                        this.onXMLMinorError("ortho children missing");
                    }
                    else {
                        let xfrom = this.reader.getFloat(orthoChildren[fromIndex], 'x');
                        let yfrom = this.reader.getFloat(orthoChildren[fromIndex], 'y');
                        let zfrom = this.reader.getFloat(orthoChildren[fromIndex], 'z');

                        let xto = this.reader.getFloat(orthoChildren[toIndex], 'x');
                        let yto = this.reader.getFloat(orthoChildren[toIndex], 'y');
                        let zto = this.reader.getFloat(orthoChildren[toIndex], 'z');

                        let upx = xfrom - xto;
                        let upy = yfrom - yto;
                        let upz = zfrom - zto;

                        let camera = new CGFcameraOrtho(left, right, bot, top, near, far, vec3.fromValues(xfrom, yfrom, zfrom), vec3.fromValues(xto, yto, zto), vec3.fromValues(upx, upy, upz));

                        this.ortho[idOrtho] = camera;
                    }








                }
            }
        }

        this.log("Parsed views block");
        return null;
    }

    /**
     * Parses the <ambient> block.
     * @param {ambient block element} ambientNode
     */
    parseAmbient(ambientNode) {
        let children = ambientNode.children;

        let nodeNames = [];

        for (let i = 0; i < children.length; i++) {
            nodeNames.push(children[i].nodeName);
        }

        let ambientIndex = nodeNames.indexOf("ambient");
        let backgroundIndex = nodeNames.indexOf("background");

        //Ambient component 
        if (ambientIndex != -1) {
            // R
            let r = this.reader.getFloat(children[ambientIndex], 'r');
            if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                return "unable to parse R component of the ambient illumination in tag <ambient>";
            else
                this.ambientA.push(r);

            // G
            let g = this.reader.getFloat(children[ambientIndex], 'g');
            if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                return "unable to parse G component of the ambient illumination in tag <ambient>";
            else
                this.ambientA.push(g);

            // B
            let b = this.reader.getFloat(children[ambientIndex], 'b');
            if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                return "unable to parse B component of the ambient illumination in tag <ambient>";
            else
                this.ambientA.push(b);

            // A
            let a = this.reader.getFloat(children[ambientIndex], 'a');
            if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                return "unable to parse A component of the ambient illumination in tag <ambient>";
            else
                this.ambientA.push(a);
        }
        else
            return "ambient component undefined";

        //Background component 
        if (backgroundIndex != -1) {
            // R
            let r = this.reader.getFloat(children[backgroundIndex], 'r');
            if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                return "unable to parse R component of the ambient background illumination in tag <ambient>";
            else
                this.ambientB.push(r);

            // G
            let g = this.reader.getFloat(children[backgroundIndex], 'g');
            if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                return "unable to parse G component of the ambient background illumination in tag <ambient>";
            else
                this.ambientB.push(g);

            // B
            let b = this.reader.getFloat(children[backgroundIndex], 'b');
            if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                return "unable to parse B component of the ambient background illumination in tag <ambient>";
            else
                this.ambientB.push(b);

            // A
            let a = this.reader.getFloat(children[backgroundIndex], 'a');
            if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                return "unable to parse A component of the ambient background illumination in tag <ambient>";
            else
                this.ambientB.push(a);
        }
        else
            return "background component undefined";

        this.log("Parsed ambient block");
        return null;
    }

    /**
     * Parses the <LIGHTS> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        let children = lightsNode.children;
        let numLights = 0;

        let grandChildren = [];
        let nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName == "omni") {
                //reset arrays
                grandChildren = [];
                nodeNames = [];

                //omni light ID
                let lightId = this.reader.getString(children[i], 'id');
                if (lightId == null)
                    return "no ID defined for omni light";


                // Checks for repeated in both arrays
                if (this.omniLights[lightId] != null)
                    return "ID must be unique for each light (conflict: ID = " + lightId + ")";
                if (this.spotLights[lightId] != null)
                    return "ID must be unique for each light (conflict: ID = " + lightId + ")";

                //light components
                grandChildren = children[i].children;

                // Specifications for the current light

                for (let j = 0; j < grandChildren.length; j++) {
                    nodeNames.push(grandChildren[j].nodeName);
                }

                // Gets indices of each element.
                let positionIndex = nodeNames.indexOf("location");
                let ambientIndex = nodeNames.indexOf("ambient");
                let diffuseIndex = nodeNames.indexOf("diffuse");
                let specularIndex = nodeNames.indexOf("specular");


                // Light enable/disable
                let enableLight = true;
                let aux = this.reader.getFloat(children[i], 'enabled');
                if (aux != 0 && aux != 1) {
                    this.onXMLMinorError("enable value missing or wrong for ID = " + lightId + "; assuming 'value = 1'");
                }
                else {
                    if (!(aux != null && !isNaN(aux) && (aux == 0 || aux == 1)))
                        this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
                    else
                        enableLight = aux == 0 ? false : true;
                }

                // Retrieves the light position.
                let positionLight = [];
                if (positionIndex != -1) {
                    // x
                    var x = this.reader.getFloat(grandChildren[positionIndex], 'x');
                    if (!(x != null && !isNaN(x)))
                        return "unable to parse x-coordinate of the light position for ID = " + lightId;
                    else
                        positionLight.push(x);

                    // y
                    var y = this.reader.getFloat(grandChildren[positionIndex], 'y');
                    if (!(y != null && !isNaN(y)))
                        return "unable to parse y-coordinate of the light position for ID = " + lightId;
                    else
                        positionLight.push(y);

                    // z
                    var z = this.reader.getFloat(grandChildren[positionIndex], 'z');
                    if (!(z != null && !isNaN(z)))
                        return "unable to parse z-coordinate of the light position for ID = " + lightId;
                    else
                        positionLight.push(z);

                    // w
                    var w = this.reader.getFloat(grandChildren[positionIndex], 'w');
                    if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                        return "unable to parse x-coordinate of the light position for ID = " + lightId;
                    else
                        positionLight.push(w);
                }
                else
                    return "light position undefined for ID = " + lightId;

                // Retrieves the ambient component.
                var ambientIllumination = [];
                if (ambientIndex != -1) {
                    // R
                    var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                    if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                        return "unable to parse R component of the ambient illumination for ID = " + lightId;
                    else
                        ambientIllumination.push(r);

                    // G
                    var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                    if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                        return "unable to parse G component of the ambient illumination for ID = " + lightId;
                    else
                        ambientIllumination.push(g);

                    // B
                    var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                    if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                        return "unable to parse B component of the ambient illumination for ID = " + lightId;
                    else
                        ambientIllumination.push(b);

                    // A
                    var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                    if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                        return "unable to parse A component of the ambient illumination for ID = " + lightId;
                    else
                        ambientIllumination.push(a);
                }
                else
                    return "ambient component undefined for ID = " + lightId;

                //Retrieves the diffuse component
                let diffuseIllumination = [];
                if (diffuseIndex != -1) {
                    // R
                    let r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
                    if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                        return "unable to parse R component of the diffuse illumination for ID = " + lightId;
                    else
                        diffuseIllumination.push(r);

                    // G
                    let g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
                    if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                        return "unable to parse G component of the diffuse illumination for ID = " + lightId;
                    else
                        diffuseIllumination.push(g);

                    // B
                    let b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
                    if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                        return "unable to parse B component of the diffuse illumination for ID = " + lightId;
                    else
                        diffuseIllumination.push(b);

                    // A
                    let a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
                    if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                        return "unable to parse A component of the diffuse illumination for ID = " + lightId;
                    else
                        diffuseIllumination.push(a);
                }
                else
                    return "diffuse component undefined for ID = " + lightId;

                //Retrieves the specular component
                let specularIllumination = [];
                if (specularIndex != -1) {
                    // R
                    let r = this.reader.getFloat(grandChildren[specularIndex], 'r');
                    if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                        return "unable to parse R component of the specular illumination for ID = " + lightId;
                    else
                        specularIllumination.push(r);

                    // G
                    let g = this.reader.getFloat(grandChildren[specularIndex], 'g');
                    if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                        return "unable to parse G component of the specular illumination for ID = " + lightId;
                    else
                        specularIllumination.push(g);

                    // B
                    let b = this.reader.getFloat(grandChildren[specularIndex], 'b');
                    if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                        return "unable to parse B component of the specular illumination for ID = " + lightId;
                    else
                        specularIllumination.push(b);

                    // A
                    let a = this.reader.getFloat(grandChildren[specularIndex], 'a');
                    if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                        return "unable to parse A component of the specular illumination for ID = " + lightId;
                    else
                        specularIllumination.push(a);
                }
                else
                    return "specular component undefined for ID = " + lightId;

                //Store OMNI Light information.
                let lightInfo = [];
                lightInfo.push(enableLight);
                lightInfo.push(positionLight);
                lightInfo.push(ambientIllumination);
                lightInfo.push(diffuseIllumination);
                lightInfo.push(specularIllumination);

                this.omniLights[lightId] = lightInfo;
                numLights++;

            }
            else if (children[i].nodeName == "spot") {
                //reset the arrays
                nodeNames = [];
                grandChildren = [];

                //spot light ID
                let lightId = this.reader.getString(children[i], 'id');
                if (lightId == null)
                    return "no ID defined for omni light";


                // Checks for repeated in both arrays
                if (this.omniLights[lightId] != null)
                    return "ID must be unique for each light (conflict: ID = " + lightId + ")";
                if (this.spotLights[lightId] != null)
                    return "ID must be unique for each light (conflict: ID = " + lightId + ")";

                //light components
                grandChildren = children[i].children;

                // Specifications for the current light
                for (let j = 0; j < grandChildren.length; j++) {
                    nodeNames.push(grandChildren[j].nodeName);
                }

                // Gets indices of each element.
                let positionIndex = nodeNames.indexOf("location");
                let targetIndex = nodeNames.indexOf("target");
                let ambientIndex = nodeNames.indexOf("ambient");
                let diffuseIndex = nodeNames.indexOf("diffuse");
                let specularIndex = nodeNames.indexOf("specular");

                // Light enable/disable
                let enableLight = true;
                let aux = this.reader.getFloat(children[i], 'enabled');
                if (aux != 0 && aux != 1) {
                    this.onXMLMinorError("enable value missing or wrong for ID = " + lightId + "; assuming 'value = 1'");
                }
                else {
                    if (!(aux != null && !isNaN(aux) && (aux == 0 || aux == 1)))
                        this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
                    else
                        enableLight = aux == 0 ? false : true;
                }

                //light angle
                let angleLight = this.reader.getFloat(children[i], 'angle');
                if (isNaN(angleLight)) {
                    this.onXMLMinorError("angle value missing or wrong for ID = " + lightId);
                }

                //light exponent
                let exponentLight = this.reader.getFloat(children[i], 'exponent');
                if (isNaN(exponentLight)) {
                    this.onXMLMinorError("exponent value missing or wrong for ID = " + lightId);
                }

                // Retrieves the light position.
                let positionLight = [];
                if (positionIndex != -1) {
                    // x
                    let x = this.reader.getFloat(grandChildren[positionIndex], 'x');
                    if (!(x != null && !isNaN(x)))
                        return "unable to parse x-coordinate of the light position for ID = " + lightId;
                    else
                        positionLight.push(x);

                    // y
                    let y = this.reader.getFloat(grandChildren[positionIndex], 'y');
                    if (!(y != null && !isNaN(y)))
                        return "unable to parse y-coordinate of the light position for ID = " + lightId;
                    else
                        positionLight.push(y);

                    // z
                    let z = this.reader.getFloat(grandChildren[positionIndex], 'z');
                    if (!(z != null && !isNaN(z)))
                        return "unable to parse z-coordinate of the light position for ID = " + lightId;
                    else
                        positionLight.push(z);

                    // w
                    let w = this.reader.getFloat(grandChildren[positionIndex], 'w');
                    if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                        return "unable to parse x-coordinate of the light position for ID = " + lightId;
                    else
                        positionLight.push(w);
                }
                else
                    return "light position undefined for ID = " + lightId;


                //Retrieves the light target.
                let targetLight = [];
                if (targetIndex != -1) {
                    // x
                    let x = this.reader.getFloat(grandChildren[targetIndex], 'x');
                    if (!(x != null && !isNaN(x)))
                        return "unable to parse x-coordinate of the light target for ID = " + lightId;
                    else
                        targetLight.push(x);

                    // y
                    let y = this.reader.getFloat(grandChildren[targetIndex], 'y');
                    if (!(y != null && !isNaN(y)))
                        return "unable to parse y-coordinate of the light target for ID = " + lightId;
                    else
                        targetLight.push(y);

                    // z
                    let z = this.reader.getFloat(grandChildren[targetIndex], 'z');
                    if (!(z != null && !isNaN(z)))
                        return "unable to parse z-coordinate of the light target for ID = " + lightId;
                    else
                        targetLight.push(z);
                }
                else
                    return "light target undefined for ID = " + lightId;



                // Retrieves the ambient component.
                let ambientIllumination = [];
                if (ambientIndex != -1) {
                    // R
                    let r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                    if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                        return "unable to parse R component of the ambient illumination for ID = " + lightId;
                    else
                        ambientIllumination.push(r);

                    // G
                    let g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                    if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                        return "unable to parse G component of the ambient illumination for ID = " + lightId;
                    else
                        ambientIllumination.push(g);

                    // B
                    let b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                    if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                        return "unable to parse B component of the ambient illumination for ID = " + lightId;
                    else
                        ambientIllumination.push(b);

                    // A
                    let a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                    if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                        return "unable to parse A component of the ambient illumination for ID = " + lightId;
                    else
                        ambientIllumination.push(a);
                }
                else
                    return "ambient component undefined for ID = " + lightId;

                //Retrieves the diffuse component
                let diffuseIllumination = [];
                if (diffuseIndex != -1) {
                    // R
                    let r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
                    if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                        return "unable to parse R component of the diffuse illumination for ID = " + lightId;
                    else
                        diffuseIllumination.push(r);

                    // G
                    let g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
                    if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                        return "unable to parse G component of the diffuse illumination for ID = " + lightId;
                    else
                        diffuseIllumination.push(g);

                    // B
                    let b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
                    if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                        return "unable to parse B component of the diffuse illumination for ID = " + lightId;
                    else
                        diffuseIllumination.push(b);

                    // A
                    let a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
                    if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                        return "unable to parse A component of the diffuse illumination for ID = " + lightId;
                    else
                        diffuseIllumination.push(a);
                }
                else
                    return "diffuse component undefined for ID = " + lightId;

                //Retrieves the specular component
                let specularIllumination = [];
                if (specularIndex != -1) {
                    // R
                    let r = this.reader.getFloat(grandChildren[specularIndex], 'r');
                    if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                        return "unable to parse R component of the specular illumination for ID = " + lightId;
                    else
                        specularIllumination.push(r);

                    // G
                    let g = this.reader.getFloat(grandChildren[specularIndex], 'g');
                    if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                        return "unable to parse G component of the specular illumination for ID = " + lightId;
                    else
                        specularIllumination.push(g);

                    // B
                    let b = this.reader.getFloat(grandChildren[specularIndex], 'b');
                    if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                        return "unable to parse B component of the specular illumination for ID = " + lightId;
                    else
                        specularIllumination.push(b);

                    // A
                    let a = this.reader.getFloat(grandChildren[specularIndex], 'a');
                    if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                        return "unable to parse A component of the specular illumination for ID = " + lightId;
                    else
                        specularIllumination.push(a);
                }
                else
                    return "specular component undefined for ID = " + lightId;


                //Store SPOT Light information.
                let lightInfo = [];
                lightInfo.push(enableLight);
                lightInfo.push(angleLight);
                lightInfo.push(exponentLight);
                lightInfo.push(positionLight);
                lightInfo.push(targetLight);
                lightInfo.push(ambientIllumination);
                lightInfo.push(diffuseIllumination);
                lightInfo.push(specularIllumination);

                this.spotLights[lightId] = lightInfo;
                numLights++;
            }
            else {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights block");
        return null;
    }

    /**
     * Parses the <TEXTURES> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        let children = texturesNode.children;


        for (let i = 0; i < children.length; i++) {

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current texture.
            let textureId = this.reader.getString(children[i], 'id');
            if (textureId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.textures[textureId] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureId + ")";

            //get path for file
            let textureURL = this.reader.getString(children[i], 'file');

            textureURL = "scenes/" + textureURL;

            let texture = new CGFtexture(this.scene, textureURL);

            this.textures[textureId] = texture;

        }
        this.log("Parsed textures block");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        let children = materialsNode.children;

        let grandChildren = [];
        let nodeNames = [];

        for (let i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            let materialId = this.reader.getString(children[i], 'id');
            if (materialId == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialId] != null)
                return "ID must be unique for each material (conflict: ID = " + materialId + ")";

            grandChildren = children[i].children;

            // Specifications for the current material

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }
            // Gets indices of each element.
            let specularIndex = nodeNames.indexOf("specular");
            let diffuseIndex = nodeNames.indexOf("diffuse");
            let ambientIndex = nodeNames.indexOf("ambient");
            let emissionIndex = nodeNames.indexOf("emission");


            let shininess = this.reader.getFloat(children[i], 'shininess');

            if (isNaN(shininess)) {
                this.onXMLMinorError("Erro parsing shininess for material with id: " + materialId + " assuming default value 10");
                shininess = 10;
            }


            let specular = [0.5, 0.5, 0.5, 1.0]; //default value
            if (specularIndex != -1) {
                let r = this.reader.getFloat(grandChildren[specularIndex], 'r');
                let g = this.reader.getFloat(grandChildren[specularIndex], 'g');
                let b = this.reader.getFloat(grandChildren[specularIndex], 'b');
                let a = this.reader.getFloat(grandChildren[specularIndex], 'a');

                specular = [r, g, b, a];
            }
            else this.onXMLMinorError("Error parsing specular component of material: " + materialId);

            let diffuse = [0.5, 0.5, 0.5, 1.0]; //default value
            if (diffuseIndex != -1) {
                let r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
                let g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
                let b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
                let a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');

                diffuse = [r, g, b, a];
            }
            else this.onXMLMinorError("Error parsing diffuse component of material: " + materialId);

            let ambient = [0.2, 0.2, 0.2, 1.0]; //default value
            if (ambientIndex != -1) {
                let r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                let g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                let b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                let a = this.reader.getFloat(grandChildren[ambientIndex], 'a');

                ambient = [r, g, b, a];
            }
            else this.onXMLMinorError("Error parsing ambient component of material: " + materialId);

            let emission = [0.0, 0.0, 0.0, 1.0]; //default value
            if (emissionIndex != -1) {
                let r = this.reader.getFloat(grandChildren[emissionIndex], 'r');
                let g = this.reader.getFloat(grandChildren[emissionIndex], 'g');
                let b = this.reader.getFloat(grandChildren[emissionIndex], 'b');
                let a = this.reader.getFloat(grandChildren[emissionIndex], 'a');

                emission = [r, g, b, a];
            }
            else this.onXMLMinorError("Error parsing ambient component of material: " + materialId);


            let material = new CGFappearance(this.scene);
            material.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
            material.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
            material.setEmission(emission[0], emission[1], emission[2], emission[3]);
            material.setShininess(shininess);
            material.setSpecular(specular[0], specular[1], specular[2], specular[3]);

            this.materials[materialId] = material;

        }
        this.log("Parsed materials block");
        return null;

    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        let children = transformationsNode.children;

        let grandChildren = [];



        if (children.length == 0) { //no transformation defined
            this.onXMLError("no transformation defined in tag <transformations>, please make sure to put at least one");
        }

        for (let i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            let transformationId = this.reader.getString(children[i], 'id');
            if (transformationId == null)
                return "no ID defined for transformation";

            grandChildren = children[i].children;

            let transMatrix = mat4.create();

            for (let j = 0; j < grandChildren.length; j++) { //lets see how many transformations we got
                let transformationName = grandChildren[j].nodeName;
                if (transformationName == "translate") {

                    let x = this.reader.getFloat(grandChildren[j], 'x');
                    let y = this.reader.getFloat(grandChildren[j], 'y');
                    let z = this.reader.getFloat(grandChildren[j], 'z');

                    let translateCoords = [x, y, z];

                    mat4.translate(transMatrix, transMatrix, translateCoords);

                }
                else if (transformationName == "scale") {
                    let x = this.reader.getFloat(grandChildren[j], 'x');
                    let y = this.reader.getFloat(grandChildren[j], 'y');
                    let z = this.reader.getFloat(grandChildren[j], 'z');

                    let scaleCoords = [x, y, z];

                    mat4.scale(transMatrix, transMatrix, scaleCoords);


                }
                else if (transformationName == "rotate") {
                    let axis = this.reader.getString(grandChildren[j], 'axis');
                    let angle = this.reader.getFloat(grandChildren[j], 'angle');
                    let rotateCoords = [];

                    switch (axis) {
                        case 'x':
                            rotateCoords = [1, 0, 0];
                            break;
                        case 'y':
                            rotateCoords = [0, 1, 0];
                            break;
                        case 'z':
                            rotateCoords = [0, 0, 1];
                            break;
                    }

                    let angleRad = angle * DEGREE_TO_RAD; //now we have rads

                    mat4.rotate(transMatrix, transMatrix, angleRad, rotateCoords);

                }
                else {
                    this.onXMLMinorError("error parsing tag of transformation with id: " + transformationId);
                    continue;
                }

            }

            this.transformations[transformationId] = transMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        let children = primitivesNode.children;

        let grandChildren = [];

        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            //get id of primitive
            let primitiveId = this.reader.getString(children[i], "id");

            //checks for repeated id's
            if (this.primitives[primitiveId] != null)
                this.onXMLMinorError("repeated id for primitive with id: " + primitiveId);

            //creates the new primitive
            grandChildren = children[i].children;

            if (grandChildren.length != 1)
                this.onXMLMinorError("only one primitive must be defined in the block with id: " + primitiveId);

            let primitiveName = grandChildren[0].nodeName;

            let args = []; //stores arguments to further call primitive constructor

            switch (primitiveName) {
                case 'rectangle':
                    args = [];
                    let x1 = this.reader.getFloat(grandChildren[0], "x1");
                    let x2 = this.reader.getFloat(grandChildren[0], "x2");
                    let y1 = this.reader.getFloat(grandChildren[0], "y1");
                    let y2 = this.reader.getFloat(grandChildren[0], "y2");

                    args.push(x1, y1, x2, y2);

                    this.primitives[primitiveId] = new Rectangle(this.scene, args);

                    break;
                case 'cylinder':
                    args = [];
                    let height = this.reader.getFloat(grandChildren[0], "height");
                    let base = this.reader.getFloat(grandChildren[0], "base");
                    let top = this.reader.getFloat(grandChildren[0], "top");
                    let stacks = this.reader.getFloat(grandChildren[0], "stacks");
                    let slices = this.reader.getFloat(grandChildren[0], "slices");

                    args.push(height, base, top, stacks, slices);

                    this.primitives[primitiveId] = new Cylinder(this.scene, args);

                    break;

                case 'cylinder2':
                    args = [];
                    let height2 = this.reader.getFloat(grandChildren[0], "height");
                    let base2 = this.reader.getFloat(grandChildren[0], "base");
                    let top2 = this.reader.getFloat(grandChildren[0], "top");
                    let stacks2 = this.reader.getFloat(grandChildren[0], "stacks");
                    let slices2 = this.reader.getFloat(grandChildren[0], "slices");

                    args.push(height2, base2, top2, stacks2, slices2);

                    this.primitives[primitiveId] = new Cylinder2(this.scene, args);

                    break;


                case 'triangle':
                    args = [];
                    //vertex1
                    let v1x = this.reader.getFloat(grandChildren[0], "x1");
                    let v1y = this.reader.getFloat(grandChildren[0], "y1");
                    let v1z = this.reader.getFloat(grandChildren[0], "z1");

                    //vertex2 
                    let v2x = this.reader.getFloat(grandChildren[0], "x2");
                    let v2y = this.reader.getFloat(grandChildren[0], "y2");
                    let v2z = this.reader.getFloat(grandChildren[0], "z2");

                    //vertex3
                    let v3x = this.reader.getFloat(grandChildren[0], "x3");
                    let v3y = this.reader.getFloat(grandChildren[0], "y3");
                    let v3z = this.reader.getFloat(grandChildren[0], "z3");

                    args.push(v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z);

                    this.primitives[primitiveId] = new Triangle(this.scene, args);
                    break;

                case 'sphere':
                    args = [];

                    let radius = this.reader.getFloat(grandChildren[0], "radius");
                    let stacksS = this.reader.getFloat(grandChildren[0], "stacks");
                    let slicesS = this.reader.getFloat(grandChildren[0], "slices");

                    args.push(radius, stacksS, slicesS);

                    this.primitives[primitiveId] = new Sphere(this.scene, args);
                    break;
                case 'torus':

                    args = [];
                    let inner = this.reader.getFloat(grandChildren[0], "inner");
                    let outer = this.reader.getFloat(grandChildren[0], "outer");
                    let slicesT = this.reader.getFloat(grandChildren[0], "slices");
                    let loops = this.reader.getFloat(grandChildren[0], "loops");

                    args.push(inner, outer, slicesT, loops);
                    this.primitives[primitiveId] = new Torus(this.scene, args);
                    break;

                case 'plane':
                    args = [];

                    let npartsU = this.reader.getFloat(grandChildren[0], "npartsU");
                    let npartsV = this.reader.getFloat(grandChildren[0], "npartsV");

                    args.push(npartsU, npartsV);
                    this.primitives[primitiveId] = new Plane(this.scene, args);

                    break;


                case 'patch':
                    args = [];

                    let npointsU = this.reader.getFloat(grandChildren[0], "npointsU");
                    let npointsV = this.reader.getFloat(grandChildren[0], "npointsV");

                    let npartsU1 = this.reader.getFloat(grandChildren[0], "npartsU");
                    let npartsV1 = this.reader.getFloat(grandChildren[0], "npartsV");

                    let numberControlPoints = npointsU * npointsV;

                    let grandgrandChildren = grandChildren[0].children;

                    if (grandgrandChildren.length != numberControlPoints) {
                        this.onXMLError("Error with number of control points in primitive with id: " + primitiveId);
                        return;
                    }

                    let controlPoints = [];

                    for (let j = 0; j < grandgrandChildren.length; j++) {

                        if (grandgrandChildren[j].nodeName != "controlpoint") {
                            this.onXMLMinorError("error loading control point in primitive with id" + primitiveId);
                            continue;
                        }
                        else {

                            let xx = this.reader.getFloat(grandgrandChildren[j], "xx");
                            let yy = this.reader.getFloat(grandgrandChildren[j], "yy");
                            let zz = this.reader.getFloat(grandgrandChildren[j], "zz");
                            let controlPoint = [xx, yy, zz, 1];

                            controlPoints.push(controlPoint);

                        }
                    }

                    //reorder control points
                    let CP = [];
                    for (let u = 0; u < npointsU; u++) {
                        let A = [];
                        for (let v = 0; v < npointsV; v++) {
                            A.push(controlPoints[0]);
                            controlPoints.splice(0, 1);
                        }
                        CP.push(A);
                    }

                    args.push(npointsU, npointsV, npartsU1, npartsV1, CP);

                    this.primitives[primitiveId] = new Patch(this.scene, args);

                    break;

                case 'vehicle':

                    this.primitives[primitiveId] = new Vehicle(this.scene);
                    break;

                case 'terrain':
                    args = [];

                    let idTexture = this.reader.getString(grandChildren[0], "idtexture");
                    let idheightmap = this.reader.getString(grandChildren[0], "idheightmap");

                    let parts = this.reader.getFloat(grandChildren[0], "parts");
                    let heightscale = this.reader.getFloat(grandChildren[0], "heightscale");
                    /*
                                        if (this.textures[idTexture] == null) {
                                            this.onXMLMinorError("Error parsing id texture for primitive Terrain with id : " + primitiveId);
                                            continue;
                                        }
                                        else if (this.textures[idheightmap] == null) {
                                            this.onXMLMinorError("Error parsing id height map for primitive Terrain with id : " + primitiveId);
                                            continue;
                                        }*/

                    args = [idTexture, idheightmap, parts, heightscale];

                    this.primitives[primitiveId] = new Terrain(this.scene, this, args);

                    break;

                case 'water':
                    args = [];
                    let idTexture2 = this.reader.getString(grandChildren[0], "idtexture");
                    let idwavemap = this.reader.getString(grandChildren[0], "idwavemap");

                    let parts2 = this.reader.getFloat(grandChildren[0], "parts");
                    let heightscale2 = this.reader.getFloat(grandChildren[0], "heightscale");
                    let texscale2 = this.reader.getFloat(grandChildren[0], "texscale");


                    /*if (this.textures[idTexture2] == null) {
                        this.onXMLMinorError("Error parsing id texture for primitive Terrain with id : " + primitiveId);
                        continue;
                    }
                    else if (this.textures[idwavemap] == null) {
                        this.onXMLMinorError("Error parsing id height map for primitive Terrain with id : " + primitiveId);
                        continue;
                    }*/

                    args = [idTexture2, idwavemap, parts2, heightscale2, texscale2];
                    this.primitives[primitiveId] = new Water(this.scene, this, args);

                    break;

                default:
                    this.onXMLError("no primitive with that name, on primitive with id: " + primitiveId);
                    break;
            }



        }


        this.log("Parsed primitives block");
        return null;
    }

    parseAnimations(animationsNode) {
        let children = animationsNode.children;
        let grandChildren = [];

        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName != "linear" && children[i].nodeName != "circular") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            let animationId = this.reader.getString(children[i], 'id');
            if (animationId == null)
                return "no ID defined for animation";

            //get span of animation
            let span = this.reader.getFloat(children[i], 'span');
            if (span == null)
                return "no span defined for animation with id: " + animationId;

            //create array to save array with control points
            let controlpoints = new Array();

            switch (children[i].nodeName) {
                case 'linear':
                    grandChildren = children[i].children;

                    if (grandChildren.length == 0) {
                        return "no control point declared for animation with id: " + animationId;
                    }
                    for (let j = 0; j < grandChildren.length; j++) {
                        if (grandChildren[j].nodeName != "controlpoint") {
                            this.onXMLMinorError("error with tag controlpoint in animation with id: " + animationId);
                            continue;
                        }

                        let controlpoint = [];
                        let xx = this.reader.getFloat(grandChildren[j], 'xx');
                        let yy = this.reader.getFloat(grandChildren[j], 'yy');
                        let zz = this.reader.getFloat(grandChildren[j], 'zz');

                        controlpoint = [xx, yy, zz];

                        controlpoints.push(controlpoint);
                    }
                    this.animations[animationId] = new LinearAnimation(this.scene, animationId, span, controlpoints);
                    break;

                case 'circular':
                    let radius = this.reader.getFloat(children[i], 'radius');
                    let startang = this.reader.getFloat(children[i], 'startang');
                    let rotang = this.reader.getFloat(children[i], 'rotang');
                    let center = this.reader.getString(children[i], 'center').split(" ");

                    radius = DEGREE_TO_RAD * radius;
                    startang = DEGREE_TO_RAD * startang;
                    rotang = DEGREE_TO_RAD * rotang;

                    this.animations[animationId] = new CircularAnimation(this.scene, animationId, span, center, radius, startang, rotang);
                    break;

            }





        }

        this.log("Parsed animations block");
        return null;
    }
    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {
        let children = componentsNode.children;

        let grandChildren = [];

        let counter = 0;

        //checks for root id
        for (let i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.onXMLError("tag <component> missing or misspelled");
                return;
            }



            //retrieves node id
            let nodeId = this.reader.getString(children[i], "id");

            if (nodeId == null) {
                this.onXMLError("node id cant be null");
                return;
            }

            if (this.nodes[nodeId] != null) {
                this.onXMLError("there cant be two or more components with the same id: " + nodeId);
                return;
            }

            //calls node constructor
            let node = new Node(this);

            //set id for this node
            node.id = nodeId;

            //parse the components of component 
            grandChildren = children[i].children;

            for (let j = 0; j < grandChildren.length; j++) {
                let nodename = grandChildren[j].nodeName;
                if (nodename != "transformation" && nodename != "materials" && nodename != "texture" && nodename != "children" && nodename != "animations") {
                    this.onXMLError("Tag missing or out of place: " + nodename + " in node with id: " + nodeId);
                    return;
                }

                let grandgrandChildren = grandChildren[j].children;
                //parses tranformations
                if (grandChildren[j].nodeName == "transformation") {

                    if (grandgrandChildren.length != 0) {
                        if (grandgrandChildren[0].nodeName == "transformationref") {
                            let transformationrefId = this.reader.getString(grandgrandChildren[0], "id");

                            if (this.transformations[transformationrefId] != null) {
                                node.transformMatrix = this.transformations[transformationrefId];
                            }
                            else {
                                this.onXMLMinorError("there's no transformationref with that id, error on component id :" + nodeId);
                                return;
                            }
                        }
                        else {
                            for (let k = 0; k < grandgrandChildren.length; k++) {

                                let transformationName = grandgrandChildren[k].nodeName;
                                if (transformationName == "translate") {

                                    let x = this.reader.getFloat(grandgrandChildren[k], 'x');
                                    let y = this.reader.getFloat(grandgrandChildren[k], 'y');
                                    let z = this.reader.getFloat(grandgrandChildren[k], 'z');

                                    let translateCoords = [x, y, z];

                                    mat4.translate(node.transformMatrix, node.transformMatrix, translateCoords);

                                }
                                else if (transformationName == "scale") {
                                    let x = this.reader.getFloat(grandgrandChildren[k], 'x');
                                    let y = this.reader.getFloat(grandgrandChildren[k], 'y');
                                    let z = this.reader.getFloat(grandgrandChildren[k], 'z');

                                    let scaleCoords = [x, y, z];

                                    mat4.scale(node.transformMatrix, node.transformMatrix, scaleCoords);


                                }
                                else if (transformationName == "rotate") {
                                    let axis = this.reader.getString(grandgrandChildren[k], 'axis');
                                    let angle = this.reader.getFloat(grandgrandChildren[k], 'angle');
                                    let rotateCoords = [];

                                    switch (axis) {
                                        case 'x':
                                            rotateCoords = [1, 0, 0];
                                            break;
                                        case 'y':
                                            rotateCoords = [0, 1, 0];
                                            break;
                                        case 'z':
                                            rotateCoords = [0, 0, 1];
                                            break;
                                    }

                                    let angleRad = angle * DEGREE_TO_RAD; //now we have rads

                                    mat4.rotate(node.transformMatrix, node.transformMatrix, angleRad, rotateCoords);

                                }
                                else {
                                    this.onXMLMinorError("error parsing tag of transformation in component with id: " + nodeId);
                                    return;
                                }

                            }



                        }

                    }
                }

                //parse animations
                else if (grandChildren[j].nodeName == "animations") {
                    if (grandgrandChildren.length != 0) {
                        for (let k = 0; k < grandgrandChildren.length; k++) {
                            if (grandgrandChildren[k].nodeName == "animationref") {
                                let animationId = this.reader.getString(grandgrandChildren[k], 'id');
                                if (this.animations[animationId] == null) {
                                    this.onXMLMinorError("No animation with that id: " + animationId);
                                    continue;
                                }
                                else {
                                    node.addAnimation(animationId);
                                }
                            }
                        }

                    }
                }
                //parses materials
                else if (grandChildren[j].nodeName == "materials") {
                    if (grandgrandChildren.length != 0) {
                        for (let k = 0; k < grandgrandChildren.length; k++) {
                            if (grandgrandChildren[k].nodeName != "material") {
                                this.onXMLError("unknown tag for material in component with id: " + nodeId);
                                return;
                            }

                            let materialId = this.reader.getString(grandgrandChildren[k], "id");

                            if (this.materials[materialId] == null && materialId != "inherit") {
                                this.onXMLError("there's no material with that id, on component id: " + nodeId);
                                return;
                            }

                            if (materialId == "inherit" && grandgrandChildren.length > 1) {
                                this.onXMLError("if you inherit the materials from his father, you cant declare more, error in component with id: " + nodeId);
                                return;
                            }

                            if (materialId != "inherit") {
                                node.materials.push(materialId);
                            }
                            else node.materials = null;

                        }


                    }
                    else {
                        this.onXMLError("At least one material must be defined, error parsing component with id: " + nodeId);
                        return;
                    }


                }

                //parse texture
                else if (grandChildren[j].nodeName == "texture") {
                    let textureId = this.reader.getString(grandChildren[j], "id");


                    if (this.textures[textureId] == null && textureId != "none" && textureId != "inherit") {
                        this.onXMLError("error parsing texture, no id recognized in component with id: " + nodeId);
                        return;
                    }

                    if (textureId != "none") {
                        let amp_s = this.reader.getFloat(grandChildren[j], "length_s");
                        let amp_t = this.reader.getFloat(grandChildren[j], "length_t");

                        if (amp_s < 0 || amp_t < 0) {
                            this.onXMLError("error parsing texture, amplification factors must be positive, error in component with id:  " + nodeId);
                            return;
                        }
                        node.texture = [textureId, amp_s, amp_t];

                    }
                    else node.texture = [textureId]; //case none
                }

                //parse children
                else if (grandChildren[j].nodeName == "children") {

                    if (grandgrandChildren.length != 0) {
                        for (let k = 0; k < grandgrandChildren.length; k++) {
                            if (grandgrandChildren[k].nodeName != "componentref" && grandgrandChildren[k].nodeName != "primitiveref") {
                                this.onXMLError("primitiveref or componentref declarations only, error in component with id: " + nodeId);
                                return;
                            }

                            if (grandgrandChildren[k].nodeName == "componentref") {
                                let componentrefId = this.reader.getString(grandgrandChildren[k], "id");
                                if (componentrefId == -1) {
                                    this.onXMLMinorError("error parsing id of componentref for component id: " + nodeId);
                                    continue;
                                }

                                node.addChild(componentrefId);
                            }
                            else { //for primitives
                                let primitiveId = this.reader.getString(grandgrandChildren[k], "id");

                                if (primitiveId == -1) {
                                    this.onXMLMinorError("error parsing id of primitiveref for component id: " + nodeId);
                                    continue;
                                }

                                if (this.primitives[primitiveId] == null) {
                                    this.onXMLError("no primitive with that id in component " + nodeId);
                                    return;
                                }

                                node.setPrimitive(primitiveId);
                            }


                        }


                    }
                    else {
                        this.onXMLError("component must have at least one child, error in component with id: ", nodeId);
                        return;
                    }

                }
            }

            this.nodes[nodeId] = node;


        }

        //this.printNodes();

        this.log("Parsed components block");
        return null;
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
     * Print info about all nodes in array this.nodes
     */
    printNodes() {
        console.log("Information about Nodes:")
        for (var key in this.nodes) {
            this.log("           NodeId: " + key);
            for (var material in this.nodes[key].materials) {
                this.log("materialId: " + material);
            }
            this.log("textureId: " + this.nodes[key].texture[0]);
            this.log("components IDS: ")
            for (let i = 0; i < this.nodes[key].componentRef.length; i++) {
                this.log(this.nodes[key].componentRef[i]);
            }
            if (this.nodes[key].primitive != null) {
                this.log("primitive ID: " + this.nodes[key].primitive);
            }

        }
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Checks if a number is a power of two, needed to verify textures amplif_factor 
     */
    power_of_2(n) {
        return n && (n & (n - 1)) === 0;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene(currentNode) {


        let material = null;
        let texture = null;

        if (currentNode != null) {

            let newNode = this.nodes[currentNode];


            if (newNode.materials != null) { //if node has its own materials 
                this.scene.materials = [];

                for (let i = 0; i < newNode.materials.length; i++) {
                    this.scene.materials.push(newNode.materials[i]); //push id of material in this node
                }

            }

            if (newNode.texture[0] != "none" && newNode.texture[0] != "inherit") {
                texture = this.textures[newNode.texture[0]]; //CFGTexture
                this.scene.previousTexture = texture;
            }

            if (newNode.texture[0] == "inherit") {
                texture = this.scene.previousTexture;
            }
            else if (newNode.texture[0] == "none") {
                texture = null;
            }


            this.scene.multMatrix(newNode.transformMatrix);

            if (newNode.animations != null) {
                for (let j = 0; j < newNode.animations.length; j++) {
                    let anim = this.animations[newNode.animations[j]];
                    anim.apply(this.scene.elapsedTime, newNode);
                    if (anim.done == false) {
                        break;
                    }
                }
            }


            if (newNode.primitive != null) {
                this.scene.pushMatrix();
                let primitive = this.primitives[newNode.primitive];
                this.materials[this.scene.materials[this.scene.materialIndex]].apply();
                if (texture != null) {
                    primitive.updateTextureScaling(newNode.texture[1], newNode.texture[2]);
                    texture.bind();
                }

                primitive.display();
                this.scene.popMatrix();
            }

            for (var i = 0; i < newNode.componentRef.length; i++) {
                this.scene.pushMatrix();
                this.displayScene(newNode.componentRef[i]);
                this.scene.popMatrix();
            }

        }
    }
}