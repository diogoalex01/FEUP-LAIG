/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTorus extends CGFobject {
	constructor(scene, id, inner, outer, slices, loops) {
		super(scene);
		this.id = id;
		this.slices = slices;
		this.inner = inner;
		this.outer = outer;
		this.loops = loops;

		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		var phi = 0;
		var theta = 0;
		var deltaPhi = Math.PI * 2 / this.loops;
		var deltaTheta = (Math.PI * 2) / this.slices;

		for (var j = 0; j <= this.loops; j++) {

			theta = 0;

			for (var i = 0; i <= this.slices; i++) {

				var x = (this.outer + this.inner * Math.cos(theta)) * Math.cos(phi);
				var y = (this.outer + this.inner * Math.cos(theta)) * Math.sin(phi);

				var normalX = Math.cos(theta) * Math.cos(phi);
				var normalY = Math.cos(theta) * Math.sin(phi);
				var normalZ = Math.sin(theta);

				this.vertices.push(x, y, normalZ * this.inner);

				//this.texCoords.push(ang / (Math.PI * 2), 1);

				var normal = [
					normalX,
					normalY,
					normalZ
				];

				// push normal once for each vertex of this triangle
				this.normals.push(...normal);

				theta += deltaTheta;
			}
			
			phi += deltaPhi;
		}

		for (var j = 0; j < this.loops; j++) {

			for (var i = 0; i < this.slices; i++) {

				this.indices.push((this.slices + 1) * (j + 1) + i + 1, (this.slices + 1) * j + i + 1, (this.slices + 1) * j + i);
				this.indices.push((this.slices + 1) * (j + 1) + i, (this.slices + 1) * (j + 1) + i + 1, (this.slices + 1) * j + i);
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
}