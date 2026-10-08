var map = L.map('weathermap').setView([38, -95], 4);
var basemapUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
var basemap =  L.tileLayer(basemapUrl, {attribution: '&copy; <a href="http://' + 'www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);


//add the national precipitation radar layer
var radarUrl = 'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi';
var radarDisplayOptions = {
  layers: 'nexrad-n0r-900913',
  format: 'image/png',
  transparent: true
};
var radar = L.tileLayer.wms(radarUrl, radarDisplayOptions).addTo(map);

//add alerts layer
var weatherAlertsUrl = 'https://api.weather.gov/alerts/active?region_type=land';
$.getJSON(weatherAlertsUrl, function(data) {
    //L.geoJSON(data).addTo(map);
    L.geoJSON(data, {
        
style: function(feature) {
    var alertColor = 'orange';

    if (feature.properties.severity === 'Extreme') {
        alertColor = 'purple';
    } else if (feature.properties.severity === 'Severe') {
        alertColor = 'red';
    } else if (feature.properties.severity === 'Moderate') {
        alertColor = 'orange';
    } else if (feature.properties.severity === 'Minor') {
        alertColor = 'green';
    }

    return {
        color: alertColor,
        weight: 2,
        fillOpacity: 0.3
    };
},

            onEachFeature: function(feature, layer) {
                layer.bindPopup(feature.properties.headline);
                
            }
          
      }).addTo(map);
      
});

