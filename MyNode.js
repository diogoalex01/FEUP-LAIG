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
        this.material = null;
        this.texture = null;
        this.descendants = [];
        this.primitive = null;
    }
}