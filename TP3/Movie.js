/**
 * Movie
 * @constructor
 * @param scene - Reference to MyScene object
 */
class Movie extends CGFobject {
	constructor(scene) {
		super(scene);
		this.scene = scene;
		this.initialBoard = '[[empty,empty,empty,empty,empty],[empty,white,white,white,empty],[empty,empty,empty,empty,empty],[empty,black,black,black,empty],[empty,empty,empty,empty,empty]]';
		this.moves = [];
	}

	newMove(color, lastRow, lastColumn, newRow, newColumn, nudge, board, player, dir) {
		let move = new Move(this.scene, color, lastRow, lastColumn, newRow, newColumn, nudge, board, player, dir);
		this.moves.push(move);
	}

	lastMove() {
		let len = this.moves.length;

		if (len < 1) {
			alert('You\'re in the original state!');
			return 0;
		}

		var lastRow = this.moves[len - 1].newRow;
		var lastCol = this.moves[len - 1].newColumn;
		var newRow = this.moves[len - 1].lastRow;
		var newCol = this.moves[len - 1].lastColumn;

		if (this.moves[len - 1].nudge != 0) {
			if (this.moves[len - 1].dir == "vert") {
				lastRow += this.moves[len - 1].nudge;
				newRow += this.moves[len - 1].nudge;
			}
			else if (this.moves[len - 1].dir == "hor") {
				lastCol += this.moves[len - 1].nudge;
				newCol += this.moves[len - 1].nudge;
			}
		}

		let moves = [];
		moves.push(lastRow);
		moves.push(lastCol);
		moves.push(newRow);
		moves.push(newCol);
		moves.push(this.moves[len - 1].color);

		if (len >= 3) {
			moves.push(this.moves[len - 2].board);
			moves.push(this.moves[len - 3].board);
		}
		else if (len == 2) {
			moves.push(this.moves[len - 2].board);
			moves.push(this.initialBoard);
		}
		else if (len == 1) {
			moves.push(this.initialBoard);
			moves.push(this.initialBoard);
		}

		moves.push(this.moves[len - 1].player);
		//mudar a board do parser 
		this.moves.pop();

		return moves;
	}
}
