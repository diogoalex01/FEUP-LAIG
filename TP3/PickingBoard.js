/**
 * PickingBoard
 * @constructor
 * @param scene - Reference to MyScene object
 */
class PickingBoard extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
		this.scene = scene;
	}

	initBuffers() {
		this.rectangle = new MyRectangle(this.scene, 'rec', -0.5, 0.5, -0.5, 0.5)
	}

	display() {

		if (this.scene.pickMode == true) {
			for (var i = 0; i < 5; i++) {
				for (var j = 0; j < 5; j++) {
					this.scene.registerForPick(i * 5 + j, this.rectangle);
					this.scene.pushMatrix();
					this.scene.translate(-11.2 + 6 * i, 2, 11.8 - 6 * j);
					this.scene.scale(5.5, 5.5, 5.5);
					this.scene.rotate(-Math.PI / 2, 1, 0, 0);
					this.rectangle.display();
					this.scene.popMatrix();
				}
			}
		}
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
