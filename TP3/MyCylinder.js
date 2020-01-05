/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyCylinder extends CGFobject {
	constructor(scene, id, base, top, height, slices, stacks) {
		super(scene);
		this.id = id;
		this.slices = slices;
		this.base = base;
		this.top = top;
		this.height = height;
		this.stacks = stacks;
		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		var ang = 0;
		var alphaAng = 0;
		var radius = this.base;
		var deltaRadius = (this.top - this.base) / this.stacks;
		var level = 0;
		var deltaLevel = this.height / this.stacks;

		for (var j = 0; j <= this.stacks; j++) {
			ang = 0;
			alphaAng = 2 * Math.PI / this.slices;
			for (var i = 0; i <= this.slices; i++) {

				var sa = Math.sin(ang);
				var saa = Math.sin(ang + alphaAng);
				var ca = Math.cos(ang);
				var caa = Math.cos(ang + alphaAng);

				this.vertices.push(sa * radius, ca * radius, level); //0 //4
				//this.vertices.push(ca*radius, 0, sa*radius); //3 //7

				this.texCoords.push(i / this.slices, j / this.stacks);

				var normal = [
					sa,
					ca,
					0
				];

				// push normal once for each vertex of this triangle
				this.normals.push(...normal);

				ang += alphaAng;
			}

			level += deltaLevel;
			radius += deltaRadius;
		}

		for (var j = 0; j < this.stacks; j++) {

			for (var i = j * (this.slices + 1); i < j * (this.slices + 1) + this.slices; i++) {

				this.indices.push((i + this.slices + 1), (i + 1), (i));
				this.indices.push((i + 1), (i + this.slices + 1), (i + this.slices + 2));
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();

	}

	updateBuffers(complexity) {
		this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

		// reinitialize buffers
		this.initBuffers();
		this.initNormalVizBuffers();
	}

	updateTexCoords(coords) {
	}

	updateLengthT(l) {
	}

	updateLengthS(l) {
	}
}