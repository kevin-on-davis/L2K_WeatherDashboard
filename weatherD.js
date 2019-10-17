

function getMyLocationURL() {
    // var longitude = -79.6614656;
    // var latitude = 43.5986432;
    var longitude;
    var latitude;

    if (navigator.geolocation) 
    {
        navigator.geolocation.getCurrentPosition(success, error);
        
        function success(position)
        {
            alert("Checking location "+position.coords);
            var pos = position.coords;
            longitude = pos.longitude;
            latitude = pos.latitude;
        };

        function error(err) 
        {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }
          
        return `https://api.openweathermap.org/data/2.5/weather?&lat=${latitude}&lon=${longitude}&appid=35b3e9dd48656fb03d90eff0aff2cd0c`;
    };
};

function getWeatherConditions(queryURL)
{
    $.get(queryURL).then(function()
    {
        var myWeather = response.data;
        $("#current_weather").append(`<h3>${myWeather.name} (${Date()}) ${myWeather.icon}`);
    })
}
alert(getMyLocationURL()); 
getWeatherConditions(getMyLocationURL());

