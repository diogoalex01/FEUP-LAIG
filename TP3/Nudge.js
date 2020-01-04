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
		this.movement = false;
		this.playMovie = 0;
		this.movieIndex = 0;
		this.movieStart = 0;
		this.whiteScore = 0;
		this.blackScore = 0;
		this.currentP = 1;
		document.getElementById("score").innerText = "White: " + this.whiteScore + " Black: " + this.blackScore;
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
		if (this.player > 4) {
			this.player = 1;
		}

		if (this.selectN == 0) {
			this.firstClick(id);
		}
		else if (this.player <= 2) {
			this.currentP = 1;
			this.pieceMove(id, this.board.whiteVec, 'white', 'black');
			this.selectN = 0;

			if (this.player == 3) {
				this.scene.rotateCamera = true;
			}
		}
		else if (this.player > 2) {
			this.currentP = 2;
			this.pieceMove(id, this.board.blackVec, 'black', 'white');
			this.selectN = 0;

			if (this.player == 5) {
				this.scene.rotateCamera = true;
			}
		}
	}

	firstClick(id) {
		this.selectN = 1;
		this.row = Math.floor(id / 5);
		this.col = id % 5;
		var pieces = this.board.whiteVec;
		var pieces2 = this.board.blackVec;

		if (this.player <= 2) {
			for (var i = 0; i < pieces.length; i++) {
				if (pieces[i].posX == this.row && pieces[i].posZ == this.col) {
					console.log("Y : " + pieces[i].posY);
					pieces[i].jump();
				}
			}
		}
		else {
			//console.log("no white");
			for (var i = 0; i < pieces2.length; i++) {
				if (pieces2[i].posX == this.row && pieces2[i].posZ == this.col) {
					console.log("Y : " + pieces2[i].posY);
					pieces2[i].jump();
				}
			}
		}

		console.log(id);
		console.log("first click row", this.row);
		console.log("first click col", this.col);
	}

	pieceMove(id, pieces, player, other) { // add to movie.js
		var posX = Math.floor(id / 5);
		var posZ = id % 5;

		for (var i = 0; i < pieces.length; i++) {
			console.log("pox " + this.row);
			console.log("poZ " + this.col);
			console.log("newR " + posX);
			console.log("newC " + posZ);
			if (pieces[i].posX == this.row && pieces[i].posZ == this.col) {
				pieces[i].land();
				this.parser.makeMove(this.row + 1, this.col + 1, posX + 1, posZ + 1, player, other);

				if (this.parser.gameOver == 1) {
					this.gameOver = true;
					if(this.player == 2 || this.player == 4){
						this.updateScore(player);
					}
					else{
						this.updateScore(other);
					}
					alert('Game Over!');
				}
				else if (this.parser.nudge == 'yes') {
					this.makeNudge(this.row, this.col, posX, posZ, 1, player);
					this.player++;
				}
				else if (this.parser.valid == 'yes') {
					pieces[i].moveTo(posX, 1, posZ);
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
					pieces[i].moveTo(newRow, 1, firstCol + hor);
				}

				if (pieces2[i].posX == newRow && pieces2[i].posZ == firstCol) {
					pieces2[i].moveTo(newRow, 1, firstCol + hor);
				}
			}

			firstCol -= hor;
		}
	}

	makeNudgeMoveVert(firstRow, newCol, pieces, pieces2, pieceCounter, hor) {
		for (var j = 0; j <= pieceCounter; j++) {
			for (var i = 0; i < pieces.length; i++) {
				if (pieces[i].posX == firstRow && pieces[i].posZ == newCol) {
					pieces[i].moveTo(firstRow + hor, 1, newCol);
				}

				if (pieces2[i].posX == firstRow && pieces2[i].posZ == newCol) {
					pieces2[i].moveTo(firstRow + hor, 1, newCol);
				}
			}

			firstRow -= hor;
		}
	}

	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	// Player vs AI
	playerVsAI(id) {
		if (this.selectN == 0) {
			this.firstClick(id);
		}
		else if (this.player < 3) {
			if (this.player == 1) {
				this.currentP = 1;
				this.selectN = 0;
			}

			this.pieceMove(id, this.board.whiteVec, 'white', 'black');

			if (this.player == 3) {
				this.scene.rotateCamera = true;
			}
		}

		if (this.player == 3) {
			this.currentP = 2;
			this.movement = true;
		}
	}

	aiMove(pieces, color, moves, saveState) {
		var lastRow = moves[0] - 1;
		var lastCol = moves[1] - 1;
		var newRow = moves[2] - 1;
		var newCol = moves[3] - 1;
		console.log("lastRow: " + lastRow);
		console.log("lastCol: " + lastCol);
		console.log("newRow: " + newRow);
		console.log("newCol: " + newCol);
		if (this.hasPiece(newRow, newCol)) {
			this.makeNudge(lastRow, lastCol, newRow, newCol, saveState, color);
			var nudge = 1;
		}
		else {
			for (var i = 0; i < pieces.length; i++) {

				if (pieces[i].posX == lastRow && pieces[i].posZ == lastCol) {
					pieces[i].moveTo(newRow, 1, newCol);
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
		console.log("lastRow: " + lastRow2);
		console.log("lastCol: " + lastCol2);
		console.log("newRow: " + newRow2);
		console.log("newCol: " + newCol2);
		if (this.parser.gameOver == 1) {
			this.gameOver = true;
			this.updateScore(color);
			alert("Game Over");
			//console.log('end Over!');
		}
		else if (this.hasPiece(newRow2, newCol2)) {
			this.makeNudge(lastRow2, lastCol2, newRow2, newCol2, 1, color);
		}
		else {
			for (var i = 0; i < pieces.length; i++) {
				if (pieces[i].posX == lastRow2 && pieces[i].posZ == lastCol2) {
					pieces[i].moveTo(newRow2, 1, newCol2);
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

		return false;
	}

	// AI vs AI
	aIVsAI(color) {
		//console.log("select: " + this.selectN);
		if (color == "white") {
			this.currentP = 1;
			this.moves = this.parser.makeMoveAi('white', 'black');
			this.aiMove(this.board.whiteVec, 'white', this.moves, 1);
		}
		else {
			this.currentP = 2;
			this.moves = this.parser.makeMoveAi('black', 'white')
			this.aiMove(this.board.blackVec, 'black', this.moves, 1);
		}
	}

	secAIVsAI(color) {
		//console.log("select: " + this.selectN);
		if (color == "white") {
			this.currentP = 1;
			this.secondAiMove(this.board.whiteVec, 'white', this.moves);
			this.player = 2;
		}
		else {
			this.currentP = 2;
			this.secondAiMove(this.board.blackVec, 'black', this.moves);
			this.player = 1;
		}
	}

	undo() {
		var moves = this.movie.lastMove();

		if (moves == 0 || this.movieStart == 1) {
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
		this.whiteScore = 0;
		this.blackScore = 0;
		document.getElementById("score").innerText = "White: " + this.whiteScore + " Black: " + this.blackScore;
		this.initBuffers();
	}

	updateScore(other) {
		if (other == "white") {
			this.whiteScore += 1;
		}
		else if (other == "black") {
			this.blackScore += 1;
		}
		document.getElementById("score").innerText = "White: " + this.whiteScore + " Black: " + this.blackScore;
	}
	setScore(){
		document.getElementById("score").innerText = "White: " + this.whiteScore + " Black: " + this.blackScore;
	}
	updatePlayerTurn(nextPlayer) {

	}

	display() {
		this.board.display();
	}
}
