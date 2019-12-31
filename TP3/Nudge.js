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
		this.gameState = 2; //1 - P/P 2- P/M 3- M/M
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
			this.selectN = 0;
		}
		else if (this.player > 2) {
			console.log("hello4");
			this.pieceMove(id, this.board.blackVec, 'black', 'white');
			this.selectN = 0;
		}
	}

	firstClick(id) {
		this.selectN = 1;
		this.row = Math.floor(id / 5);
		this.col = id % 5;
	}

	pieceMove(id, pieces, player, other) {
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
					console.log("select update: " + this.selectN);
				}
				else {
					console.log("Invalid");
				}
			}
		}
	}

	// Player vs AI
	playerVsAI(id) {
		console.log("player: " + this.player);
		console.log("select: " + this.selectN);
		if (this.player > 3) {
			this.player = 1;
		}

		if (this.selectN == 0) {
			this.firstClick(id);
		}
		else if (this.player < 3) {

			if (this.player == 1) {
				this.selectN = 0;
			}
			console.log("hello4");
			this.pieceMove(id, this.board.whiteVec, 'white', 'black');

		}
		if (this.player == 3) {
			console.log("hello3");
			this.aiMove(this.board.blackVec, 'black', 'white');
			this.selectN = 0;
		}
	}

	aiMove(pieces, color, other) {
		var moves = this.parser.makeMoveAi(color, other);
		var lastRow = moves[0] - 1;
		var lastCol = moves[1] - 1;
		var newRow = moves[2] - 1;
		var newCol = moves[3] - 1;
		console.dir(moves);
		for (var i = 0; i < pieces.length; i++) {
			if (pieces[i].posX == lastRow && pieces[i].posZ == lastCol) {
				pieces[i].updatePosition(newRow, 1, newCol);
			}
		}

		var lastRow2 = moves[4] - 1;
		var lastCol2 = moves[5] - 1;
		var newRow2 = moves[6] - 1;
		var newCol2 = moves[7] - 1;

		for (var i = 0; i < pieces.length; i++) {
			if (pieces[i].posX == lastRow2 && pieces[i].posZ == lastCol2) {
				pieces[i].updatePosition(newRow2, 1, newCol2);
			}
		}

		this.player++;
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
