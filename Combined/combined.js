var map = L.map('map').setView([38, -95], 4);
var basemapUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
var basemap = L.tileLayer(basemapUrl, { attribution: 'Tiles &copy; Esri, OpenStreetMap contributors', maxZoom: 16}).addTo(map);

// Create separate layers
var weatherLayer = L.layerGroup().addTo(map);
var earthquakeLayer = L.layerGroup();

// Weather alerts
var weatherUrl = 'https://api.weather.gov/alerts/active?region_type=land';

$.getJSON(weatherUrl, function(data) {
    L.geoJSON(data, {
        style: function(feature) {
            var color = 'orange';

            if (feature.properties.severity === 'Extreme') color = 'purple';
            if (feature.properties.severity === 'Severe') color = 'red';
            if (feature.properties.severity === 'Minor') color = 'green';

            return {color: color};
        },

        onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.headline);
        }
    }).addTo(weatherLayer);
});

// Earthquake colors
function getColor(mag) {
    if (mag >= 5) return 'red';
    if (mag >= 3) return 'orange';
    return 'green';
}

// Earthquake data
var earthquakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

$.getJSON(earthquakeUrl, function(data) {
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
    }).addTo(earthquakeLayer);
});

// Layer toggle control
var overlays = {
    'Weather Alerts': weatherLayer,
    'Earthquakes': earthquakeLayer
};

L.control.layers(null, overlays).addTo(map);
