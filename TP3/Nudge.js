/**
 * Nudge
 * @constructor
 * @param scene - Reference to MyScene object
 */
class Nudge extends CGFobject {
	constructor(scene) {
		super(scene);
		this.selectN = 0;
		this.player = 1;
		this.row;
		this.col;
		this.gameState = 1; //1 - P/P 2- P/M 3- M/M
		this.scene = scene;
		this.initBuffers();
	}

	initBuffers() {
		this.board = new Board(this.scene);
		this.parser = new Parser(this.scene);
	}

	checkPick(id) { // nudges
		switch (this.gameState) {
			case 1:
				this.playerVsPlayer(id);
				break;
			case 2:
				this.playerVsAI(id);
				break;
		}
	}

	// Player vs Player
	playerVsPlayer(id) {
		console.log("player");
		console.log(this.player);

		if (this.player > 4) {
			this.player = 1;
		}

		if (this.selectN == 0) {
			this.firstClick(id);
		}
		else if (this.player <= 2) {
			console.log("hello3");
			this.pieceMove(id, this.board.whiteVec, 'white', 'black');
		}
		else if (this.player > 2) {

			console.log("hello4");
			this.pieceMove(id, this.board.blackVec, 'black', 'white');
		}
	}

	firstClick(id) {
		this.selectN = 1;
		this.row = Math.floor(id / 5);
		this.col = id % 5;
	}

	pieceMove(id, pieces, player, other) {
		this.selectN = 0;
		var posX = Math.floor(id / 5);
		var posZ = id % 5;
		console.log(posX);
		console.log(posZ);
		for (var i = 0; i < pieces.length; i++) {
			if (pieces[i].posX == this.row && pieces[i].posZ == this.col) {
				this.parser.makeMove(this.row + 1, this.col + 1, posX + 1, posZ + 1, player, other);

				if (this.parser.valid == 'yes') {
					pieces[i].updatePosition(posX, 1, posZ);
					this.player++;
				}
				else {
					console.log("Invalid");
				}
			}
		}
	}

	// Player vs AI
	playerVsAI(id) {

		if (this.player > 4) {
			this.player = 1;
		}

		if (this.selectN == 0) {
			this.firstClick(id);
		}
		else if (this.player <= 2) {
			console.log("hello3");
			this.pieceMove(id, this.board.whiteVec, 'white', 'black');
		}
		else if (this.player > 2) {

			console.log("hello4");
			this.pieceMove(id, this.board.blackVec, 'black', 'white');
		}
	}

	display() {
		this.board.display();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.updateTexCoordsGLBuffers();
	}

	updateLengthT(l) {
	}

	updateLengthS(l) {
	}
}
