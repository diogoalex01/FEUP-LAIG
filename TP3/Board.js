/**
 * Board
 * @constructor
 * @param scene - Reference to MyScene object
 */
class Board extends CGFobject {
	constructor(scene) {
		super(scene);
		this.whiteVec=[];
		this.blackVec=[];
		this.initBuffers();
		this.scene = scene;
		
	}

	initBuffers() {
		this.white1 = new MyPiece(this.scene, 1, 25, 25, 3 , 1, 3);
		this.whiteVec.push(this.white1);
		this.white2 = new MyPiece(this.scene, 1, 25, 25, 3, 1, 2);
		this.whiteVec.push(this.white2);
		this.white3 = new MyPiece(this.scene, 1, 25, 25, 3, 1, 1);
		this.whiteVec.push(this.white3);
		this.black1 = new MyPiece(this.scene, 1, 25, 25, 1 , 1, 3);
		this.blackVec.push(this.black1);
		this.black2 = new MyPiece(this.scene, 1, 25, 25, 1, 1, 2);
		this.blackVec.push(this.black2);
		this.black3 = new MyPiece(this.scene, 1, 25, 25, 1, 1, 1);
		this.blackVec.push(this.black3);

	}

	display() {

		this.white1.display();
		this.white2.display();
		this.white3.display();

		this.black1.display();
		this.black2.display();
		this.black3.display();
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
