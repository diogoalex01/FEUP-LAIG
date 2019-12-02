/**
 * Patch
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x - Scale of rectangle in X
 * @param y - Scale of rectangle in Y
 */
class Patch extends CGFobject {
	constructor(scene, npointsU, npointsV, npartsU, npartsV, controlPoints) {
		super(scene);
		this.npartsU = npartsU;
		this.npartsV = npartsV;
		this.npointsU = npointsU;
		this.npointsV = npointsV;
		this.controlPoints = controlPoints;

		this.initBuffers();
	}

	makeSurface(degree1, degree2, controlVertexes) {
		var nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlVertexes);
		this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	}

	initBuffers() {
		this.makeSurface(
			this.npointsU - 1, // degree on U
			this.npointsV - 1, // degree on V
			this.controlPoints
		);
	}

	display() {
		this.obj.display();
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
