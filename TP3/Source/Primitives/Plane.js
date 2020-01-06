/**
 * Plane
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x - Scale of rectangle in X
 * @param y - Scale of rectangle in Y
 */
class Plane extends CGFobject {
	constructor(scene, npartsU, npartsV) {
		super(scene);
		this.npartsU = npartsU;
		this.npartsV = npartsV;

		this.initBuffers();
	}

	makeSurface(degree1, degree2, controlVertexes) {
		var nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlVertexes);
		this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	}

	initBuffers() {

		this.makeSurface(1, // degree on U
			1, // degree on V
			[
				[
					[0.5, 0, -0.5, 1],
					[0.5, 0, 0.5, 1]
				],

				[
					[-0.5, 0, -0.5, 1],
					[-0.5, 0, 0.5, 1]
				]
			]);
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
