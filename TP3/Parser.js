/**
 * Parse
 * @constructor
 * @param scene - Reference to MyScene object
 */
class Parser extends CGFobject {
	constructor(scene) {
		super(scene);
		this.scene = scene;
		this.board = '[[empty,empty,empty,empty,empty],[empty,white,white,white,empty],[empty,empty,empty,empty,empty],[empty,black,black,black,empty],[empty,empty,empty,empty,empty]]';
		this.previousBoard = '[[empty,empty,empty,empty,empty],[empty,white,white,white,empty],[empty,empty,empty,empty,empty],[empty,black,black,black,empty],[empty,empty,empty,empty,empty]]';
		this.data;
		this.gameOver;
		this.valid;
		this.nudge;
	}

	makeMove(lastRow, lastCol, newRow, newCol, player, other) {

		var ry = 'move(' + lastRow + ',' + lastCol + ',' + newRow + ',' + newCol + ',' + player + ',' + other + ',' + this.board + ',' + this.previousBoard + ')';
		console.log(this.board);

		this.makeRequest(ry);
		this.answer();
	}

	getPrologRequest(requestString, onSuccess, onError, port) {
		var requestPort = port || 8081
		var request = new XMLHttpRequest();
		request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, false);

		request.onload = onSuccess || function (data) { console.log("Request successful. Reply: " + data.target.response); };
		request.onerror = onError || function () { console.log("Error waiting for response"); };

		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.send();
	}

	answer() {
		var ans = this.data;
		console.log("asss");
		console.log(ans);
		var i = 1;
		var start = 1;

		var valid = ans.match(/\[.{2,3}\,/)[0];
		console.log(valid.length - 1);
		this.valid = valid.substring(1, valid.length - 1);
		var nudge = ans.match(/\,.{2,3}\,/)[0];
		this.nudge = nudge.substring(1, nudge.length - 1);

		if (this.valid == "yes") {
			this.previousBoard = this.board;
			var board = ans.match(/\[{2}.*\]{2}/)[0];
			this.board = board.substring(0, board.length - 1);
			console.log("board");
			console.log(this.board);
			var gameOver = ans.match(/\,.{1}\,\[{2}/)[0];
			this.gameOver = gameOver.substring(1, 2);
			console.log("gameOver");
			console.log(this.gameOver);
		}

		console.log("valid");
		console.log(this.valid);
		console.log("nudge");
		console.log(this.nudge);
	}
	

	makeRequest(command) {
		// Get Parameter Values
		console.log("Req " + command);
		// Make Request
		this.getPrologRequest(command, this.handleReply.bind(this));
		console.log("try");
		console.log(this.data);
	}

	//Handle the Reply
	handleReply(data) {
		this.data = data.target.response;
		console.log("kkkk");
		console.log(this.data);
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
