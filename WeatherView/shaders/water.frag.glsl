precision mediump float;

uniform sampler2D u_texture;// 基础纹理
uniform float u_time;// 时间变量
uniform vec2 u_resolution;// 画布分辨率
varying vec2 v_texCoord;

float u_maxH=9.48;
float u_minH=0.;
float u_maxQX=7.15;
float u_minQX=-0.86;
float u_maxQY=4.73;
float u_minQY=-5.46;

//////////////////////////////////////////////////
// 保留必要函数：噪声、water、river、seagrad 等 //
//////////////////////////////////////////////////

//////////////////////////////////////////////////
// 保留必要函数：噪声、water、river、seagrad 等 //
//////////////////////////////////////////////////

// 光照方向
const vec3 ld=normalize(vec3(.046,.188,.810));

float hash(vec2 p){
    float h=dot(p,vec2(127.1,311.7));
    return fract(sin(h)*43758.5453123-mod(u_time,8.)*.001);
}

float noise(vec2 p){
    vec2 i=floor(p);
    vec2 f=fract(p);
    vec2 u=f*f*(3.-2.*f);
    return-1.+2.*mix(
        mix(hash(i+vec2(0.,0.)),hash(i+vec2(1.,0.)),u.x),
        mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),
        u.y
    );
}

// 基础水波图，叠加简单噪声
float water(vec2 uv){
    uv+=noise(uv*.8);
    vec2 wv=1.-abs(sin(uv));
    return(wv.x+wv.y)*.5;
}

// 分层叠加 water
float river(vec2 uv){
    float s=0.;
    const float levels=4.;
    mat2 r=mat2(
        .4,-.24,
        .4,.27
    );
    for(float i=1.;i<=levels;i++){
        uv*=r;
        s+=water(uv*i*2.);
    }
    s/=(levels+1.);
    return s;
}

// 计算水面的法线扰动
vec3 seagrad(in vec2 uv,float bump,float t)
{
    uv*=20.;
    float hc=river(uv);
    vec2 off=vec2(3./(t),0.);
    float hh=river(uv+off);
    float hv=river(uv+off.yx);
    
    vec3 h=normalize(vec3(bump,hh-hc,0.));
    vec3 v=normalize(vec3(0.,hv-hc,bump));
    // cross 得到法线，再取负号保证朝向一致
    return -normalize(cross(h,v));
}

// 返回 0~1~0 的一个往返插值，用作模拟流动周期
float getMixValue(float cycle,out float offset1,out float offset2)
{
    // cycle 在 0~1 间，映射到 0~1~0
    float mixval=cycle*2.;
    if(mixval>1.)mixval=2.-mixval;
    
    offset1=cycle;
    // 第二份纹理相位偏移 0.5
    offset2=mod(offset1+.5,1.);
    return mixval;
}

// 高斯模糊函数
vec4 gaussianBlur(sampler2D image,vec2 uv,vec2 resolution,vec2 direction,float radius){
    // 高斯权重（固定值，可根据需要扩展）
    float weights[5];
    weights[0]=.227027;// 中心权重
    weights[1]=.1945946;// 第1层偏移权重
    weights[2]=.1216216;// 第2层偏移权重
    weights[3]=.054054;// 第3层偏移权重
    weights[4]=.016216;// 第4层偏移权重
    
    vec2 texOffset=direction/resolution;// 纹理偏移量，用于确定相邻像素位置
    vec4 color=texture2D(image,uv)*weights[0];// 以中心像素为基准计算
    
    // 对相邻像素采样并加权
    for(int i=1;i<=4;i++){// 循环 4 次，根据权重采样
        vec2 offset=float(i)*texOffset*radius;
        color+=texture2D(image,uv+offset)*weights[i];
        color+=texture2D(image,uv-offset)*weights[i];
    }
    
    return color;// 返回模糊后的颜色
}

vec4 lookup_wind(const vec2 uv){
    vec2 px=1./u_resolution;
    vec2 vc=(floor(uv*u_resolution))*px;
    vec2 f=fract(uv*u_resolution);
    vec4 tl=texture2D(u_texture,vc);
    vec4 tr=texture2D(u_texture,vc+vec2(px.x,0));
    vec4 bl=texture2D(u_texture,vc+vec2(0,px.y));
    vec4 br=texture2D(u_texture,vc+px);
    return mix(mix(tl,tr,f.x),mix(bl,br,f.x),f.y);
}

void main(){
    
    vec2 uv = v_texCoord.xy/u_resolution.xy;

    
    // 时间周期 T，用于控制水流动周期
    // --- 1. 让河面扰动更明显 ---
    vec2 largeScale=vec2(60.3);// 更大尺度的波
    float largeBump=.286;// 提高 bump
    float T=1.624;// 周期
    float cycle=mod(u_time,T)/T;
    float o1,o2;
    float mv=getMixValue(cycle,o1,o2);
    
    // 模拟水流的流向
    // 调用高斯模糊函数
    // vec4 vh = gaussianBlur(u_texture, uv, u_resolution, vec2(0.01), 5.0);
    //vec4 vh = lookup_wind(uv);
    vec4 vh=texture2D(u_texture,v_texCoord);
    vh.r = (vh.r*(u_maxH-u_minH)+u_minH)/max(abs(u_maxH), abs(u_minH));
    vh.g = (vh.g*(u_maxQX-u_minQX)+u_minQX)/max(abs(u_maxQX), abs(u_minQX));
    vh.b = (vh.b*(u_maxQY-u_minQY)+u_minQY)/max(abs(u_maxQY), abs(u_minQY));
    vec2 flow = -vh.gb;
    
    //vec2 flow=-mix(vec2(u_minQX,u_minQY),vec2(u_maxQX,u_maxQY),vh.gb);
    // flow.y=-flow.y;
    
    // float tt = flow.x;
    // flow.x = flow.y;
    // flow.y = tt;
    
    float speed=1.;
    
    float t=2.852;// 用于偏移计算
    // 计算更大频率的法线
    // 注意这里将 scale 改为 largeScale
    vec3 g1=seagrad(largeScale*uv+flow*o1*speed,largeBump,t);
    vec3 g2=seagrad(largeScale*uv+flow*o2*speed,largeBump,t);
    vec3 g3=seagrad(largeScale*uv+vec2(.1,.2)+flow*o1*speed*1.,largeBump,t);
    vec3 g4=seagrad(largeScale*uv+vec2(.3,.2)+flow*o2*speed*1.,largeBump,t);
    
    vec3 gm=mix(g2,g1,mv);
    gm+=mix(g4,g3,mv);
    gm=normalize(gm);
    
    // --- 2. 漫反射与高光 ---
    // 漫反射
    float wrp=.500;
    float wd=max(dot(gm,ld),.5);
    wd=(wd+wrp)/(1.+wrp);
    vec4 waterColorBase=vec4(.695,.374,.204,1.);
    
    //waterColorBase = vec4(0.016,0.635,0.358,1.000);
    vec4 diffuse=waterColorBase*wd*.6;
    
    // 简单镜面高光
    vec3 viewDir=vec3(0.,0.,-1.);// 俯视
    vec3 halfVec=normalize(-viewDir+ld);
    float specFactor=max(dot(halfVec,gm),0.);
    // 适当提高强度
    float spec=pow(specFactor,80.)*2.;
    
    // --- 3. 模拟环境或天空反射 ---
    vec3 rDir=reflect(-viewDir,gm);
    float skyVal=clamp(rDir.y*.788+.612,0.,1.);
    // 从深蓝到浅蓝再到白
    vec3 skyBottom=vec3(.991,.991,.991);
    vec3 skyTop=vec3(1.,1.,1.);
    vec3 skyCol=mix(skyBottom,skyTop,skyVal);
    // 可以根据 Fresnel 叠加反射
    float fres=pow(1.-max(dot(-viewDir,gm),0.),2.);
    vec4 reflectColor=vec4(skyCol*fres,1.)*.4;
    
    // 组合
    gl_FragColor=diffuse+reflectColor+vec4(spec);
    gl_FragColor.a=1.;
    
    // if(vh.r<0.01){
    //     gl_FragColor=vec4(0.);
    // }
}