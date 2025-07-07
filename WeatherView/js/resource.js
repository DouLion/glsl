const ArcGISHub = {
    Image: "https://fly.maptiles.arcgis.com/arcgis/rest/services/World_Imagery_Firefly/MapServer/tile/{z}/{y}/{x}",
    max: 18,
    min: 0
}

const GoogleMap = {
    Image: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    max: 18,
    min: 0
}

const TzxMap = {
    Image: 'http://192.168.0.80:10008/api/wmts?layer=basemap:00_P&style=default&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}',
    max: 10,
    min: 0
}