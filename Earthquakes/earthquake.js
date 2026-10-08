
var map = L.map('earthquakemap').setView([38, -95], 4);

// Basemap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

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