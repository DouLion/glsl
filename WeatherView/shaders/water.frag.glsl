void main(out vec4 fragColor,in vec2 fragCoord){
    // 基础 UV
    vec2 uv=fragCoord.xy/iResolution.xy;
    
    // 流动动画
    uv+=vec2(iTime*.2,0);
    
    // 噪声扰动
    float noise=fbm(uv*5.+iTime);
    uv+=noise*.1;
    
    // 法线计算
    vec3 normal=calculateNormal(uv);
    
    // 光照计算
    float lighting=phongLighting(normal);
    
    // 颜色混合
    vec3 waterColor=mix(shallow,deep,depth);
    
    // 菲涅尔透明度
    float alpha=fresnelEffect(viewDir,normal);
    
    fragColor=vec4(waterColor*lighting,alpha);
}