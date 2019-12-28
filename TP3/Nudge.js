/**
 * Nudge
 * @constructor
 * @param scene - Reference to MyScene object
 */
class Nudge extends CGFobject {
	constructor(scene) {
		super(scene);
		this.selectN =0;
		this.row;
		this.col;
		this.initBuffers();
		this.scene = scene;
	}

	initBuffers() {
		this.board = new Board(this.scene);

	}
	checkPick(id) {


		console.log(this.selectN);

		if(this.selectN == 0)
		{
			console.log("hello2");
			this.selectN = 1;
			this.row =  Math.floor(id/5);
			this.col = id%5;
			console.log(this.row);
			console.log(this.col);
		}
		else{
			console.log("hello3");
			this.selectN = 0;
			var pieces = this.board.whiteVec;
			var posX = Math.floor(id/5);
			var posZ = id%5;
			console.log(posX);
			console.log(posZ);
			for(var i=0; i<pieces.length; i++)
			{
				if(pieces[i].posX == this.row && pieces[i].posZ == this.col) 
				{
					pieces[i].updatePosition(posX, 1, posZ);

				}
			}

		}

	}

	display() {
		this.board.display()
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
