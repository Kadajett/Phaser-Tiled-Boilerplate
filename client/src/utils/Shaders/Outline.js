// `
// precision mediump float;

// uniform sampler2D uMainSampler;

// varying vec2 outTexCoord;
// varying float outTintEffect;
// varying vec4 outTint;

// void main()
// {
//     vec4 texture = texture2D(uMainSampler, outTexCoord);
//     vec4 texel = vec4(outTint.rgb * outTint.a, outTint.a);
//     vec4 color = texture;

//     if (outTintEffect == 0.0)
//     {
//         //  Multiply texture tint
//         color = texture * texel;
//     }
//     else if (outTintEffect == 1.0)
//     {
//         //  Solid color + texture alpha
//         color.rgb = mix(texture.rgb, outTint.rgb * outTint.a, texture.a);
//         color.a = texture.a * texel.a;
//     }
//     else if (outTintEffect == 2.0)
//     {
//         //  Solid color, no texture
//         color = texel;
//     }

//     gl_FragColor = color;
    
//     if (color.a == 0.0) {
//         vec4 colorU = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y - 0.001));
//         vec4 colorD = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y + 0.001));
//         vec4 colorL = texture2D(uMainSampler, vec2(outTexCoord.x + 0.001, outTexCoord.y));
//         vec4 colorR = texture2D(uMainSampler, vec2(outTexCoord.x - 0.001, outTexCoord.y));
//         if (colorU.a != 0.0 || colorD.a != 0.0 || colorL.a != 0.0 || colorR.a != 0.0) {
//             gl_FragColor = vec4(1.0, 0.0, 0.0, .2);
//         }
//     } else {
//         vec4 colorU = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y - 0.001));
//         vec4 colorD = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y + 0.001));
//         vec4 colorL = texture2D(uMainSampler, vec2(outTexCoord.x + 0.001, outTexCoord.y));
//         vec4 colorR = texture2D(uMainSampler, vec2(outTexCoord.x - 0.001, outTexCoord.y));
//         if (colorU.a == 0.0 || colorD.a == 0.0 || colorL.a == 0.0 || colorR.a == 0.0) {
//             gl_FragColor = vec4(color.r + 0.4, color.b, color.b, color.a);
//         }                     
//     }        
// }
// `,