/**
 * Node class, representing a graph node.
 */
class MyNode {
    /**
     * @constructor
     */
    constructor(nodeID, primitive) {
        this.nodeID = nodeID;
        this.matrix = null;
        this.material = [];
        this.currentMat = null;
        this.texture = null;
        this.descendants = [];
        this.primitive = primitive;
        this.length_s = null;
        this.length_t = null;
    }
}