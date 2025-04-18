

function ASSERT(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}
// 十六进制的颜色字符串转为GLSL的颜色表示形式
function RGBA_TO_GLSL_VEC4(hex) //返回结果 RGBA
{
    const numberValue = parseInt(hex, 16);
    return [
        ((numberValue >> 24) & 0xFF) / 255.0
            ((numberValue >> 16) & 0xFF) / 255.0,
        ((numberValue >> 8) & 0xFF) / 255.0,
        (numberValue & 0xFF) / 255.0,
    ];
}

function ARGB_TO_GLSL_VEC4(hex)  //返回结果 RGBA
{
    const numberValue = parseInt(hex, 16);
    return [
        ((numberValue >> 16) & 0xFF) / 255.0,
        ((numberValue >> 8) & 0xFF) / 255.0,
        (numberValue & 0xFF) / 255.0,
        ((numberValue >> 24) & 0xFF) / 255.0
    ];
}

// 以数据网格范围为归一化单位, 获取屏幕坐标在网格范围内的归一化坐标
function ScreebRelatePosInGrid(screen, grid) {
    var off = {
        left: (screen.left - grid.left) / (grid.right - grid.left),
        bottom: (screen.bottom - grid.bottom) / (grid.top - grid.bottom),
        right: (screen.right - grid.left) / (grid.right - grid.left),
        top: (screen.top - grid.bottom) / (grid.top - grid.bottom)
    }
    return [[off.left, off.top], [off.right, off.bottom]];
}

// 以屏幕范围为归一化单位, 获取网格坐标在屏幕范围内的归一化坐标
function GridRelatePosInScreen(screen, grid) {
    var off = {
       left : (grid.left - screen.left) / (screen.right - screen.left),
       bottom : (grid.bottom - screen.bottom) / (screen.top - screen.bottom),
       right : (grid.right - screen.left) / (screen.right - screen.left),
       top : (grid.top - screen.bottom) / (screen.top - screen.bottom)

    }
    return [[off.left, off.top], [off.right, off.bottom]];
}
async function LoadShaderFile(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`加载 GLSL 文件失败: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error(error);
        return null;
    }
}

///
/// --- webgl ----
function LoadGL(canvas)
{
    const gl = canvas.getContext('webgl');

    if (!gl) {
        alert('WebGL not supported, falling back on experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
        alert('Your browser does not support WebGL');
    }
    return gl;
}


// 创建着色器
function CreateShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// 创建程序
function CreateProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

// 加载图像并创建纹理
function LoadTexture(gl, url, func, args) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // 设置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // 加载图像
    const image = new Image();
    image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        func(gl, args);
    };
    image.src = url;
}
// 计算几何中心点的辅助函数
function getCentroid(geometry) {

    let coords;
    if(geometry.type === 'MultiPolygon' || geometry.type === 'MutliLineString')
    {
        coords = geometry.coordinates[0][0];
    }
    else{
        coords = geometry.coordinates[0];
    }
    let x = 0, y = 0, len = coords.length;
    for (let i = 0; i < len; i++) {
        x += coords[i][0];
        y += coords[i][1];
    }
    return [y / len, x / len];
}

function LeafletLoadGeoJSON(map, url, _style) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                onEachFeature: function(feature, layer) {
                    // 添加省份名称标注
                    if (feature.properties.NAME) {
                        const centroid = getCentroid(feature.geometry);
                        L.marker(centroid, {
                            icon: L.divIcon({
                                className: 'province-label',
                                html: `<div style="position: relative; 
                                        transform: translate(-50%, -50%);
                                        font-size: 12px; 
                                        color: #333;
                                        text-shadow: 1px 1px 2px white;">${feature.properties.NAME}</div>`,
                                iconSize: [100, 20]
                            })
                        }).addTo(map);
                    }
            
                    // 点击事件处理
                    layer.on({
                        click: function(e) {
                            // 移除之前的高亮效果
                            if(window.highlightedProvince) {
                                window.highlightedProvince.setStyle(_style);
                            }
            
                            // 设置高亮样式
                            layer.setStyle({
                                color: '#ff0000',
                                weight: 3
                            });
            
                            // 保存当前高亮省份
                            window.highlightedProvince = layer;
            
                            // 移动视图到省份范围
                            const bounds = layer.getBounds();
                            map.fitBounds(bounds);
            
                            // 显示省份信息
                            layer.bindPopup(feature.properties.NAME).openPopup();
                        }
                    });
                },
                style: _style
            }).addTo(map);
        })
        .catch(error => console.error('Error loading GeoJSON:', error));
}