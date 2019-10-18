function getMyLocationURL() {
    var longitude;
    var latitude;
    // // var longitude = -79.6614656;
    // // var latitude = 43.5986432;
    debugger;
    if (navigator.geolocation) 
    {
        navigator.geolocation.getCurrentPosition(success, error);
        
        function success(pos)
        {
            longitude = pos.coords.longitude;
            latitude = pos.coords.latitude;
            myMarker = `{pin-l}-{Home}+{blue}(${longitude},${latitude})`;
            queryplaceURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1IjoicmV2ZXJiMTk3MSIsImEiOiJjazF1bnppYWMwMDk0M2dvejFoNHNseGxtIn0.V7hLJAjB20RoJ1dGxY2jTQ`;
            queryMapURL = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${longitude},${latitude},14.25,0,60/600x600?access_token=pk.eyJ1IjoicmV2ZXJiMTk3MSIsImEiOiJjazF1bnppYWMwMDk0M2dvejFoNHNseGxtIn0.V7hLJAjB20RoJ1dGxY2jTQ&marker=${myMarker}`;
            console.log(queryMapURL);
            getMapBox(queryplaceURL);
        };

        function error(err) 
        {
            console.log(`ERROR(${err.code}): ${err.message}`);
        }   
        
    };
};

function showMap(long, lat)
{
    L.mapbox.accessToken = 'pk.eyJ1IjoicmV2ZXJiMTk3MSIsImEiOiJjazF1bnppYWMwMDk0M2dvejFoNHNseGxtIn0.V7hLJAjB20RoJ1dGxY2jTQ';
    // Here we don't use the second argument to map, since that would automatically
    // load in non-clustered markers from the layer. Instead we add just the
    // backing styleLayer, and then use the featureLayer only for its data.
    var map = L.mapbox.map('map')
        .setView([lat, long], 13)
        .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));
    
    // Since featureLayer is an asynchronous method, we use the `.on('ready'`
    // call to only use its marker data once we know it is actually loaded.
    L.mapbox.featureLayer('examples.map-h61e8o8e').on('ready', function(e) {
        // The clusterGroup gets each marker in the group added to it
        // once loaded, and then is added to the map
        var clusterGroup = new L.MarkerClusterGroup();
        e.target.eachLayer(function(layer) {
            clusterGroup.addLayer(layer);
        });
        map.addLayer(clusterGroup);
    });    
}

$(document).ready();
function getMapBox(queryplaceURL, queryMapURL)
{
    $.get(queryMapURL);
    $.get(queryplaceURL).then(function(res)
    {
        var myLocation = res;
        console.log(res);
    })
}

$(document).ready();

getMyLocationURL();



