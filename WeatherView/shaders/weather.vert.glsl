attribute vec2 a_position;
varying vec2 v_texCoord;
uniform vec2 coordOffset[2];

// 同坐标系转换
vec2 normal_cvt(vec2 p)
{
    // + 视口大于图像范围  - 视口小于图像范围
    p.y=coordOffset[1].y+(coordOffset[0].y-coordOffset[1].y)*p.y;
    p.x=coordOffset[0].x+(coordOffset[1].x-coordOffset[0].x)*p.x;
    p.y=1.-p.y;
    return p;
}

// 视口墨卡托, 网格点数据是经纬度
vec2 mercator_cvt(vec2 p)
{
    return vec2(0);
}
void main(){
    gl_Position=vec4(a_position,0.,1.);
    v_texCoord=a_position*.5+.5;// 将顶点坐标转换为纹理坐标
    v_texCoord=normal_cvt(v_texCoord);
}