function BindMapEvents(map, render_func) {

    map.on('click', onMapClick);
    // map.on('moveend', render_func);
    // map.on('zoomend', render_func);
}


function details(e) {
    let str = `z: ${map.getZoom()},`;
    str += `lon: ${e.latlng.lng.toFixed(8)},`;
    str += `lat: ${e.latlng.lat.toFixed(8)}`;
    return str;

}

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent(details(e))
        .openOn(map);
}




