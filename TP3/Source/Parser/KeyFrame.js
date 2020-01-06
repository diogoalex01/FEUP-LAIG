/**
 * KeyFrame class, representing a graph node.
 */
class KeyFrame {
    /**
     * @constructor
     */
    constructor(instant) {
        this.instant = instant;
        this.scale = null;
        this.translate = null;
        this.rotate = null;
    }
}