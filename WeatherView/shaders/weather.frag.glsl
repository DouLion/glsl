precision mediump float;
uniform sampler2D u_image;
varying vec2 v_texCoord;
uniform vec4 wvColors[15];// 颜色数组
uniform float wvThresholds[15];
uniform int wvColorNum;// 颜色数量
attribute vec2 a_position;
uniform vec2 coordOffset2[2];
// 根据值对颜色进行线性插值
float round(float x)
{
    return floor(x+.5);
}
vec4 linearInterpolateColor(vec4 px){
    // float value = round(px.r *25500.0)  + round(px.g*255.0) + round(px.b*2.55) + px.a * 0.0255;
    float value=px.r*25500.+px.g*255.+px.b*2.55+px.a*.0255;
    float t=0.;
    vec4 color=vec4(0.);
    vec4 tmp1=vec4(0.);
    vec4 tmp2=vec4(0.);
    
    // 确定阈值索引
    int index=0;
    if(wvColorNum>0&&value>=wvThresholds[0])
    {index++;}
    if(wvColorNum>1&&value>=wvThresholds[1])
    {index++;}
    if(wvColorNum>2&&value>=wvThresholds[2])
    {index++;}
    if(wvColorNum>3&&value>=wvThresholds[3])
    {index++;}
    if(wvColorNum>4&&value>=wvThresholds[4])
    {index++;}
    if(wvColorNum>5&&value>=wvThresholds[5])
    {index++;}
    if(wvColorNum>6&&value>=wvThresholds[6])
    {index++;}
    if(wvColorNum>7&&value>=wvThresholds[7])
    {index++;}
    if(wvColorNum>8&&value>=wvThresholds[8])
    {index++;}
    if(wvColorNum>9&&value>=wvThresholds[9])
    {index++;}
    if(wvColorNum>10&&value>=wvThresholds[10])
    {index++;}
    
    // 扎到对应上下边界的两个颜色和插值权重
    if(index==1)
    {
        tmp1=wvColors[0];//vec4(wvColors[0].rgb, 0.0);
        tmp2=wvColors[1];//vec4(wvColors[1].rgb, 1.0);
        t=(value-wvThresholds[0])/(wvThresholds[1]-wvThresholds[0]);
    }
    else if(index==2)
    {
        tmp1=wvColors[1];
        tmp2=wvColors[2];
        t=(value-wvThresholds[1])/(wvThresholds[2]-wvThresholds[1]);
    }
    else if(index==3)
    {
        tmp1=wvColors[2];
        tmp2=wvColors[3];
        t=(value-wvThresholds[2])/(wvThresholds[3]-wvThresholds[2]);
    }
    else if(index==4)
    {
        tmp1=wvColors[3];
        tmp2=wvColors[4];
        t=(value-wvThresholds[3])/(wvThresholds[4]-wvThresholds[3]);
    }
    else if(index==5)
    {
        tmp1=wvColors[4];
        tmp2=wvColors[5];
        t=(value-wvThresholds[4])/(wvThresholds[5]-wvThresholds[4]);
    }
    else if(index==6)
    {
        tmp1=wvColors[5];
        tmp2=wvColors[6];
        t=(value-wvThresholds[5])/(wvThresholds[6]-wvThresholds[5]);
    }
    else if(index==7)
    {
        tmp1=wvColors[6];
        tmp2=wvColors[7];
        t=(value-wvThresholds[6])/(wvThresholds[7]-wvThresholds[6]);
    }
    else if(index==8)
    {
        tmp1=wvColors[7];
        tmp2=wvColors[8];
        t=(value-wvThresholds[7])/(wvThresholds[8]-wvThresholds[7]);
    }
    else if(index==9)
    {
        
        tmp1=wvColors[8];
        tmp2=wvColors[9];
        t=(value-wvThresholds[8])/(wvThresholds[9]-wvThresholds[8]);
    }
    else if(index==10)
    {
        tmp1=wvColors[9];
        tmp2=wvColors[10];
        t=(value-wvThresholds[9])/(wvThresholds[10]-wvThresholds[9]);
    }
    color=mix(tmp1,tmp2,t);
    return color;
}

void main(){
    vec2 pos=v_texCoord;
    vec4 color=texture2D(u_image,v_texCoord);
    if(pos.x<coordOffset2[0].x||pos.x>coordOffset2[1].x||pos.y<coordOffset2[0].y||pos.y>coordOffset2[1].y)
    {
        color=vec4(0.,0.,0.,0.);
    }
    else
    {
        color=linearInterpolateColor(color);
    }
    
    gl_FragColor=color;
}