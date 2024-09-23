

document.addEventListener('DOMContentLoaded', function () {
    // 创建地图
    const map = L.map('map').setView([35.5, 104.5], 4); // 设置初始视图

    // 读取 GeoJSON 文件
    fetch('geojson/china.geojson')
        .then(response => response.json())
        .then(data => {
            // 将 GeoJSON 数据添加到地图
            L.geoJSON(data, {
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties.name) {
                        layer.bindPopup(feature.properties.name);
                    }
                }
            }).addTo(map);

            // 调整地图视图以适应 GeoJSON 数据
            map.fitBounds(L.geoJSON(data).getBounds());
        })
        .catch(error => {
            console.error('Error loading GeoJSON:', error);
        });

    // 获取 Canvas 元素
    /// 下面开始加载矩阵数据并且渲染
    const cvsWeather = document.getElementById('cvs-weather');

    // 指定的经纬度区域
    const left = 74.0;
    const top = 54.0;
    const right = 135.0;
    const bottom = 18.0;
    var canvasGeoRect = {
        left: 74.0,
        right: 135.0,
        top: 54.0,
        bottom: 18.0
    }

    // 计算 Canvas 的位置和大小
    function updateCanvasPositionAndSize() {
        const topLeft = map.latLngToLayerPoint([top, left]);
        const bottomRight = map.latLngToLayerPoint([bottom, right]);

        cvsWeather.width = bottomRight.x - topLeft.x;
        cvsWeather.height = bottomRight.y - topLeft.y;
        cvsWeather.style.position = 'absolute';
        cvsWeather.style.top = `${topLeft.y}px`;
        cvsWeather.style.left = `${topLeft.x}px`;

        // 计算 Canvas 视口的经纬度范围
        const canvasTopLeft = map.containerPointToLatLng([topLeft.x, topLeft.y]);
        const canvasBottomRight = map.containerPointToLatLng([bottomRight.x, bottomRight.y]);

        const canvasBounds = {
            topLeft: canvasTopLeft,
            bottomRight: canvasBottomRight
        };

        console.log('Canvas Bounds:', canvasBounds);
        return canvasBounds;
    }

    // 初始化 WebGL
    function initWebGL() {

        var imageGeoRect = {
            left: 74.0,
            right: 135.0,
            top: 54.0,
            bottom: 18.0
        }
        var render_cfg = {
            weather: {
                type: APCP,
                provider: NOAA
            },
            texture: {
                width: 0,
                height: 0
            },
            alpha: 0.8,
            url: "apcp.png"
        }
        const wvMin = W_CONVERT_OPT[render_cfg.weather.type].min;
        const wvMax = W_CONVERT_OPT[render_cfg.weather.type].max;
        const wvScale = W_CONVERT_OPT[render_cfg.weather.type].scale;


        // 设置颜色和数值  
        var wRenderColors = [];
        var wRenderThresholds = [];
        // 根据给定数值进行对应的GLSL转换

        var colorLables = W_DEFAULT_COLOR_LABLES;
        for (var i = 0; i < colorLables[render_cfg.weather.type].thresholds.length; ++i) {
            var glsl_color = ARGB_TO_GLSL_VEC4(colorLables[render_cfg.weather.type].colors[i]);
            var glsl_threshold = (colorLables[render_cfg.weather.type].thresholds[i] - wvMin) * wvScale / 255.0;
            wRenderColors[i] = glsl_color;
            wRenderThresholds[i] = glsl_threshold;
        }

        const glWeather = LoadGL(cvsWeather);
        // 不同机器支持的顶点数组长度不一样, 有些机器不能显示
        ASSERT(wRenderColors.length <= glWeather.getParameter(glWeather.MAX_VERTEX_ATTRIBS), "该机器顶点数组长度最大支持：" + glWeather.getParameter(glWeather.MAX_VERTEX_ATTRIBS) + ", 当前顶点数组长度:" + wRenderColors.length)
        // 渲染函数,结合具体业务处理
        function RenderNormal(gl, cfg) {
            let alpha = 0.8;
            // ctxWeatner.globalAlpha = cfg.alpha;
            //cvsWeather.innerHTML =`Opacity: ${alpha}%`;

            const vertexShader = CreateShader(gl, gl.VERTEX_SHADER, WEATHER_VERTES_SHADER_SOURCE);
            const fragmentShader = CreateShader(gl, gl.FRAGMENT_SHADER, WEATHER_FRAGMENT_SHADER_SOURCE);
            const program = CreateProgram(gl, vertexShader, fragmentShader);
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            // 设置视口
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            // 使用程序
            gl.useProgram(program);

            var verticesTexCoords = new Float32Array([
                //顶点坐标   纹理坐标
                //------\\ //----\\
                -1, 1, 0.0, 1.0, //顶点1
                -1, -1, 0.0, 0.0, //顶点2
                1, 1, 1.0, 1.0, //顶点3
                1, -1, 1.0, 0.0, //顶点4
            ]);
            var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

            const offCoords = OffSetBetweenScreenAndGrid(canvasGeoRect, imageGeoRect);


            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

            // 设置顶点属性
            const glLocPosAttr = gl.getAttribLocation(program, 'a_position');
            gl.vertexAttribPointer(glLocPosAttr, 2, gl.FLOAT, false, FSIZE * 4, 0);
            gl.enableVertexAttribArray(glLocPosAttr);

            const glLocTexCoordAttr = gl.getAttribLocation(program, 'a_texCoord');

            gl.vertexAttribPointer(glLocTexCoordAttr, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
            gl.enableVertexAttribArray(glLocTexCoordAttr);

            // const textureSizeLocation = gl.getUniformLocation(program, 'u_textureSize');
            // gl.uniform2f(textureSizeLocation, cfg.texture.width, cfg.texture.heigth);

            // 坐标偏移计算参数
            const glLocOffset = gl.getUniformLocation(program, 'coordOffset');
            gl.uniform2fv(glLocOffset, offCoords.flat());


            // 将颜色传递给着色器 
            const glLocColors = gl.getUniformLocation(program, 'wvColors');
            gl.uniform4fv(glLocColors, wRenderColors.flat());

            // 将颜色传递给着色器 
            const glLocThresholds = gl.getUniformLocation(program, 'wvThresholds');
            gl.uniform1fv(glLocThresholds, wRenderThresholds);

            // 设置有效颜色数量
            const glLocColorNum = gl.getUniformLocation(program, 'wvColorNum');
            gl.uniform1i(glLocColorNum, wRenderColors.length);

            // 设置纹理单元
            const glLocColorTexture = gl.getUniformLocation(program, 'u_image');
            gl.uniform1i(glLocColorTexture, 0);
            // 绘制
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        }

        LoadTexture(glWeather, render_cfg.url, RenderNormal, render_cfg);
    }

    canvasGeoRect = updateCanvasPositionAndSize();
    initWebGL();

    // 监听地图缩放、平移和拖动事件
    map.on('moveend', () => {
        canvasGeoRect = updateCanvasPositionAndSize();
        initWebGL();
    });

    // 监听地图拖动事件
    map.on('dragend', () => {
        canvasGeoRect = updateCanvasPositionAndSize();
        initWebGL();
    });

    // 监听窗口大小变化事件
    window.addEventListener('resize', () => {
        map.invalidateSize();
        canvasGeoRect = updateCanvasPositionAndSize();
        initWebGL();
    });
});