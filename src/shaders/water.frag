#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float textscale;
uniform float offset;

void main() {
		gl_FragColor = texture2D(uSampler, vTextureCoord * textscale + vec2(offset,0));
}