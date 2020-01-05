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
		this.moving = false;
		this.jumping = false;
		this.initBuffers();
	}

	initBuffers() {
		this.sphere = new MySphere(this.scene, 'sphere', this.radius, this.slices, this.stacks);
	}

	display() {
		this.scene.pushMatrix();
		this.scene.scale(2, 0.5, 2);
		this.scene.translate(-6 + 3 * this.posX, this.posY, 6 - 3 * this.posZ);
		this.sphere.display();
		this.scene.popMatrix();
	}

	moveTo(newX, newY, newZ) {
		this.moving = true;
		this.jumping = false;
		this.newX = newX;
		this.newY = newY;
		this.newZ = newZ;
		this.xInc = (this.newX - this.posX) / 10;
		this.yInc = (this.newY - this.posY) / 10;
		this.zInc = (this.newZ - this.posZ) / 10;
	}

	jump() {
		this.jumping = true;
		this.jumpVel = 0.60;
		this.iJumpHeight = this.posY;
		this.jumpHeight = this.posY + 3;
	}

	land() {
		this.jumping = false;
		this.posY = 1;
	}

	float() {
		this.posY += this.jumpVel;
		if (this.jumpVel > 0 && Math.abs(this.posY - this.jumpHeight) < 0.1) {
			this.jumpVel *= -1;
		}
		else if (this.jumpVel < 0 && Math.abs(this.posY - this.iJumpHeight) < 0.1) {
			this.jumpVel *= -1;
		}
	}

	updatePosition(newX, newY, newZ) {
		this.posX = newX;
		this.posY = newY;
		this.posZ = newZ;
	}

	updateAnimation() {
		this.posX += this.xInc;
		this.posY += this.yInc;
		this.posZ += this.zInc;

		if (Math.abs(this.posX - this.newX) < 0.1 && Math.abs(this.posY - this.newY) < 0.1 && Math.abs(this.posZ - this.newZ) < 0.1) {
			this.moving = false;
			this.posX = this.newX;
			this.posY = this.newY;
			this.posZ = this.newZ;

			this.newX = null;
			this.newY = null;
			this.newZ = null;

			this.xInc = 0;
			this.yInc = 0;
			this.zInc = 0;
		}
	}

	/*addAnimation() {
		console.log('adding animation');
		this.keyFrame = new KeyFrame(40);
		this.keyFrame.translate = [1, 0, 0];
		this.animation = new KeyframeAnimation();
		this.animation.keyFrames.push(this.keyFrame);
	} */

	updateTexCoords(coords) {
	}

	updateLengthT(l) {
	}

	updateLengthS(l) {
	}
}