
// 渲染降雨气温等静态数据函数,结合具体业务处理
function RenderNormal(gl, params) {

    // let alpha = parseFloat(output.innerText)/100.0;
    // ctxWeather.globalAlpha = cfg.alpha;
    //cvsWeather.innerHTML =`Opacity: ${alpha}%`;

    const vertexShader = CreateShader(gl, gl.VERTEX_SHADER, WEATHER_VERTES_SHADER_SOURCE);
    const fragmentShader = CreateShader(gl, gl.FRAGMENT_SHADER, WEATHER_FRAGMENT_SHADER_SOURCE);
    const program = CreateProgram(gl, vertexShader, fragmentShader);
    gl.depthMask(false); // 禁用深度写入
    gl.depthMask(true); // 重新启用深度写入
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 设置视口
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // 使用程序
    gl.useProgram(program);

    // 设置顶点数据
    var verticesTexCoords = new Float32Array([
        //顶点坐标   纹理坐标
        //------\\ //----\\
        -1, 1, 0.0, 1.0, //顶点1
        -1, -1, 0.0, 0.0, //顶点2
        1, 1, 1.0, 1.0, //顶点3
        1, -1, 1.0, 0.0, //顶点4
    ]);
    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

    const screenOffCoords = ScreebRelatePosInGrid(params.cvsBound, params.gridBound);
    const gridOffCoords = GridRelatePosInScreen(params.cvsBound, params.gridBound);


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

    // 坐标偏移计算参数传给顶点着色器
    const glLocOffset = gl.getUniformLocation(program, 'coordOffset');
    gl.uniform2fv(glLocOffset, screenOffCoords.flat());

    // 坐标偏移计算参数传给片段着色器
    // const glLocOffset2 = gl.getUniformLocation(program, 'coordOffset');
    // gl.uniform2fv(glLocOffset2, screenOffCoords.flat());
    // 将颜色传递给着色器 
    const glLocColors = gl.getUniformLocation(program, 'wvColors');
    gl.uniform4fv(glLocColors, params.wRenderColors.flat());

    // 将颜色传递给着色器 
    const glLocThresholds = gl.getUniformLocation(program, 'wvThresholds');
    gl.uniform1fv(glLocThresholds, params.wRenderThresholds);

    // 设置有效颜色数量
    const glLocColorNum = gl.getUniformLocation(program, 'wvColorNum');
    gl.uniform1i(glLocColorNum, params.wRenderColors.length);

    // 设置纹理单元
    const glLocColorTexture = gl.getUniformLocation(program, 'u_image');
    gl.uniform1i(glLocColorTexture, 0);

    // 绘制
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function RenderLable(gl) {
    const vertexShader = CreateShader(gl, gl.VERTEX_SHADER, LABEL_VERTES_SHADER_SOURCE);
    const fragmentShader = CreateShader(gl, gl.FRAGMENT_SHADER, LABEL_FRAGMENT_SHADER_SOURCE);
    const program = CreateProgram(gl, vertexShader, fragmentShader);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);



    // 设置视口
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // 使用程序
    gl.useProgram(program);

    // Set resolution uniform  
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    // Set the clear color  
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Create a full-screen quad  
    const vertices = new Float32Array([
        -1.0, 1.0,
        -1.0, -1.0,
        1.0, -1.0,
        1.0, 1.0,
    ]);

    // Create a buffer for the quad's vertices  
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, 'aVertexPosition');
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);


    // 将颜色传递给着色器 
    const glLocColors = gl.getUniformLocation(program, 'wvColors');
    gl.uniform4fv(glLocColors, params.wRenderColors.flat());

    // 将颜色传递给着色器 
    const glLocThresholds = gl.getUniformLocation(program, 'wvThresholds');
    gl.uniform1fv(glLocThresholds, params.wRenderThresholds);

    // 设置有效颜色数量
    const glLocColorNum = gl.getUniformLocation(program, 'wvColorNum');
    gl.uniform1i(glLocColorNum, params.wRenderColors.length);


    // Draw the circle  
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}