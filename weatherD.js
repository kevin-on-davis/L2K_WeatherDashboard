

function getMyLocationURL() {
    var longitude;
    var latitude;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function()
        {
            alert("Checking location "+response.data);
            var position = response.data;
            alert(position);
            longitude = position.coords.longitude;
            latitude = position.coords.latitude;
        });
    return `api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}`;
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

