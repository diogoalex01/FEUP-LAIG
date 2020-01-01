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
		let move = new Move(this.scene, color, lastRow, lastColumn, newRow, newColumn);
		this.moves.push(move);
	}

	undo() {
		let len = this.moves.length;
		
		if (len <= 0) {
			alert('You\'re in the original state');
			return;
		}

		let moves = [];
		moves.push(this.moves[len - 1].newRow);
		moves.push(this.moves[len - 1].newCol);
		moves.push(this.moves[len - 1].lastRow);
		moves.push(this.moves[len - 1].lastRow);
		this.moves.pop();

		return moves;
	}
}
