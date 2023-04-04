import UnlitMaterial = Laya.UnlitMaterial;
import Shader3D = Laya.Shader3D;
import Vector4 = Laya.Vector4;
import VertexMesh = Laya.VertexMesh;

export class ChromaKeyMaterial extends UnlitMaterial {
    public static SHADER_NAME = "ChromaKey"
    private static THRESHOLD: number = Shader3D.propertyNameToID("u_threshold");
    private static SLOP: number = Shader3D.propertyNameToID("u_slope");
    private static KEY_COLOR: number = Shader3D.propertyNameToID("u_keyColor");

    public setThreshold(threshold: number) {
        this._shaderValues.setNumber(ChromaKeyMaterial.THRESHOLD, threshold)
    }

    public setSlop(slop: number) {
        this._shaderValues.setNumber(ChromaKeyMaterial.SLOP, slop)
    }

    public setKeyColor(color: Vector4) {
        this._shaderValues.setVector(ChromaKeyMaterial.KEY_COLOR, color)
    }

    public updateShader() {

        let attributeMap = {
            'a_Position': VertexMesh.MESH_POSITION0,
            'a_Color': VertexMesh.MESH_COLOR0,
            'a_Texcoord0': VertexMesh.MESH_TEXTURECOORDINATE0,
            'a_BoneWeights': VertexMesh.MESH_BLENDWEIGHT0,
            'a_BoneIndices': VertexMesh.MESH_BLENDINDICES0,
            'a_WorldMat': VertexMesh.MESH_WORLDMATRIX_ROW0,
            'a_SimpleTextureParams': VertexMesh.MESH_SIMPLEANIMATOR
        };
        let uniformMap = {
            'u_threshold': Shader3D.PERIOD_MATERIAL,
            'u_slope': Shader3D.PERIOD_MATERIAL,
            'u_keyColor': Shader3D.PERIOD_MATERIAL,

            'u_Bones': Shader3D.PERIOD_CUSTOM,
            'u_AlbedoTexture': Shader3D.PERIOD_MATERIAL,
            'u_AlbedoColor': Shader3D.PERIOD_MATERIAL,
            'u_TilingOffset': Shader3D.PERIOD_MATERIAL,
            'u_AlphaTestValue': Shader3D.PERIOD_MATERIAL,
            'u_MvpMatrix': Shader3D.PERIOD_SPRITE,
            'u_ViewProjection': Shader3D.PERIOD_CAMERA,
            'u_SimpleAnimatorTexture': Shader3D.PERIOD_SPRITE,
            'u_SimpleAnimatorParams': Shader3D.PERIOD_SPRITE,
            'u_SimpleAnimatorTextureSize': Shader3D.PERIOD_SPRITE,
            'u_FogStart': Shader3D.PERIOD_SCENE,
            'u_FogRange': Shader3D.PERIOD_SCENE,
            'u_FogColor': Shader3D.PERIOD_SCENE
        };
        let stateMap = {
            's_Cull': Shader3D.RENDER_STATE_CULL,
            's_Blend': Shader3D.RENDER_STATE_BLEND,
            's_BlendSrc': Shader3D.RENDER_STATE_BLEND_SRC,
            's_BlendDst': Shader3D.RENDER_STATE_BLEND_DST,
            's_DepthTest': Shader3D.RENDER_STATE_DEPTH_TEST,
            's_DepthWrite': Shader3D.RENDER_STATE_DEPTH_WRITE
        };

        let vertexShader = `
#if defined(GL_FRAGMENT_PRECISION_HIGH)//原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成if defined了
    precision highp float;
#else
    precision mediump float;
#endif
#include "Lighting.glsl";
#include "LayaUtile.glsl";

attribute vec4 a_Position;

attribute vec2 a_Texcoord0;

#ifdef GPU_INSTANCE
    uniform mat4 u_ViewProjection;
    attribute mat4 a_WorldMat;
#else
    uniform mat4 u_MvpMatrix;
#endif

attribute vec4 a_Color;
varying vec4 v_Color;
varying vec2 v_Texcoord0;

uniform vec4 u_TilingOffset;

#ifdef BONE
    const int c_MaxBoneCount = 24;
    attribute vec4 a_BoneIndices;
    attribute vec4 a_BoneWeights;
    uniform mat4 u_Bones[c_MaxBoneCount];
#endif


void main() {
    vec4 position;
    #ifdef BONE
        mat4 skinTransform;
         #ifdef SIMPLEBONE
            float currentPixelPos;
            #ifdef GPU_INSTANCE
                currentPixelPos = a_SimpleTextureParams.x+a_SimpleTextureParams.y;
            #else
                currentPixelPos = u_SimpleAnimatorParams.x+u_SimpleAnimatorParams.y;
            #endif
            float offset = 1.0/u_SimpleAnimatorTextureSize;
            skinTransform =  loadMatFromTexture(currentPixelPos,int(a_BoneIndices.x),offset) * a_BoneWeights.x;
            skinTransform += loadMatFromTexture(currentPixelPos,int(a_BoneIndices.y),offset) * a_BoneWeights.y;
            skinTransform += loadMatFromTexture(currentPixelPos,int(a_BoneIndices.z),offset) * a_BoneWeights.z;
            skinTransform += loadMatFromTexture(currentPixelPos,int(a_BoneIndices.w),offset) * a_BoneWeights.w;
        #else
            skinTransform =  u_Bones[int(a_BoneIndices.x)] * a_BoneWeights.x;
            skinTransform += u_Bones[int(a_BoneIndices.y)] * a_BoneWeights.y;
            skinTransform += u_Bones[int(a_BoneIndices.z)] * a_BoneWeights.z;
            skinTransform += u_Bones[int(a_BoneIndices.w)] * a_BoneWeights.w;
        #endif
        position=skinTransform*a_Position;
     #else
        position=a_Position;
    #endif
    #ifdef GPU_INSTANCE
        gl_Position =u_ViewProjection * a_WorldMat * position;
    #else
        gl_Position = u_MvpMatrix * position;
    #endif

    v_Texcoord0=TransformUV(a_Texcoord0,u_TilingOffset);

    #if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)
        v_Color = a_Color;
    #endif
    gl_Position=remapGLPositionZ(gl_Position);
}
        `
        let fragmentShader = `
#if defined(GL_FRAGMENT_PRECISION_HIGH)//原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了
    precision highp float;
#else
    precision mediump float;
#endif

#if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)
    varying vec4 v_Color;
#endif

#ifdef ALBEDOTEXTURE
    uniform sampler2D u_AlbedoTexture;
    varying vec2 v_Texcoord0;
#endif

uniform vec4 u_AlbedoColor;

#ifdef ALPHATEST
    uniform float u_AlphaTestValue;
#endif

#ifdef FOG
    uniform float u_FogStart;
    uniform float u_FogRange;
    #ifdef ADDTIVEFOG
    #else
        uniform vec3 u_FogColor;
    #endif
#endif

uniform float u_threshold;
uniform float u_slope;
uniform vec4 u_keyColor;

void main()
{
    vec4 color =  u_AlbedoColor;
    #ifdef ALBEDOTEXTURE
        color *= texture2D(u_AlbedoTexture, v_Texcoord0);
    #endif
    #if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)
        color *= v_Color;
    #endif
    
    #ifdef ALPHATEST
        if(color.a < u_AlphaTestValue)
            discard;
    #endif
    
    // gl_FragColor = color;
    
    float d=abs(length(abs(u_keyColor.rgb-color.rgb)));
    float edge0 = u_threshold * (1.0 - u_slope);
    float alpha = smoothstep(edge0, u_threshold, d);
    gl_FragColor = vec4(color.rgb, alpha);
    
    // #ifdef FOG
    //     float lerpFact = clamp((1.0 / gl_FragCoord.w - u_FogStart) / u_FogRange, 0.0, 1.0);
    //     #ifdef ADDTIVEFOG
    //         gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.0), lerpFact);
    //     #else
    //         gl_FragColor.rgb = mix(gl_FragColor.rgb, u_FogColor, lerpFact);
    //     #endif
    // #endif
}
        `

        let shader = Shader3D.add(ChromaKeyMaterial.SHADER_NAME, attributeMap, uniformMap, true, true)
        let subShader = new Laya.SubShader(attributeMap, uniformMap)
        shader.addSubShader(subShader)
        subShader.addShaderPass(vertexShader, fragmentShader, stateMap)

        this["_shader"] = shader;
        this.name = ChromaKeyMaterial.SHADER_NAME
        this.setShaderName(ChromaKeyMaterial.SHADER_NAME)
    }

    clone(): any {
        let material = new ChromaKeyMaterial()
        this.cloneTo(material)
        return material
    }
}