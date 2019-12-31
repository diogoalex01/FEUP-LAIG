/**
 * Move
 * @constructor
 * @param scene - Reference to MyScene object
 */
class Move extends CGFobject {
	constructor(scene, color, lastRow, lastColumn, newRow, newColumn) {
		super(scene);
		this.scene = scene;
		this.color = color;
		this.lastRow = lastRow;
		this.lastColumn = lastColumn;
		this.newRow = newRow;
		this.newColumn = newColumn;
	}
}
