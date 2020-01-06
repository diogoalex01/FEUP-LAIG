/**
 * Board
 * @constructor
 * @param scene - Reference to MyScene object
 */
class Board extends CGFobject {
	constructor(scene) {
		super(scene);
		this.whiteVec = [];
		this.blackVec = [];
		this.initBuffers();
		this.initMaterials();
		this.scene = scene;
	}

	initMaterials() {
		// Colors
		this.white = new CGFappearance(this.scene);
		this.white.setAmbient(0.5, 0.5, 0.5, 1);
		this.white.setDiffuse(0.5, 0.5, 0.5, 1);
		this.white.setSpecular(0.3, 0.3, 0.3, 1.0);
		this.white.setShininess(10.0);

		this.black = new CGFappearance(this.scene);
		this.black.setAmbient(0, 0, 0, 1);
		this.black.setDiffuse(0.05, 0.05, 0.05, 1);
		this.black.setSpecular(0.3, 0.3, 0.3, 1.0);
		this.black.setShininess(10.0);
	}

	initBuffers() {
		this.white1 = new MyPiece(this.scene, 1, 25, 25, 1, 1, 3);
		this.whiteVec.push(this.white1);
		this.white2 = new MyPiece(this.scene, 1, 25, 25, 1, 1, 2);
		this.whiteVec.push(this.white2);
		this.white3 = new MyPiece(this.scene, 1, 25, 25, 1, 1, 1);
		this.whiteVec.push(this.white3);

		this.black1 = new MyPiece(this.scene, 1, 25, 25, 3, 1, 3);
		this.blackVec.push(this.black1);
		this.black2 = new MyPiece(this.scene, 1, 25, 25, 3, 1, 2);
		this.blackVec.push(this.black2);
		this.black3 = new MyPiece(this.scene, 1, 25, 25, 3, 1, 1);
		this.blackVec.push(this.black3);
	}

	setOriginal() {
		this.white1.updatePosition(1, 1, 3);
		this.white2.updatePosition(1, 1, 2);
		this.white3.updatePosition(1, 1, 1);

		this.black1.updatePosition(3, 1, 3);
		this.black2.updatePosition(3, 1, 2);
		this.black3.updatePosition(3, 1, 1);
	}

	display() {
		this.white.apply();
		this.white1.display();
		this.white2.display();
		this.white3.display();

		this.black.apply();
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
