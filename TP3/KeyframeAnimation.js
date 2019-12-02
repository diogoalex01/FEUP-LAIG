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
		//console.log(' counter ' + this.count);

		if (time == 0) {
			this.min = this.keyFrames[0];
			this.max = this.keyFrames[0];
		}
		//console.log('time = ' + time);
		this.animation_matrix = mat4.create();

		//if (this.max != null) {
		//console.log(time);
		//}
		//console.log(this.keyFrames.length);
		//console.log(time);

		for (var i = 0; i < this.keyFrames.length; i++) {
			//console.log('instante: ' + this.keyFrames[i].instant);
			if (this.keyFrames[i] == time) { // TODO no this.max or this.min

				//console.log('time = keyframe');
				this.animation_matrix = mat4.translate(this.animation_matrix, this.animation_matrix, this.keyFrames[i].translate);

				/*this.animation_matrix = mat4.rotate(this.animation_matrix, this.animation_matrix, this.keyFrames[i].rotate[0], [1, 0, 0]);
				this.animation_matrix = mat4.rotate(this.animation_matrix, this.animation_matrix, this.keyFrames[i].rotate[1], [0, 1, 0]);
				this.animation_matrix = mat4.rotate(this.animation_matrix, this.animation_matrix, this.keyFrames[i].rotate[2], [0, 0, 1]);*/

				this.animation_matrix = mat4.scale(this.animation_matrix, this.animation_matrix, this.keyFrames[i].scale);
				return;
			}
			else if (this.keyFrames[i].instant < time && this.min.instant <= this.keyFrames[i].instant) {
				this.min = this.keyFrames[i];
				//console.log('Min === ' + this.min.instant);
			}
			else if (this.keyFrames[i].instant > time && maxim >= this.keyFrames[i].instant) {
				this.max = this.keyFrames[i];
				maxim = this.max.instant;
				//console.log('Max === ' + this.max.instant);
			}
		}

		if (time > this.max.instant) {
			//console.log('time > max com inst = ' + this.max.instant);

			this.animation_matrix = mat4.translate(this.animation_matrix, this.animation_matrix, this.max.translate);
			/*console.log(this.max.translate[0]);
			console.log(this.max.translate[1]);
			console.log(this.max.translate[2]);*/
			this.animation_matrix = mat4.rotate(this.animation_matrix, this.animation_matrix, this.max.rotate[0], [1, 0, 0]);
			this.animation_matrix = mat4.rotate(this.animation_matrix, this.animation_matrix, this.max.rotate[1], [0, 1, 0]);
			this.animation_matrix = mat4.rotate(this.animation_matrix, this.animation_matrix, this.max.rotate[2], [0, 0, 1]);

			this.animation_matrix = mat4.scale(this.animation_matrix, this.animation_matrix, this.max.scale);
			return;
		}

		//console.log('Min1 scale=== ' + this.min.scale[0]);
		//console.log('Max1 scale === ' + this.max.scale[0]);

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

		//console.log('ratio ' + ratioX);
		//console.log('nr iter ' + ((this.max.instant - this.min.instant) / 0.08));

		this.scaleM[0] *= ratioX;
		this.scaleM[1] *= ratioY;
		this.scaleM[2] *= ratioZ;

		//console.log('SCALE ' + this.scaleM[0]);

		//scaleM[0] = this.min.scale[0] + (this.max.scale[0] - this.min.scale[0]) * (time - this.min.instant) / (this.max.instant - this.min.instant);
		//scaleM[1] = this.min.scale[1] + (this.max.scale[1] - this.min.scale[1]) * (time - this.min.instant) / (this.max.instant - this.min.instant);
		//scaleM[2] = this.min.scale[2] + (this.max.scale[2] - this.min.scale[2]) * (time - this.min.instant) / (this.max.instant - this.min.instant);

		this.animation_matrix = mat4.scale(this.animation_matrix, this.animation_matrix, this.scaleM);
	}

	apply() {
		return this.animation_matrix;
	}
}