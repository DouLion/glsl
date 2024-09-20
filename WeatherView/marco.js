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
        min: 960.0,
        scale: 0.55,
        unit: "hPa"
    },
    DSWRF: {
        max: 1100.0,
        min: 100,
        scale: 0.255,
        unit: "W/m²"
    },
    ULWRF: {
        max: 550.0,
        min: 50,
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
    APCP: {
        "thresholds": [
            1,
            10,
            25,
            50,
            100,
            250
        ],
        "colors": [
            "afa5f28f",
            "af3da700",
            "af61bbfd",
            "af0001fb",
            "affe00fe",
            "af82033b"
        ]
    },
    RH: {
        "thresholds": [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
        "colors": [
            "afef6917",
            "affb913e",
            "aff8d475",
            "affbf0a6",
            "afdff7d7",
            "afd8f7e7",
            "af8ce1fe",
            "af6fb7e6",
            "af2b59dc",
            "af3226ce"
        ]
    },
    PRES: {
        "thresholds": [960, 980, 985, 990, 995, 1000, 1050, 1200, 1250, 1300, 1350, 1400],
        "colors": ["af1464d2", "af2882f0", "af50a5f5", "af96d2fa", "afb4f0fa", "afcbf8fd", "afffffff", "afb4faaa", "af78f573", "af37d23c", "af1eb41e", "af0fa00f"]
    },
    TMP: {
        "thresholds": [-12.0, -8.0, -4, 0, 4, 8, 12, 16, 20, 24, 28, 32, 35, 37, 40],
        "colors": ["af006699", "af2f6ad2", "af1c74cc", "af8dccff", "af9de0f5", "afdefbff", "aff2ffe5", "afccffcc", "afc9ff98", "afffffa0", "afffe5ba", "afffcc9c", "afe39995", "afff4200", "afeb0000"]
    },
    TMAX: {
        "thresholds": [-12.0, -8.0, -4, 0, 4, 8, 12, 16, 20, 24, 28, 32, 35, 37, 40],
        "colors": ["af006699", "af2f6ad2", "af1c74cc", "af8dccff", "af9de0f5", "afdefbff", "aff2ffe5", "afccffcc", "afc9ff98", "afffffa0", "afffe5ba", "afffcc9c", "afe39995", "afff4200", "afeb0000"]
    },
    TMIN: {
        "thresholds": [-12.0, -8.0, -4, 0, 4, 8, 12, 16, 20, 24, 28, 32, 35, 37, 40],
        "colors": ["af006699", "af2f6ad2", "af1c74cc", "af8dccff", "af9de0f5", "afdefbff", "aff2ffe5", "afccffcc", "afc9ff98", "afffffa0", "afffe5ba", "afffcc9c", "afe39995", "afff4200", "afeb0000"]
    },
    ULWRF: {
        "thresholds": [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550],
        "colors": ["af1e50b3", "af3a5bc7", "af4c74d8", "af62a7c6", "af80d4e1", "afa1e1f1", "afffee93", "afffdd55", "afffcc67", "afffbb78", "afff6f31"]
    },
    DSWRF: {
        "thresholds": [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100],
        "colors": ["afe0f3f8", "afabd9e9", "af74add1", "af4575b4", "af313695", "affee090", "affdae61", "aff46d43", "afd73027", "afa50026", "af800026"]
    }
}