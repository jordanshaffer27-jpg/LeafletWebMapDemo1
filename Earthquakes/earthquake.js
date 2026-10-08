var map = L.map('earthquakemap').setView([39, -98], 4);
var basemapUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
var basemap = L.tileLayer(basemapUrl, { attribution: 'Tiles &copy; Esri, OpenStreetMap contributors', maxZoom: 16}).addTo(map);

// Earthquake colors
function getColor(mag) {
    if (mag >= 5) return 'red';
    if (mag >= 3) return 'orange';
    return 'green';
}

// Get earthquake data
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                var mag = feature.properties.mag || 0;

                return L.circleMarker(latlng, {
                    radius: Math.max(4, mag * 3),
                    color: getColor(mag),
                    fillOpacity: 0.7
                });
            },

            onEachFeature: function(feature, layer) {
                layer.bindPopup(
                    'Magnitude: ' + feature.properties.mag +
                    '<br>Location: ' + feature.properties.place +
                    '<br>Time: ' + new Date(feature.properties.time).toLocaleString()
                );
            }
        }).addTo(map);
    });

// Legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function() {
    var div = L.DomUtil.create('div');
    div.style = 'background:white; padding:10px;';

    div.innerHTML = '<b>Magnitude</b><br>' +
        '<span style="color:green">●</span> Below 3<br>' +
        '<span style="color:orange">●</span> 3 - 4.9<br>' +
        '<span style="color:red">●</span> 5+';

    return div;
};

legend.addTo(map);
