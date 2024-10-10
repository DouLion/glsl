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
    "APCP": {
        "thresholds": [
            0.0,
            3,
            10,
            25,
            50,
            100,
            250,
            999
        ],
        "colors": [
            "00000000",
            "ffa5f28f",
            "ff3da700",
            "ff61bbfd",
            "ff0001fb",
            "fffe00fe",
            "ff82033b",
            "ffff033b"
        ]
    },
    "APCP2":
    {
        "thresholds": [
            0.0,
            3,
            10,
            25,
            100,
            300,
            999
        ],
        "colors": [
            "004352BF",
            "ff4251BE",
            "ff29B0E3",
            "ff27DCA8",
            "ffF09E28",
            "ff8D1003",
            "ff8A0B03"
        ]
    },
    RH: {
        "thresholds": [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
        "colors": [
            "ffef6917",
            "fffb913e",
            "fff8d475",
            "fffbf0a6",
            "ffdff7d7",
            "ffd8f7e7",
            "ff8ce1fe",
            "ff6fb7e6",
            "ff2b59dc",
            "ff3226ce"
        ]
    },
    PRES: {
        "thresholds": [960, 980, 985, 990, 995, 1000, 1050, 1200, 1250, 1300, 1350, 1400],
        "colors": ["ff1464d2", "ff2882f0", "ff50a5f5", "ff96d2fa", "ffb4f0fa", "ffcbf8fd", "ffffffff", "ffb4faaa", "ff78f573", "ff37d23c", "ff1eb41e", "ff0fa00f"]
    },
    TMP: {
        "thresholds": [-40.0, -8.0, -4, 0, 4, 8, 12, 16, 20, 24, 28, 32, 35, 37, 50],
        "colors": ["ff006699", "ff2f6ad2", "ff1c74cc", "ff8dccff", "ff9de0f5", "ffdefbff", "fff2ffe5", "ffccffcc", "ffc9ff98", "ffffffa0", "ffffe5ba", "ffffcc9c", "ffe39995", "ffff4200", "ffeb0000"]
    },
    TMAX: {
        "thresholds": [-40.0, -8.0, -4, 0, 4, 8, 12, 16, 20, 24, 28, 32, 35, 37, 50],
        "colors": ["ff006699", "ff2f6ad2", "ff1c74cc", "ff8dccff", "ff9de0f5", "ffdefbff", "fff2ffe5", "ffccffcc", "ffc9ff98", "ffffffa0", "ffffe5ba", "ffffcc9c", "ffe39995", "ffff4200", "ffeb0000"]
    },
    TMIN: {
        "thresholds": [-40.0, -8.0, -4, 0, 4, 8, 12, 16, 20, 24, 28, 32, 35, 37, 50],
        "colors": ["ff006699", "ff2f6ad2", "ff1c74cc", "ff8dccff", "ff9de0f5", "ffdefbff", "fff2ffe5", "ffccffcc", "ffc9ff98", "ffffffa0", "ffffe5ba", "ffffcc9c", "ffe39995", "ffff4200", "ffeb0000"]
    },
    ULWRF: {
        "thresholds": [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550],
        "colors": ["ff1e50b3", "ff3a5bc7", "ff4c74d8", "ff62a7c6", "ff80d4e1", "ffa1e1f1", "ffffee93", "ffffdd55", "ffffcc67", "ffffbb78", "ffff6f31"]
    },
    DSWRF: {
        "thresholds": [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100],
        "colors": ["ffe0f3f8", "ffabd9e9", "ff74add1", "ff4575b4", "ff313695", "fffee090", "fffdae61", "fff46d43", "ffd73027", "ffa50026", "ff800026"]
    }
}