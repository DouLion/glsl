 // 顶点着色器
 const WEATHER_VERTES_SHADER_SOURCE = `
    attribute vec2 a_position;
    varying vec2 v_texCoord;
    uniform vec2 coordOffset[2];
    const float SU_PI = 3.14159265358979323846;
    const float WGS84_SEMI_MAJOR_AXIS = 6378137.0;

    float GeoLeft = 74.0;
    float GeoTop = 54.0;
    float GeoRight = 135.0;
    float GeoBottom = 18.0;
    float MctLeft = 0.0;
    float MctTop = 0.0;
    float MctRight = 0.0;
    float MctBottom = 0.0;

    void mercatorToLonLat(float mctx, float mcty, out float lon, out float lat) {
        float lonRad = mctx/WGS84_SEMI_MAJOR_AXIS;
        float latRad = 2.0 * atan(exp(mcty / WGS84_SEMI_MAJOR_AXIS)) - SU_PI / 2.0;
        lon = lonRad* 180.0 / SU_PI;
        lat = latRad* 180.0 / SU_PI;
    }

    void lonlatToMercator(float lon, float lat, out float mctx, out float mcty)
    {
        float latRad = lat * SU_PI / 180.0;
        float lonRad = lon * SU_PI / 180.0;
        mctx = WGS84_SEMI_MAJOR_AXIS * lonRad;
        mcty = WGS84_SEMI_MAJOR_AXIS * log(tan(SU_PI / 4.0 + latRad / 2.0));
    }

    // 同坐标系转换
    vec2 normal_cvt(vec2 p)
    {

        // + 视口大于图像范围  - 视口小于图像范围
        p.y = coordOffset[1].y + (coordOffset[0].y - coordOffset[1].y) * p.y;
        p.x = coordOffset[0].x + (coordOffset[1].x - coordOffset[0].x) * p.x;
        p.y = 1.0 - p.y;
        return p;
    }

    // 视口墨卡托, 网格点数据是经纬度
    vec2 mercator_cvt(vec2 p)
    {
     
        return vec2(0);
    }
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_position * 0.5 + 0.5; // 将顶点坐标转换为纹理坐标

        if(false)
        {
            lonlatToMercator(GeoLeft, GeoTop, MctLeft, MctTop);
            lonlatToMercator(GeoRight, GeoBottom, MctRight, MctBottom);

            float tmpMX = MctLeft + (MctRight - MctLeft) * v_texCoord.x;
            float tmpMY = MctBottom + (MctTop - MctBottom) * v_texCoord.y;

            float lon, lat;
            mercatorToLonLat(tmpMX, tmpMY, lon, lat);
            v_texCoord.x = (lon - GeoLeft)/(GeoRight - GeoLeft);
            v_texCoord.y = (GeoTop - lat)/(GeoTop - GeoBottom);
        }
        else
        {
            v_texCoord = normal_cvt(v_texCoord);
        }        
    }
 `;

 // 片段着色器
 const WEATHER_FRAGMENT_SHADER_SOURCE = `
    precision mediump float;
uniform sampler2D u_image;
varying vec2 v_texCoord;
uniform vec4 wvColors[15];// 颜色数组
uniform float wvThresholds[15];
uniform int wvColorNum;// 颜色数量

// 根据值对颜色进行线性插值
vec4 linearInterpolateColor(float value){
    
    //return vec4(wvThresholds[4], wvThresholds[4], wvThresholds[4], 1.0);
    float t=0.;
    vec4 color=vec4(0.);
    vec4 tmp1=vec4(0.);
    vec4 tmp2=vec4(0.);
   
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
    if(wvColorNum>11&&value>=wvThresholds[11])
    {index++;}
    if(wvColorNum>12&&value>=wvThresholds[12])
    {index++;}
    if(wvColorNum>13&&value>=wvThresholds[13])
    {index++;}
    if(wvColorNum>14&&value>=wvThresholds[14])
    {index++;}
    
    
    if(index==1)
    {
        tmp1=wvColors[0];
        tmp2=wvColors[1];
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
    else if(index==11)
    {
        tmp1=wvColors[10];
        tmp2=wvColors[11];
        t=(value-wvThresholds[10])/(wvThresholds[11]-wvThresholds[10]);
    }
    else if(index==12)
    {
        tmp1=wvColors[11];
        tmp2=wvColors[12];
        t=(value-wvThresholds[11])/(wvThresholds[12]-wvThresholds[11]);
    }
    else if(index==13)
    {
        tmp1=wvColors[12];
        tmp2=wvColors[13];
        t=(value-wvThresholds[12])/(wvThresholds[13]-wvThresholds[12]);
    }
    else if(index==14)
    {
        tmp1=wvColors[13];
        tmp2=wvColors[14];
        t=(value-wvThresholds[13])/(wvThresholds[14]-wvThresholds[13]);
    }
        
    color=mix(tmp1,tmp2,t);
    // float f1 = 1.0 -step(t, 0.9);
    // color = vec4(0., 0., f1, f1);
    return color;
}

void main(){
    vec4 color=texture2D(u_image,v_texCoord);
    color=linearInterpolateColor(color.r);
    gl_FragColor=color;
}
     `;



const LABEL_VERTES_SHADER_SOURCE = `
 attribute vec4 aVertexPosition;
                void main(void) {
                    gl_Position = aVertexPosition;
                }
`;

const LABEL_FRAGMENT_SHADER_SOURCE = `
 precision mediump float;

uniform vec2 u_resolution;
uniform vec4 wvColors[15];// 颜色数组
uniform float wvThresholds[15];
uniform int wvColorNum;// 颜色数量

vec4 getColor(float value) {
    vec4 tmp1=vec4(0.);
    vec4 tmp2=vec4(0.);
    vec4 color = vec4(0.);
    float fidx = value * float(wvColorNum - 1);
    int index = int(ceil(fidx));
    float t = fract(fidx);
     if(index==1)
    {
        tmp1=wvColors[0];
        tmp2=wvColors[1];
    }
    else if(index==2)
    {
        tmp1=wvColors[1];
        tmp2=wvColors[2];
    }
    else if(index==3)
    {
        tmp1=wvColors[2];
        tmp2=wvColors[3];
    }
    else if(index==4)
    {
        tmp1=wvColors[3];
        tmp2=wvColors[4];
    }
    else if(index==5)
    {
        tmp1=wvColors[4];
        tmp2=wvColors[5];
    }
    else if(index==6)
    {
        tmp1=wvColors[5];
        tmp2=wvColors[6];
    }
    else if(index==7)
    {
        tmp1=wvColors[6];
        tmp2=wvColors[7];
    }
    else if(index==8)
    {
        tmp1=wvColors[7];
        tmp2=wvColors[8];
    }
    else if(index==9)
    {
        
        tmp1=wvColors[8];
        tmp2=wvColors[9];
    }
    else if(index==10)
    {
        tmp1=wvColors[9];
        tmp2=wvColors[10];
    }
    else if(index==11)
    {
        tmp1=wvColors[10];
        tmp2=wvColors[11];
    }
    else if(index==12)
    {
        tmp1=wvColors[11];
        tmp2=wvColors[12];
    }
    else if(index==13)
    {
        tmp1=wvColors[12];
        tmp2=wvColors[13];
    }
    else if(index==14)
    {
        tmp1=wvColors[13];
        tmp2=wvColors[14];
    }
        
    color=mix(tmp1,tmp2,t);
    return color;
} 
void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;


    vec4 color = getColor(st.y);

    gl_FragColor = color;
}
`;