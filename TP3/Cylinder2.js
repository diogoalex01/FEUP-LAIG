/**
 * Cylinder2
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x - Scale of rectangle in X
 * @param y - Scale of rectangle in Y
 */
class Cylinder2 extends CGFobject {
	constructor(scene, base, top, height, slices, stacks) {
		super(scene);
		this.base = base;
		this.top = top;
		this.height = height;
		this.slices = slices;
		this.stacks = stacks;

		this.initBuffers();
	}

	makeSurface(degree1, degree2, controlVertexes) {
		var nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlVertexes);
		this.obj = new CGFnurbsObject(this.scene, this.slices, this.stacks, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	}

	initBuffers() {

		this.makeSurface(3, // degree on U
			1, // degree on V
			[
				[
					[-this.top, 0, this.height, 1],
					[-this.base, 0, 0, 1]

				],
				[
					[- this.top, this.top / 0.75, this.height, 1],
					[- this.base, this.base / 0.75, 0, 1]
				],
				[
					[this.top, this.top / 0.75, this.height, 1],
					[this.base, this.base / 0.75, 0, 1]
				],
				[
					[this.top, 0, this.height, 1],
					[this.base, 0, 0, 1]
				],
			]);
	}

	display() {
		this.obj.display();
		this.scene.rotate(Math.PI, 0, 0, 1);
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
