/// 气象数据类型, 全部为近地面数据
const APCP = "APCP";    // 降雨
const RH = "RH";        // 湿度
const TMAX = "TMAX";    // 最大气温
const TMIN = "TMIN";    // 最小气温
const TMP = "TMP";      // 气温
const PRES = "PRES";    // 气压
const UGRD = "UGRD";    // u方向风速
const VGRD = "VGRD";    // v方向风速
const DSWRF = "DSWRF";  // 短波辐射
const ULWRF = "ULWRF";  // 长波辐射
const WNDF = "WNDF";    // 风速流场

/// 气象数据源类型
const HENANQX = "HENANQX";  // 河南气象
const NOAA = "NOAA";        // 美国国家气象和大气管理局
const ECMWF = "ECMWF";      // 欧洲中期天气预报中心
const DWD = "DWD";          // 德国 DWD
const METEO = "METEO";      // 法国气象局
const BOM = "BOM";          // 澳大利亚
const KNMI = "KNMI";        // 荷兰
const DMI = "DMI";          // 丹麦
const CMA = "CMA";          // 中国
const GEM = "GEM";          // 加拿大
const MET = "MET";          // 挪威
const JMA = "JMA";          // 日本气象厅

const LABLE_FRAG_GLSL = "shaders/lable.frag.glsl";
const LABLE_VERT_GLSL = "shaders/lable.vert.glsl";
const WATER_FRAG_GLSL = "shaders/water.frag.glsl";
const WATER_VERT_GLSL = "shaders/water.vert.glsl";
const WEATHER_FRAG_GLSL = "shaders/weather.frag.glsl";
const WEATHER_VERT_GLSL = "shaders/weather.vert.glsl";
const WIND_FRAG_GLSL = "shaders/wind.frag.glsl";
const WIND_VERT_GLSL = "shaders/wind.vert.glsl";

const W_TYPES = [
    APCP,
    RH,
    TMP,
    PRES,
    DSWRF,
    ULWRF
]

const W_PROVIDERS = [
    HENANQX,
    NOAA,
    ECMWF
]

// 由实际数值转换为0-255之间数据的参数
// R通道值为  (VAL - min) * scale ,保证这个值在 0-255之间 
// 数据恢复时 255/scale + min
const W_CONVERT_OPT = {
    APCP: {
        max: 250.0,
        min: 0.0,
        scale: 1.,
        unit: "mm"
    }
    ,
    TMP: {
        max: 40.0,
        min: -12.0,
        scale: 4.0,
        unit: "°C"
    },
    TMAX: {
        max: 40.0,
        min: -12.0,
        scale: 4.0,
        unit: "°C"
    },
    TMIN: {
        max: 40.0,
        min: -12.0,
        scale: 4.0,
        unit: "°C"
    },
    RH: {
        max: 100.0,
        min: 0.0,
        scale: 2.5,
        unit: "%"
    },
    UGRD: {
        max: 50.0,
        min: -50.0,
        scale: 2.5,
        unit: "m/s"
    },
    VGRD: {
        max: 50.0,
        min: -50.0,
        scale: 2.5,
        unit: "m/s"
    },
    PRES: {
        max: 1400.0,
        min: 0.0,
        scale: 0.55,
        unit: "hPa"
    },
    DSWRF: {
        max: 1100.0,
        min: 0,
        scale: 0.255,
        unit: "W/m²"
    },
    ULWRF: {
        max: 550.0,
        min: 0,
        scale: 0.5,
        unit: "W/m²"
    }

}

//数据类型图例信息
const W_TYPE_LEGEND = {
    "CN": {
        APCP: "累计降雨量",
        RH: "相对湿度",
        TMP: "温度",
        TMAX: "最高温度",
        TMIN: "最低温度",
        UGRD: "U向风速",
        VGRD: "V向风速",
        PRES: "近地气压",
        DSWRF: "短波辐射",
        ULWRF: "长波辐射",
        WNDF: "风速流场"
    },
    "EN":
    {
        APCP: "Precipitation",
        RH: "Relative Humidity",
        TMP: "Temperature",
        TMAX: "Max Temperature",
        TMIN: "Min Temperature",
        UGRD: "U-Wind Speed",
        VGRD: "V-Wind Speed",
        PRES: "Pressure",
        DSWRF: "Downward Short-Wave Radiation",
        ULWRF: "Upward Long-Wave Radiation",
        WNDF: "Wind Floow"
    }

}

// 数据源图例信息
const W_PROVIDER_LEGEND =
{
    "CN": {
        HENANQX: "河南气象预报",
        NOAA: "美国全球预报",
        ECMWF: "欧洲气象中期数值预报"
    },
    "EN": {
        HENANQX: "Henan Weather Forecast",
        NOAA: NOAA,
        ECMWF: ECMWF
    }
}

// 默认的阈值和颜色
const W_DEFAULT_COLOR_LABLES = {
    'APCP': {
        'thresholds': [
            0.0,
            3,
            10,
            25,
            50,
            100,
            250,
            999
        ],
        'colors': [
            '00000000',
            'cfa5f28f',
            'cf3da700',
            'cf61bbfd',
            'cf0001fb',
            'cffe00fe',
            'cf82033b',
            'cfff033b'
        ]
    },
    'APCP2':
    {
        'thresholds': [
            0.0,
            1,
            10,
            25,
            100,
            300,
            999
        ],
        'colors': [
            '004352BF',
            'cf4251BE',
            'cf29B0E3',
            'cf27DCA8',
            'cfF09E28',
            'cf8D1003',
            'cf8A0B03'
        ]
    },
    RH: {
        'thresholds': [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
        'colors': [
            'cfef6917',
            'cffb913e',
            'cff8d475',
            'cffbf0a6',
            'cfdff7d7',
            'cfd8f7e7',
            'cf8ce1fe',
            'cf6fb7e6',
            'cf2b59dc',
            'cf3226ce'
        ]
    },
    PRES: {
        'thresholds': [500, 600, 700, 800, 900, 950, 1000, 1010, 1025, 1040, 1060],
        'colors': ['cf1464d2', 'cf2882f0', 'cf50a5f5', 'cf96d2fa', 'cfb4f0fa', 'cfcbf8fd', 'cfb4faaa', 'cf78f573', 'cf37d23c', 'cf1eb41e', 'cf0fa00f']
    },
    TMP: {
        'thresholds': [-999, -12.0, -8.0, -4, 0, 4, 8, 12, 16, 20, 24, 28, 32, 35, 37, 50],
        'colors': ['00000000','cf006699', 'cf2f6ad2', 'cf1c74cc', 'cf8dccff', 'cf9de0f5', 'cfdefbff', 'cff2ffe5', 'cfccffcc', 'cfc9ff98', 'cfffffa0', 'cfffe5ba', 'cfffcc9c', 'cfe39995', 'cfff4200', 'cfeb0000']
    },
    TMAX: {
        'thresholds': [-12.0, -8.0, -4, 0, 4, 8, 12, 16, 20, 24, 28, 32, 35, 37, 50],
        'colors': ['cf006699', 'cf2f6ad2', 'cf1c74cc', 'cf8dccff', 'cf9de0f5', 'cfdefbff', 'cff2ffe5', 'cfccffcc', 'cfc9ff98', 'cfffffa0', 'cfffe5ba', 'cfffcc9c', 'cfe39995', 'cfff4200', 'cfeb0000']
    },
    TMIN: {
        'thresholds': [-12.0, -8.0, -4, 0, 4, 8, 12, 16, 20, 24, 28, 32, 35, 37, 50],
        'colors': ['cf006699', 'cf2f6ad2', 'cf1c74cc', 'cf8dccff', 'cf9de0f5', 'cfdefbff', 'cff2ffe5', 'cfccffcc', 'cfc9ff98', 'cfffffa0', 'cfffe5ba', 'cfffcc9c', 'cfe39995', 'cfff4200', 'cfeb0000']
    },
    DSWRF: {
        'thresholds': [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550],
        'colors': ['cf1e50b3', 'cf3a5bc7', 'cf4c74d8', 'cf62a7c6', 'cf80d4e1', 'cfa1e1f1', 'cfffee93', 'cfffdd55', 'cfffcc67', 'cfffbb78', 'cfff6f31']
    },
    ULWRF: {
        'thresholds': [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550],
        'colors': ['cf1e50b3', 'cf3a5bc7', 'cf4c74d8', 'cf62a7c6', 'cf80d4e1', 'cfa1e1f1', 'cfffee93', 'cfffdd55', 'cfffcc67', 'cfffbb78', 'cfff6f31']
    }
}