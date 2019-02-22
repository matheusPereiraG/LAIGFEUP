attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler2;

uniform float normScale;

void main() {       
        vTextureCoord = aTextureCoord;

		float colorToScale = texture2D(uSampler2, vTextureCoord).r;
 
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + (aVertexNormal * normScale * colorToScale * 0.1), 1.0);
}

