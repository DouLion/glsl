

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


function Lonlat2Mercator(lon, lat) {
    return [
        lon / 180 * Math.PI * 6378137,
        Math.log(Math.tan((90 + lat) * Math.PI / 360)) * 6378137
    ]
}

function Mercator2Lonlat(x, y) {
    return [
        x / 20037508.34 * 180,
        y / 20037508.34 * 180
    ]
}



// 以数据网格范围为归一化单位, 获取屏幕坐标在网格范围内的归一化坐标
function ScreebRelatePosInGrid(screen, grid) {

    // 转墨卡托计算
    var smct = {
        left: Lonlat2Mercator(screen.left, screen.bottom)[0],
        bottom: Lonlat2Mercator(screen.left, screen.bottom)[1],
        right: Lonlat2Mercator(screen.right, screen.top)[0],
        top: Lonlat2Mercator(screen.right, screen.top)[1]
    };
    var gmct = {
        left: Lonlat2Mercator(grid.left, grid.bottom)[0],
        bottom: Lonlat2Mercator(grid.left, grid.bottom)[1],
        right: Lonlat2Mercator(grid.right, grid.top)[0],
        top: Lonlat2Mercator(grid.right, grid.top)[1]
    };

    var off = {
        left: (smct.left - gmct.left) / (gmct.right - gmct.left),
        bottom: (smct.bottom - gmct.bottom) / (gmct.top - gmct.bottom),
        right: (smct.right - gmct.left) / (gmct.right - gmct.left),
        top: (smct.top - gmct.bottom) / (gmct.top - gmct.bottom)
    }
    return [[off.left, off.top], [off.right, off.bottom]];
}

// 以屏幕范围为归一化单位, 获取网格坐标在屏幕范围内的归一化坐标
function GridRelatePosInScreen(screen, grid) {
    var off = {
        left: (grid.left - screen.left) / (screen.right - screen.left),
        bottom: (grid.bottom - screen.bottom) / (screen.top - screen.bottom),
        right: (grid.right - screen.left) / (screen.right - screen.left),
        top: (grid.top - screen.bottom) / (screen.top - screen.bottom)

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
function LoadGL(canvas) {
    var gl = canvas.getContext('webgl');

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
function LoadTexture(_canvas, url, func, args) {
    return new Promise((resolve, reject) => {
        // var _ctx = _canvas.getContext('2d');
        // _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
        // 加载图像
        const image = new Image();
        image.crossOrigin = "Anonymous"; // 启用 CORS 请求
        image.src = url;
        console.log(url)
        image.onload = function () {
            const gl = _canvas.getContext('webgl') || _canvas.getContext('experimental-webgl');
            if (!gl) {
                reject('无法初始化WebGL上下文');
                return;
            }
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);

            // 设置纹理参数
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            func(gl, args);
            console.log(_canvas.style.opacity)
            resolve(_canvas);
        };
        image.onerror = function () {
            reject('图像加载失败');
        };

    });
}
// 计算几何中心点（质心）的辅助函数
function getCentroid(geometry) {
    if (!geometry || !geometry.type) {
        throw new Error("Invalid geometry input");
    }

    let centroid;

    switch (geometry.type) {
        case "Point":
            // 如果是单个点，直接返回其坐标
            centroid = geometry.coordinates;
            break;

        case "LineString":
            // 对于折线，按线段长度加权计算质心
            centroid = getLineStringCentroid(geometry.coordinates);
            break;

        case "Polygon":
            // 对于单个多边形，按面积加权计算质心
            centroid = getPolygonCentroid(geometry.coordinates[0]); // 外环
            break;

        case "MultiPolygon":
            // 对于多个多边形，按总面积加权计算质心
            centroid = getMultiPolygonCentroid(geometry.coordinates);
            break;

        case "MultiLineString":
            // 对于多个折线，按总长度加权计算质心
            centroid = getMultiLineStringCentroid(geometry.coordinates);
            break;

        default:
            throw new Error(`Unsupported geometry type: ${geometry.type}`);
    }

    return centroid;
}

// 计算 LineString 的质心
function getLineStringCentroid(coords) {
    let totalLength = 0;
    let cx = 0, cy = 0;

    for (let i = 0; i < coords.length - 1; i++) {
        const [x1, y1] = coords[i];
        const [x2, y2] = coords[i + 1];

        const segmentLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        totalLength += segmentLength;

        // 按线段中点加权
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        cx += midX * segmentLength;
        cy += midY * segmentLength;
    }

    return [cx / totalLength, cy / totalLength];
}

// 计算 Polygon 的质心
function getPolygonCentroid(coords) {
    let area = 0;
    let cx = 0, cy = 0;

    for (let i = 0; i < coords.length; i++) {
        const [x1, y1] = coords[i];
        const [x2, y2] = coords[(i + 1) % coords.length]; // 循环到第一个点

        const crossProduct = x1 * y2 - x2 * y1;
        area += crossProduct;
        cx += (x1 + x2) * crossProduct;
        cy += (y1 + y2) * crossProduct;
    }

    area *= 0.5;
    cx /= 6 * area;
    cy /= 6 * area;

    return [cx, cy];
}

// 计算 MultiPolygon 的质心
function getMultiPolygonCentroid(multiPolygonCoords) {
    let totalArea = 0;
    let cx = 0, cy = 0;

    for (const polygonCoords of multiPolygonCoords) {
        const [centroidX, centroidY] = getPolygonCentroid(polygonCoords[0]); // 外环
        const area = calculatePolygonArea(polygonCoords[0]);
        totalArea += area;
        cx += centroidX * area;
        cy += centroidY * area;
    }

    return [cx / totalArea, cy / totalArea];
}

// 计算 MultiLineString 的质心
function getMultiLineStringCentroid(multiLineStringCoords) {
    let totalLength = 0;
    let cx = 0, cy = 0;

    for (const lineStringCoords of multiLineStringCoords) {
        const [centroidX, centroidY] = getLineStringCentroid(lineStringCoords);
        const length = calculateLineStringLength(lineStringCoords);
        totalLength += length;
        cx += centroidX * length;
        cy += centroidY * length;
    }

    return [cx / totalLength, cy / totalLength];
}

// 辅助函数：计算多边形的面积
function calculatePolygonArea(coords) {
    let area = 0;

    for (let i = 0; i < coords.length; i++) {
        const [x1, y1] = coords[i];
        const [x2, y2] = coords[(i + 1) % coords.length];

        area += x1 * y2 - x2 * y1;
    }

    return Math.abs(area) / 2;
}

// 辅助函数：计算折线的总长度
function calculateLineStringLength(coords) {
    let length = 0;

    for (let i = 0; i < coords.length - 1; i++) {
        const [x1, y1] = coords[i];
        const [x2, y2] = coords[i + 1];
        length += Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    return length;
}

function LeafletLoadGeoJSON(map, url, _style) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            var _style1 = _style;
            _style1.weight = _style.weight * 1.5;
            _style1.color = "#FFFFFF";
            L.geoJSON(data, {
                style: _style1
            }).addTo(map);

            L.geoJSON(data, {
                style: _style
            }).addTo(map);
            // L.geoJSON(data, {
            //     onEachFeature: function (feature, layer) {
            //         // 添加省份名称标注
            //         // if (feature.properties.NAME) {
            //         // const centroid = getCentroid(feature.geometry);
            //         // L.marker(centroid, {
            //         //     icon: L.divIcon({
            //         //         className: 'province-label',
            //         //         html: `<div style="position: absolute; 
            //         //                 transform: translate(-50%, -100%);
            //         //                 font-size: 16px; 
            //         //                 color: #AAA;
            //         //                 text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
            //         //                 white-space: nowrap;">${feature.properties.NAME}</div>`,
            //         //         iconSize: [0, 0] // 使用 divIcon 时不需要指定iconSize
            //         //     })
            //         // }).addTo(map);}

            //         // 点击事件处理
            //         // layer.on({
            //         //     click: function (e) {
            //         //         // 移除之前的高亮效果
            //         //         if (window.highlightedProvince) {
            //         //             window.highlightedProvince.setStyle(_style);
            //         //         }

            //         //         // 设置高亮样式
            //         //         layer.setStyle({
            //         //             color: '#ff0000',
            //         //             weight: 3
            //         //         });

            //         //         // 保存当前高亮省份
            //         //         window.highlightedProvince = layer;

            //         //         // 移动视图到省份范围
            //         //         const bounds = layer.getBounds();
            //         //         map.fitBounds(bounds);

            //         //         // 显示省份信息
            //         //         layer.bindPopup(feature.properties.NAME).openPopup();
            //         //     }
            //         // });
            //     },
            //     style: _style
            // }).addTo(map);
        })
        .catch(error => console.error('Error loading GeoJSON:', error));
}

