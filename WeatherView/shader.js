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
uniform vec4 wvColor[15];// 颜色数组
uniform int wvColorNum;// 颜色数量
uniform float wvAlpha; // 透明度

// 根据值对颜色进行线性插值
vec3 linearInterpolateColor(float value){
    
    float t=0.;
    return vec3(value * float(wvColorNum)/20.0);
    return vec3(step(value*wvAlpha, 0.01));
    vec3 color=vec3(value);
    vec3 tmp1=vec3(0.);
    vec3 tmp2=vec3(0.);
    // TODO: 比较顺序倒过来
    int index=0;
    if(wvColorNum>0&&value>wvColor[0].a)
    {index++;}
    if(wvColorNum>1&&value>wvColor[1].a)
    {index++;}
    if(wvColorNum>2&&value>wvColor[2].a)
    {index++;}
    if(wvColorNum>3&&value>wvColor[3].a)
    {index++;}
    if(wvColorNum>4&&value>wvColor[4].a)
    {index++;}
    if(wvColorNum>5&&value>wvColor[5].a)
    {index++;}
    if(wvColorNum>6&&value>wvColor[6].a)
    {index++;}
    if(wvColorNum>7&&value>wvColor[7].a)
    {index++;}
    if(wvColorNum>8&&value>wvColor[8].a)
    {index++;}
    if(wvColorNum>9&&value>wvColor[9].a)
    {index++;}
    if(wvColorNum>10&&value>wvColor[10].a)
    {index++;}
    if(wvColorNum>11&&value>wvColor[11].a)
    {index++;}
    if(wvColorNum>12&&value>wvColor[12].a)
    {index++;}
    if(wvColorNum>13&&value>wvColor[13].a)
    {index++;}
    if(wvColorNum>14&&value>wvColor[14].a)
    {index++;}
    
    if(index==0)
    {
        return vec3(0.);
    }
    if(index==wvColorNum-1)
    {
        if(wvColorNum==2)
        {return wvColor[1].rgb;}
        if(wvColorNum==3)
        {return wvColor[2].rgb;}
        if(wvColorNum==4)
        {return wvColor[3].rgb;}
        if(wvColorNum==5)
        {return wvColor[4].rgb;}
        if(wvColorNum==6)
        {return wvColor[5].rgb;}
        if(wvColorNum==7)
        {return wvColor[6].rgb;}
        if(wvColorNum==8)
        {return wvColor[7].rgb;}
        if(wvColorNum==9)
        {return wvColor[8].rgb;}
        if(wvColorNum==10)
        {return wvColor[9].rgb;}
        if(wvColorNum==11)
        {return wvColor[10].rgb;}
        if(wvColorNum==12)
        {return wvColor[11].rgb;}
        if(wvColorNum==13)
        {return wvColor[12].rgb;}
        if(wvColorNum==14)
        {return wvColor[13].rgb;}
        if(wvColorNum==15)
        {return wvColor[14].rgb;}
    }
    
    if(index==1)
    {
        return wvColor[0].rgb;
        tmp1=wvColor[0].rgb;
        tmp2=wvColor[1].rgb;
        t=(value-wvColor[0].a)/(wvColor[1].a-wvColor[0].a);
    }
    else if(index==2)
    {
        tmp1=wvColor[1].rgb;
        tmp2=wvColor[2].rgb;
        t=(value-wvColor[1].a)/(wvColor[2].a-wvColor[1].a);
    }
    else if(index==3)
    {
        tmp1=wvColor[2].rgb;
        tmp2=wvColor[3].rgb;
        t=(value-wvColor[2].a)/(wvColor[3].a-wvColor[2].a);
    }
    else if(index==4)
    {
        tmp1=wvColor[3].rgb;
        tmp2=wvColor[4].rgb;
        t=(value-wvColor[3].a)/(wvColor[4].a-wvColor[3].a);
    }
    else if(index==5)
    {
        tmp1=wvColor[4].rgb;
        tmp2=wvColor[5].rgb;
        t=(value-wvColor[4].a)/(wvColor[5].a-wvColor[4].a);
    }
    else if(index==6)
    {
        tmp1=wvColor[5].rgb;
        tmp2=wvColor[6].rgb;
        t=(value-wvColor[5].a)/(wvColor[6].a-wvColor[5].a);
    }
    else if(index==7)
    {
        tmp1=wvColor[6].rgb;
        tmp2=wvColor[7].rgb;
        t=(value-wvColor[6].a)/(wvColor[7].a-wvColor[6].a);
    }
    else if(index==8)
    {
        tmp1=wvColor[7].rgb;
        tmp2=wvColor[8].rgb;
        t=(value-wvColor[7].a)/(wvColor[8].a-wvColor[7].a);
    }
    else if(index==9)
    {
        
        tmp1=wvColor[8].rgb;
        tmp2=wvColor[9].rgb;
        t=(value-wvColor[8].a)/(wvColor[9].a-wvColor[8].a);
    }
    else if(index==10)
    {
        tmp1=wvColor[9].rgb;
        tmp2=wvColor[10].rgb;
        t=(value-wvColor[9].a)/(wvColor[10].a-wvColor[9].a);
    }
    else if(index==11)
    {
        tmp1=wvColor[10].rgb;
        tmp2=wvColor[11].rgb;
        t=(value-wvColor[10].a)/(wvColor[11].a-wvColor[10].a);
    }
    else if(index==12)
    {
        tmp1=wvColor[11].rgb;
        tmp2=wvColor[12].rgb;
        t=(value-wvColor[11].a)/(wvColor[12].a-wvColor[11].a);
    }
    else if(index==13)
    {
        tmp1=wvColor[12].rgb;
        tmp2=wvColor[13].rgb;
        t=(value-wvColor[12].a)/(wvColor[13].a-wvColor[12].a);
    }
    else if(index==14)
    {
        tmp1=wvColor[13].rgb;
        tmp2=wvColor[14].rgb;
        t=(value-wvColor[13].a)/(wvColor[14].a-wvColor[13].a);
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