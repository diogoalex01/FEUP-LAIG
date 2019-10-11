/**
 * GraphNode class, representing a graph node.
 */
class GraphNode {
    /**
     * @constructor
     */
    constructor(nodeID) {
        this.nodeID = nodeID;
        this.mat = null;
        this.material = [];
        this.texture = null;
        this.descendants = [];
        this.primitive = null;
        this.length_s = null;
        this.length_t = null;
    }
}