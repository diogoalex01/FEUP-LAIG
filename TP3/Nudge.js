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
		this.gameOver = false;
		this.playMovie = 0;
		this.movieIndex = 0;
		this.movieStart = 0;
		this.initBuffers();
	}

	initBuffers() {
		this.board = new Board(this.scene);
		this.parser = new Parser(this.scene);
		this.movie = new Movie(this.scene);
	}

	updateGameMode(mode) {
		this.gameMode = parseInt(mode);
	}

	checkPick(id) { // nudges
		//console.log('check: ' + this.gameMode);
		switch (this.gameMode) {
			case 0:
				this.playerVsPlayer(id);
				break;
			case 1:
				this.playerVsAI(id);
				break;

			default:
				alert('Start by selecting the Game Mode!');
				this.scene.start = false;
		}
	}

	// Player vs Player
	playerVsPlayer(id) {
		//console.log("player: " + this.player);

		if (this.player > 4) {
			this.player = 1;
		}

		if (this.selectN == 0) {
			this.firstClick(id);
		}
		else if (this.player <= 2) {
			this.pieceMove(id, this.board.whiteVec, 'white', 'black');
			this.selectN = 0;
		}
		else if (this.player > 2) {
			this.pieceMove(id, this.board.blackVec, 'black', 'white');
			this.selectN = 0;
		}
	}

	firstClick(id) {
		this.selectN = 1;
		this.row = Math.floor(id / 5);
		this.col = id % 5;
	}

	pieceMove(id, pieces, player, other) { // add to movie.js
		var posX = Math.floor(id / 5);
		var posZ = id % 5;

		for (var i = 0; i < pieces.length; i++) {
			if (pieces[i].posX == this.row && pieces[i].posZ == this.col) {
				this.parser.makeMove(this.row + 1, this.col + 1, posX + 1, posZ + 1, player, other);
				if (this.parser.gameOver == 1) {
					this.gameOver = true;
					alert('Game Over!');
				}
				else if (this.parser.nudge == 'yes') {
					this.makeNudge(this.row, this.col, posX, posZ, 1, player);
					this.player++;
				}
				else if (this.parser.valid == 'yes') {
					pieces[i].updatePosition(posX, 1, posZ);
					this.movie.newMove(player, this.row + 1, this.col + 1, posX + 1, posZ + 1, 0, this.parser.board, this.player);
					this.player++;
				}
				else {
					//console.log("Invalid");
				}
			}
		}
	}

	makeNudge(lastRow, lastCol, newRow, newCol, saveState, color) {
		var hor;
		var type;
		var counter;

		// left nudge
		if (lastRow == newRow && lastCol > newCol) {
			hor = -1;
			type = "hor";
			counter = this.makeNudgeCounter(hor, type, lastRow, lastCol, newRow, newCol) * -1;
		}
		// right nudge
		else if (lastRow == newRow && lastCol < newCol) {
			hor = 1;
			type = "hor";
			counter = this.makeNudgeCounter(hor, type, lastRow, lastCol, newRow, newCol);
		}
		// up nudge
		else if (lastRow > newRow && lastCol == newCol) {
			hor = -1;
			type = "vert";
			counter = this.makeNudgeCounter(hor, type, lastRow, lastCol, newRow, newCol) * -1;
		}
		// down nudge
		else if (lastRow < newRow && lastCol == newCol) {
			hor = 1;
			type = "vert";
			counter = this.makeNudgeCounter(hor, type, lastRow, lastCol, newRow, newCol);
		}

		if (saveState) {
			this.movie.newMove(color, lastRow + 1, lastCol + 1, newRow + 1, newCol + 1, counter, this.parser.board, this.player, type);
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

		return pieceCounter;
	}

	makeNudgeMoveHor(firstCol, newRow, pieces, pieces2, pieceCounter, hor) {
		for (var j = 0; j <= pieceCounter; j++) {
			for (var i = 0; i < pieces.length; i++) {
				if (pieces[i].posX == newRow && pieces[i].posZ == firstCol) {
					pieces[i].updatePosition(newRow, 1, firstCol + hor);
				}

				if (pieces2[i].posX == newRow && pieces2[i].posZ == firstCol) {
					pieces2[i].updatePosition(newRow, 1, firstCol + hor);
				}
			}

			firstCol -= hor;
		}
	}

	makeNudgeMoveVert(firstRow, newCol, pieces, pieces2, pieceCounter, hor) {
		for (var j = 0; j <= pieceCounter; j++) {
			for (var i = 0; i < pieces.length; i++) {
				if (pieces[i].posX == firstRow && pieces[i].posZ == newCol) {
					pieces[i].updatePosition(firstRow + hor, 1, newCol);
				}

				if (pieces2[i].posX == firstRow && pieces2[i].posZ == newCol) {
					pieces2[i].updatePosition(firstRow + hor, 1, newCol);
				}
			}

			firstRow -= hor;
		}
	}

	// Player vs AI
	playerVsAI(id) {
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

			this.pieceMove(id, this.board.whiteVec, 'white', 'black');
		}

		if (this.player == 3) {
			this.aiMove(this.board.blackVec, 'black', this.parser.makeMoveAi('black', 'white'), 1);
			this.secondAiMove(this.board.blackVec, 'black', this.parser.makeMoveAi('black', 'white'));
			this.selectN = 0;
			this.player++;
		}
	}

	aiMove(pieces, color, moves, saveState) {
		var lastRow = moves[0] - 1;
		var lastCol = moves[1] - 1;
		var newRow = moves[2] - 1;
		var newCol = moves[3] - 1;

		if (this.hasPiece(newRow, newCol)) {
			this.makeNudge(lastRow, lastCol, newRow, newCol, saveState, color);
			var nudge = 1;
		}
		else {
			for (var i = 0; i < pieces.length; i++) {
				//console.log("posX: " + pieces[i].posX);
				//console.log("lastRow: " + lastRow);
				//console.log("posZ: " + pieces[i].posZ);
				//console.log("lastCol: " + lastCol);
				if (pieces[i].posX == lastRow && pieces[i].posZ == lastCol) {
					pieces[i].updatePosition(newRow, 1, newCol);
					if (saveState) {
						this.movie.newMove(color, lastRow + 1, lastCol + 1, newRow + 1, newCol + 1, nudge, this.parser.board, this.player);
					}
				}
			}
		}
	}

	secondAiMove(pieces, color, moves) {
		var lastRow2 = moves[4] - 1;
		var lastCol2 = moves[5] - 1;
		var newRow2 = moves[6] - 1;
		var newCol2 = moves[7] - 1;

		if (this.parser.gameOver == 1) {
			this.gameOver = true;
			//console.log('end Over!');
		}
		else if (this.hasPiece(newRow2, newCol2)) {
			this.makeNudge(lastRow2, lastCol2, newRow2, newCol2, 1, color);
		}
		else {
			for (var i = 0; i < pieces.length; i++) {
				if (pieces[i].posX == lastRow2 && pieces[i].posZ == lastCol2) {
					pieces[i].updatePosition(newRow2, 1, newCol2);
					this.movie.newMove(color, lastRow2 + 1, lastCol2 + 1, newRow2 + 1, newCol2 + 1, 0, this.parser.board, this.player);
				}
			}
		}
	}

	hasPiece(row, col) {
		var pieces = this.board.whiteVec;
		var pieces2 = this.board.blackVec;

		for (var i = 0; i < pieces.length; i++) {
			if (pieces[i].posX == row && pieces[i].posZ == col) {
				return true;
			}
		}
		//console.log("no white");
		for (var i = 0; i < pieces2.length; i++) {
			if (pieces2[i].posX == row && pieces2[i].posZ == col) {
				return true;
			}
		}
		//console.log("no black");
		return false;
	}

	// AI vs AI
	aIVsAI() {
		//console.log("player: " + this.player);
		//console.log("select: " + this.selectN);
		if (this.player == 1) {
			var moves = this.parser.makeMoveAi('white', 'black');
			this.aiMove(this.board.whiteVec, 'white', moves, 1);
			this.secondAiMove(this.board.whiteVec, 'white', moves);
			this.player = 2;
		}

		if (this.player == 2) {
			var moves = this.parser.makeMoveAi('black', 'white')
			this.aiMove(this.board.blackVec, 'black', moves, 1);
			this.secondAiMove(this.board.blackVec, 'black', moves);
			this.player = 1;
		}
	}

	undo() {
		var moves = this.movie.lastMove();

		if (moves == 0) {
			return;
		}

		var color = moves[4];
		var pieces;

		if (color == "white") {
			pieces = this.board.whiteVec;
		}
		else {
			pieces = this.board.blackVec;
		}

		this.aiMove(pieces, color, moves, 0);
		this.parser.board = moves[5];
		this.parser.previousBoard[6];
		this.player = moves[7];
	}

	gameMovie() {
		if (this.movieStart == 0) {
			this.movieStart = 1;
			this.board.setOriginal();
			return;
		}

		var moves = this.movie.getMoves();

		if (this.movieIndex == moves.length) {
			this.movieIndex = 0;
			this.playMovie = 0;
			this.movieStart = 0;
			return;
		}

		var color = moves[this.movieIndex].color;
		var pieces;

		if (color == "white") {
			pieces = this.board.whiteVec;
		}
		else {
			pieces = this.board.blackVec;
		}

		var mov = [];
		mov.push(moves[this.movieIndex].lastRow);
		mov.push(moves[this.movieIndex].lastColumn);
		mov.push(moves[this.movieIndex].newRow);
		mov.push(moves[this.movieIndex].newColumn);

		this.aiMove(pieces, color, mov, 0);
		this.movieIndex++;
	}

	restartGame() {
		this.movie.resetMoves();
		this.board.setOriginal();
		this.movieIndex = 0;
		this.playMovie = 0;
		this.movieStart = 0;
		this.selectN = 0;
		this.player = 1;
		this.initBuffers();
	}

	display() {
		this.board.display();
	}
}
