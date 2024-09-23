

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

function OffSetBetweenScreenAndGrid(screen, grid) {
    var off = {
        left: (screen.left - grid.left) / (grid.right - grid.left),
        bottom: (screen.bottom - grid.bottom) / (grid.top - grid.bottom),
        right: (screen.right - grid.left) / (grid.right - grid.left),
        top: (screen.top - grid.bottom) / (grid.top - grid.bottom)
    }
    return [[off.left, off.top], [off.right, off.bottom]];
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

    // 加载图像
    const image = new Image();
    image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        func(gl, args);
    };
    image.src = url;
}