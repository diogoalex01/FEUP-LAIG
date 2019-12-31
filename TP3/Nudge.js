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
		this.gameMode; // 0 - P/P | 1- P/AI | 2 - AI/AI
		this.scene = scene;
		this.initBuffers();
	}

	initBuffers() {
		this.board = new Board(this.scene);
		this.parser = new Parser(this.scene);
		this.movie = new Movie(this.scene);
	}

	updateGameMode(mode) {
		console.log(mode);
		this.gameMode = 1;
	}

	checkPick(id) { // nudges
		console.log(this.gameMode);
		switch (this.gameMode) {
			case 0:
				console.log('entrei');
				this.playerVsPlayer(id);
				break;
			case 1:
				this.playerVsAI(id);
				break;
			case 2:
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

	pieceMove(id, pieces, player, other) { //add to movie.js
		var posX = Math.floor(id / 5);
		var posZ = id % 5;
		console.log(posX);
		console.log(posZ);

		for (var i = 0; i < pieces.length; i++) {
			if (pieces[i].posX == this.row && pieces[i].posZ == this.col) {
				this.parser.makeMove(this.row + 1, this.col + 1, posX + 1, posZ + 1, player, other);
				if (this.parser.nudge == 'yes') {
					console.log("nudge");
					this.makeNudge(this.row, this.col, posX, posZ);
					this.player++;
				}
				else if (this.parser.valid == 'yes') {
					pieces[i].updatePosition(posX, 1, posZ);
					this.movie.newMove(player, this.row, this.col, posX, posZ);
					this.player++;
					console.log("select update: " + this.selectN);
				}
				else {
					console.log("Invalid");
				}
			}

		}
	}

	makeNudge(lastRow, lastCol, newRow, newCol) {
		var hor;
		var type;

		//left nudge
		if (lastRow == newRow && lastCol > newCol) {
			hor = -1;
			type = "hor";
			console.log("here");
			this.makeNudgeCounter(hor, type, lastRow, lastCol, newRow, newCol);
		}
		//right nudge
		else if (lastRow == newRow && lastCol < newCol) {
			hor = 1;
			type = "hor";
			console.log("here2");
			this.makeNudgeCounter(hor, type, lastRow, lastCol, newRow, newCol);
		}
		//up nudge
		else if (lastRow > newRow && lastCol == newCol) {
			hor = -1;
			type = "vert";
			console.log("here3");
			this.makeNudgeCounter(hor, type, lastRow, lastCol, newRow, newCol);
		}
		//down nudge
		else if (lastRow < newRow && lastCol == newCol) {
			hor = 1;
			type = "vert";
			console.log("here4");
			this.makeNudgeCounter(hor, type, lastRow, lastCol, newRow, newCol);
		}
	}

	makeNudgeCounter(hor, type, lastRow, lastCol, newRow, newCol) {
		var pieceCounter = 0;
		var found = false;
		var pieces = this.board.whiteVec;
		var pieces2 = this.board.blackVec;

		while (true) {
			for (var i = 0; i < pieces.length; i++) {
				if (pieces[i].posX == newRow && pieces[i].posZ == newCol || pieces2[i].posX == newRow && pieces2[i].posZ == newCol) {
					found = true;
				}
			}

			if (found) {

				found = false;
				pieceCounter++;
				console.log("found" + pieceCounter);
				if (type == "hor") {
					newCol += hor;
				}
				else {
					newRow += hor;
				}

			}
			else {
				break;
			}
		}

		if (type == "hor") {
			var firstCol = lastCol + hor * pieceCounter;
			this.makeNudgeMoveHor(firstCol, newRow, pieces, pieces2, pieceCounter, hor);
		}
		else {
			var firstRow = lastRow + hor * pieceCounter;
			this.makeNudgeMoveVert(firstRow, newCol, pieces, pieces2, pieceCounter, hor);
		}
	}

	makeNudgeMoveHor(firstCol, newRow, pieces, pieces2, pieceCounter, hor) {
		console.log("piece count" + pieceCounter);
		for (var j = 0; j <= pieceCounter; j++) {

			for (var i = 0; i < pieces.length; i++) {
				if (pieces[i].posX == newRow && pieces[i].posZ == firstCol) {
					console.log("change white");
					pieces[i].updatePosition(newRow, 1, firstCol + hor);
				}

				if (pieces2[i].posX == newRow && pieces2[i].posZ == firstCol) {
					console.log("change black");
					pieces2[i].updatePosition(newRow, 1, firstCol + hor);
				}
			}

			firstCol -= hor;
			console.log("piece count!" + pieceCounter);
			console.log("i!" + i);
		}
	}

	makeNudgeMoveVert(firstRow, newCol, pieces, pieces2, pieceCounter, hor) {
		console.log("piece count" + pieceCounter);
		for (var j = 0; j <= pieceCounter; j++) {

			for (var i = 0; i < pieces.length; i++) {
				if (pieces[i].posX == firstRow && pieces[i].posZ == newCol) {
					console.log("change white");
					pieces[i].updatePosition(firstRow + hor, 1, newCol);
				}

				if (pieces2[i].posX == firstRow && pieces2[i].posZ == newCol) {
					console.log("change black");
					pieces2[i].updatePosition(firstRow + hor, 1, newCol);
				}
			}

			firstRow -= hor;
			console.log("piece count!" + pieceCounter);
			console.log("i!" + i);
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
		if (this.hasPiece(newRow, newCol)) {
			this.makeNudge(lastRow, lastCol, newRow, newCol);
		}
		else {
			for (var i = 0; i < pieces.length; i++) {
				if (pieces[i].posX == lastRow && pieces[i].posZ == lastCol) {
					pieces[i].updatePosition(newRow, 1, newCol);
				}
			}
			this.movie.newMove(color, lastRow, lastCol, newRow, newCol);
		}

		var lastRow2 = moves[4] - 1;
		var lastCol2 = moves[5] - 1;
		var newRow2 = moves[6] - 1;
		var newCol2 = moves[7] - 1;

		if (this.hasPiece(newRow2, newCol2)) {
			this.makeNudge(lastRow2, lastCol2, newRow2, newCol2);
		}
		else {
			for (var i = 0; i < pieces.length; i++) {
				if (pieces[i].posX == lastRow2 && pieces[i].posZ == lastCol2) {
					pieces[i].updatePosition(newRow2, 1, newCol2);
				}
			}
			this.movie.newMove(color, lastRow2, lastCol2, newRow2, newCol2);
		}

		this.player++;
	}

	hasPiece(row, col) {
		var pieces = this.board.whiteVec;
		var pieces2 = this.board.blackVec;

		for (var i = 0; i < pieces.length; i++) {
			if (pieces[i].posX == row && pieces[i].posZ == col) {
				return true;
			}
		}
		console.log("no white");
		for (var i = 0; i < pieces2.length; i++) {
			if (pieces2[i].posX == row && pieces2[i].posZ == col) {
				return true;
			}
		}
		console.log("no black");
		return false;
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
