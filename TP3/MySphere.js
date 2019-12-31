/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MySphere extends CGFobject {
	constructor(scene, id, radius, slices, stacks) {
		super(scene);
		this.id = id;
		this.slices = slices;
		this.radius = radius;
		this.stacks = stacks;

		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		var phi = 0;
		var theta = 0;
		var deltaPhi = Math.PI * 2 / this.slices;
		var deltaTheta = (Math.PI / 2) / this.stacks;

		for (var j = 0; j <= this.stacks; j++) {
			phi = 0;

			for (var i = 0; i <= this.slices; i++) {
				var normalX = Math.cos(theta) * Math.cos(phi);
				var normalY = Math.cos(theta) * Math.sin(phi);
				var normalZ = Math.sin(theta);

				this.vertices.push(normalX * this.radius, normalY * this.radius, normalZ * this.radius);
				this.normals.push(normalX, normalY, normalZ);
				this.texCoords.push(i / this.slices, 0.5 - j / (2 * this.stacks));

				if (theta > 0) {
					this.vertices.push(normalX * this.radius, normalY * this.radius, -normalZ * this.radius);
					this.normals.push(normalX, normalY, -normalZ);
					this.texCoords.push(i / this.slices, 0.5 + j / (2 * this.stacks));
				}

				if (j == this.stacks) {
					break;
				}

				phi += deltaPhi;
			}

			theta += deltaTheta;
		}

		this.vertices.push(0, 0, this.radius);
		this.vertices.push(0, 0, -this.radius);
		this.normals.push(0, 0, 1);
		this.normals.push(0, 0, -1);

		for (var j = 0; j < this.stacks; j++) {

			if (j == 0) {
				for (var i = 0; i < this.slices; i++) {
					this.indices.push((this.slices + 1) + 2 * i + 2, i, i + 1);
					this.indices.push((this.slices + 1) + 2 * i, i, (this.slices + 1) + 2 * i + 2);

					this.indices.push((this.slices + 1) + 2 * i + 1, i + 1, i);
					this.indices.push((this.slices + 1) + 2 * i + 3, i + 1, (this.slices + 1) + 2 * i + 1);
				}
			}
			else {
				for (var i = 0; i < this.stacks; i++) {
					this.indices.push((this.slices + 1) * (2 * j + 1) + 2 * i + 2, (this.slices + 1) * (2 * j - 1) + 2 * i, (this.slices + 1) * (2 * j - 1) + 2 * i + 2);
					this.indices.push((this.slices + 1) * (2 * j + 1) + 2 * i, (this.slices + 1) * (2 * j - 1) + 2 * i, (this.slices + 1) * (2 * j + 1) + 2 * i + 2);

					this.indices.push((this.slices + 1) * (2 * j + 1) + 2 * i + 1, (this.slices + 1) * (2 * j - 1) + 2 * i + 3, (this.slices + 1) * (2 * j - 1) + 2 * i + 1);
					this.indices.push((this.slices + 1) * (2 * j + 1) + 2 * i + 3, (this.slices + 1) * (2 * j - 1) + 2 * i + 3, (this.slices + 1) * (2 * j + 1) + 2 * i + 1);
				}
			}
		}

		var vN = this.stacks * (this.slices + 1) * 2 + 1  //North pole vertex
		var vS = vN + 1;                                  //South pole vertex

		for (var i = 0; i < this.slices; i++) {
			//Vertices indexes
			var v1 = this.stacks * this.slices + i;
			var v2 = v1 + 2;

			this.indices.push(v1, v2, vN);
			this.indices.push(v1 + 1, vS, v2 + 1);
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