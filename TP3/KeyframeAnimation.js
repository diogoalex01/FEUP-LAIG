/**
 * KeyframeAnimation
 * @constructor
 */
class KeyframeAnimation extends Animation {
	constructor() {
		super();
		this.keyFrames = [];
		this.min = null;
		this.max = null;
		this.animation_matrix = mat4.create();
		this.transM = [];
		this.rotM = [];
		this.scaleM = [1, 1, 1];
		this.count = 0;
	}

	update(time) {
		this.count++;
		var maxim = 1000;

		if (time == 0) {
			this.min = this.keyFrames[0];
			this.max = this.keyFrames[0];
		}

		this.animation_matrix = mat4.create();

		for (var i = 0; i < this.keyFrames.length; i++) {
			if (this.keyFrames[i] == time) {
				this.animation_matrix = mat4.translate(this.animation_matrix, this.animation_matrix, this.keyFrames[i].translate);

				this.animation_matrix = mat4.scale(this.animation_matrix, this.animation_matrix, this.keyFrames[i].scale);
				return;
			}
			else if (this.keyFrames[i].instant < time && this.min.instant <= this.keyFrames[i].instant) {
				this.min = this.keyFrames[i];
			}
			else if (this.keyFrames[i].instant > time && maxim >= this.keyFrames[i].instant) {
				this.max = this.keyFrames[i];
				maxim = this.max.instant;
			}
		}

		if (time > this.max.instant) {
			this.animation_matrix = mat4.translate(this.animation_matrix, this.animation_matrix, this.max.translate);

			this.animation_matrix = mat4.rotate(this.animation_matrix, this.animation_matrix, this.max.rotate[0], [1, 0, 0]);
			this.animation_matrix = mat4.rotate(this.animation_matrix, this.animation_matrix, this.max.rotate[1], [0, 1, 0]);
			this.animation_matrix = mat4.rotate(this.animation_matrix, this.animation_matrix, this.max.rotate[2], [0, 0, 1]);

			this.animation_matrix = mat4.scale(this.animation_matrix, this.animation_matrix, this.max.scale);
			return;
		}

		// translation
		this.transM[0] = this.min.translate[0] + (this.max.translate[0] - this.min.translate[0]) * (time - this.min.instant) / (this.max.instant - this.min.instant); // + this.min.translate[0]
		this.transM[1] = this.min.translate[1] + (this.max.translate[1] - this.min.translate[1]) * (time - this.min.instant) / (this.max.instant - this.min.instant);
		this.transM[2] = this.min.translate[2] + (this.max.translate[2] - this.min.translate[2]) * (time - this.min.instant) / (this.max.instant - this.min.instant);

		this.animation_matrix = mat4.translate(this.animation_matrix, this.animation_matrix, this.transM);

		// rotation
		this.rotM[0] = this.min.rotate[0] + (this.max.rotate[0] - this.min.rotate[0]) * (time - this.min.instant) / (this.max.instant - this.min.instant);
		this.rotM[1] = this.min.rotate[1] + (this.max.rotate[1] - this.min.rotate[1]) * (time - this.min.instant) / (this.max.instant - this.min.instant);
		this.rotM[2] = this.min.rotate[2] + (this.max.rotate[2] - this.min.rotate[2]) * (time - this.min.instant) / (this.max.instant - this.min.instant);

		this.animation_matrix = mat4.rotate(this.animation_matrix, this.animation_matrix, this.rotM[0], [1, 0, 0]);
		this.animation_matrix = mat4.rotate(this.animation_matrix, this.animation_matrix, this.rotM[1], [0, 1, 0]);
		this.animation_matrix = mat4.rotate(this.animation_matrix, this.animation_matrix, this.rotM[2], [0, 0, 1]);

		// scale
		var ratioX = Math.pow(this.max.scale[0] / this.min.scale[0], 1.0 / ((this.max.instant - this.min.instant) / 0.08));
		var ratioY = Math.pow(this.max.scale[1] / this.min.scale[1], 1.0 / ((this.max.instant - this.min.instant) / 0.08));
		var ratioZ = Math.pow(this.max.scale[2] / this.min.scale[2], 1.0 / ((this.max.instant - this.min.instant) / 0.08));

		this.scaleM[0] *= ratioX;
		this.scaleM[1] *= ratioY;
		this.scaleM[2] *= ratioZ;

		this.animation_matrix = mat4.scale(this.animation_matrix, this.animation_matrix, this.scaleM);
	}

	apply() {
		return this.animation_matrix;
	}
}