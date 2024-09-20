 // 顶点着色器
 const VERTES_SHADER_SOURCE = `
    attribute vec2 a_position;
    varying vec2 v_texCoord;
    uniform vec2 coordOffset[2];
    const float SU_PI = 3.14159265358979323846;
    const float WGS84_SEMI_MAJOR_AXIS = 6378137.0;

    void mercatorToLonLat(float mctx, float mcty, out float lon, out float lat) {
    // 将 mctx 转换为经度
    lon = (mctx / WGS84_SEMI_MAJOR_AXIS) * 180.0 / SU_PI;

    // 将 mcty 转换为纬度
    lat = (2.0 * atan(exp(mcty / WGS84_SEMI_MAJOR_AXIS)) - SU_PI / 2.0) * 180.0 / SU_PI;
    }
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_position * 0.5 + 0.5; // 将顶点坐标转换为纹理坐标
        // + 视口大于图像范围  - 视口小于图像范围
        v_texCoord.y = coordOffset[1].y + (coordOffset[0].y - coordOffset[1].y) * v_texCoord.y;
        v_texCoord.x = coordOffset[0].x + (coordOffset[1].x - coordOffset[0].x) * v_texCoord.x;
        v_texCoord.y = 1.0 - v_texCoord.y;
        
    }
 `;

 // 片段着色器
 const FRAGMENT_SHADER_SOURCE = `
    precision mediump float;
uniform sampler2D u_image;
varying vec2 v_texCoord;
uniform float scaleValue;// 输入值
uniform vec4 colors[15];// 颜色数组
uniform int colorCount;// 颜色数量
uniform float wvMinalue;
uniform float wvMaxalue;
uniform vec2 u_textureSize;

// 根据值对颜色进行线性插值
vec3 linearInterpolateColor(float value){
    
    float t=0.;
    vec3 color=vec3(value);
    vec3 tmp1=vec3(0.);
    vec3 tmp2=vec3(0.);
   
    int index=0;
    if(colorCount>0&&value>colors[0].a)
    {index++;}
    if(colorCount>1&&value>colors[1].a)
    {index++;}
    if(colorCount>2&&value>colors[2].a)
    {index++;}
    if(colorCount>3&&value>colors[3].a)
    {index++;}
    if(colorCount>4&&value>colors[4].a)
    {index++;}
    if(colorCount>5&&value>colors[5].a)
    {index++;}
    if(colorCount>6&&value>colors[6].a)
    {index++;}
    if(colorCount>7&&value>colors[7].a)
    {index++;}
    if(colorCount>8&&value>colors[8].a)
    {index++;}
    if(colorCount>9&&value>colors[9].a)
    {index++;}
    if(colorCount>10&&value>colors[10].a)
    {index++;}
    if(colorCount>11&&value>colors[11].a)
    {index++;}
    if(colorCount>12&&value>colors[12].a)
    {index++;}
    if(colorCount>13&&value>colors[13].a)
    {index++;}
    if(colorCount>14&&value>colors[14].a)
    {index++;}
    
    if(index==0)
    {
        return vec3(0.);
    }
    if(index==colorCount-1)
    {
        if(colorCount==2)
        {return colors[1].rgb;}
        if(colorCount==3)
        {return colors[2].rgb;}
        if(colorCount==4)
        {return colors[3].rgb;}
        if(colorCount==5)
        {return colors[4].rgb;}
        if(colorCount==6)
        {return colors[5].rgb;}
        if(colorCount==7)
        {return colors[6].rgb;}
        if(colorCount==8)
        {return colors[7].rgb;}
        if(colorCount==9)
        {return colors[8].rgb;}
        if(colorCount==10)
        {return colors[9].rgb;}
        if(colorCount==11)
        {return colors[10].rgb;}
        if(colorCount==12)
        {return colors[11].rgb;}
        if(colorCount==13)
        {return colors[12].rgb;}
        if(colorCount==14)
        {return colors[13].rgb;}
        if(colorCount==15)
        {return colors[14].rgb;}
    }
    
    if(index==1)
    {
        return colors[0].rgb;
        tmp1=colors[0].rgb;
        tmp2=colors[1].rgb;
        t=(value-colors[0].a)/(colors[1].a-colors[0].a);
    }
    else if(index==2)
    {
        tmp1=colors[1].rgb;
        tmp2=colors[2].rgb;
        t=(value-colors[1].a)/(colors[2].a-colors[1].a);
    }
    else if(index==3)
    {
        tmp1=colors[2].rgb;
        tmp2=colors[3].rgb;
        t=(value-colors[2].a)/(colors[3].a-colors[2].a);
    }
    else if(index==4)
    {
        tmp1=colors[3].rgb;
        tmp2=colors[4].rgb;
        t=(value-colors[3].a)/(colors[4].a-colors[3].a);
    }
    else if(index==5)
    {
        tmp1=colors[4].rgb;
        tmp2=colors[5].rgb;
        t=(value-colors[4].a)/(colors[5].a-colors[4].a);
    }
    else if(index==6)
    {
        tmp1=colors[5].rgb;
        tmp2=colors[6].rgb;
        t=(value-colors[5].a)/(colors[6].a-colors[5].a);
    }
    else if(index==7)
    {
        tmp1=colors[6].rgb;
        tmp2=colors[7].rgb;
        t=(value-colors[6].a)/(colors[7].a-colors[6].a);
    }
    else if(index==8)
    {
        tmp1=colors[7].rgb;
        tmp2=colors[8].rgb;
        t=(value-colors[7].a)/(colors[8].a-colors[7].a);
    }
    else if(index==9)
    {
        
        tmp1=colors[8].rgb;
        tmp2=colors[9].rgb;
        t=(value-colors[8].a)/(colors[9].a-colors[8].a);
    }
    else if(index==10)
    {
        tmp1=colors[9].rgb;
        tmp2=colors[10].rgb;
        t=(value-colors[9].a)/(colors[10].a-colors[9].a);
    }
    else if(index==11)
    {
        tmp1=colors[10].rgb;
        tmp2=colors[11].rgb;
        t=(value-colors[10].a)/(colors[11].a-colors[10].a);
    }
    else if(index==12)
    {
        tmp1=colors[11].rgb;
        tmp2=colors[12].rgb;
        t=(value-colors[11].a)/(colors[12].a-colors[11].a);
    }
    else if(index==13)
    {
        tmp1=colors[12].rgb;
        tmp2=colors[13].rgb;
        t=(value-colors[12].a)/(colors[13].a-colors[12].a);
    }
    else if(index==14)
    {
        tmp1=colors[13].rgb;
        tmp2=colors[14].rgb;
        t=(value-colors[13].a)/(colors[14].a-colors[13].a);
    }
    color=mix(tmp1,tmp2,t);
    
    return color;
}

void main(){
    vec4 color=texture2D(u_image,v_texCoord);
    color=vec4(linearInterpolateColor(color.r),.9);
    gl_FragColor=color;
}
     `;