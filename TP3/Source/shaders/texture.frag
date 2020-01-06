#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float timeFactor;

void main() {

	float dist = sqrt(pow(vTextureCoord.x - 0.5, 2.0) + pow(vTextureCoord.y - 0.5, 2.0));
	gl_FragColor = (1.0 - dist) * texture2D(uSampler, vTextureCoord);
	gl_FragColor[3] = 1.0;

	if(mod((vTextureCoord.y + timeFactor) * 20.0, 1.1) > 0.6)
		gl_FragColor = vec4(gl_FragColor.rgb * 0.85, 1.0);
		gl_FragColor = vec4(gl_FragColor.rgb, 1.0);
}
