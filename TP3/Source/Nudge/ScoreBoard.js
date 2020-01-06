/**
 * ScoreBoard
 * @constructor
 * @param scene - Reference to MyScene object
 */
class ScoreBoard extends CGFobject {
	constructor(scene) {
		super(scene);

		this.scene.rectangle = new MyRectangle(this.scene, 'rec', 0.5, 1, -1, -0.5);
		this.initBuffers();
	}

	initBuffers() {
		this.camShader = new CGFshader(this.scene.gl, "./shaders/texture.vert", "./shaders/texture.frag");
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.updateTexCoordsGLBuffers();
	}

	update(time) {
		this.camShader.setUniformsValues({ timeFactor: time / 100 % 1000 });
	}

	updateLengthT(l) {
	}

	updateLengthS(l) {
	}

	display(text) {
		this.scene.setActiveShader(this.camShader);
		text.bind();
		this.scene.rectangle.display();
		this.scene.setActiveShader(this.scene.defaultShader);
	}
}
