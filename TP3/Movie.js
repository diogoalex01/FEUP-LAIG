/**
 * Movie
 * @constructor
 * @param scene - Reference to MyScene object
 */
class Movie extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
		this.scene = scene;
		this.moves = [];
	}

	newMove(color, lastRow, lastColumn, newRow, newColumn) {
		var move = new Move(this.scene, color, lastRow, lastColumn, newRow, newColumn);
		this.moves.push(move);
	}

	undo() {
		var moves = [];
		var len = this.move.length;
		moves.push(this.move[len].newRow);
		moves.push(this.move[len].newCol);
		moves.push(this.move[len].lastRow);
		moves.push(this.move[len].lastRow);
		this.move.pop();

		return moves;
	}
}
