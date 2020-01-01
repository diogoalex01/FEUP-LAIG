/**
 * Movie
 * @constructor
 * @param scene - Reference to MyScene object
 */
class Movie extends CGFobject {
	constructor(scene) {
		super(scene);
		this.scene = scene;
		this.moves = [];
	}

	newMove(color, lastRow, lastColumn, newRow, newColumn, nudge, board) {
		let move = new Move(this.scene, color, lastRow, lastColumn, newRow, newColumn, nudge, board);
		this.moves.push(move);
	}

	undo() {
		let len = this.moves.length;
		
		if (len <= 0) {
			alert('You\'re in the original state!');
			return;
		}

		let moves = [];
		moves.push(this.moves[len - 1].newRow);
		moves.push(this.moves[len - 1].newCol);
		moves.push(this.moves[len - 1].lastRow);
		moves.push(this.moves[len - 1].lastRow);

		//mudar a board do parser 
		this.moves.pop();

		return moves;
	}
}
