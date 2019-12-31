/**
 * MyPiece
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyPiece extends CGFobject {
	constructor(scene, radius, slices, stacks, posX, posY, posZ) {
		super(scene);
		this.scene = scene;
		this.slices = slices;
		this.radius = radius;
		this.stacks = stacks;
		this.posX = posX;
		this.posY = posY;
		this.posZ = posZ;

		this.initBuffers();
	}

	initBuffers() {
		this.sphere = new MySphere(this.scene, 'sphere', this.radius, this.slices, this.stacks);
	}

	display() {
		this.scene.pushMatrix();
		this.scene.scale(2, 0.5, 2);
		this.scene.translate(-6 + 3 * this.posX, 1.5, 6 - 3 * this.posZ);
		this.sphere.display();
		this.scene.popMatrix();
	}

	updatePosition(posX, posY, posZ) {
		this.posX = posX;
		this.posY = posY;
		this.posZ = posZ;
	}

	updateTexCoords(coords) {
	}

	updateLengthT(l) {
	}

	updateLengthS(l) {
	}
}