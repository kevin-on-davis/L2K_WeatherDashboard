var api_key = "35b3e9dd48656fb03d90eff0aff2cd0c";
var timeInCityKey = "WCLSVSFTMXGP";
var srch_city;
var btn_city_search = $("#search_button");
var lst_city_list = $("#city_list");

btn_city_search.on("click", function()
{
    event.preventDefault();
    getLocationURL();
});

$("#city_search")

$('input[type=text]').on('keydown', function() 
{
    if (event.which == 13) 
    {
        event.preventDefault();
        getLocationURL();
    }
});

lst_city_list.on("click", "option", function(event)
{
    getWeatherConditions(`https://api.openweathermap.org/data/2.5/weather?q=${this.innerHTML}&units=metric&appid=${api_key}`);
})

function getLocationURL() {
    var longitude;
    var latitude;

    showHistory();
    {
        if (!$("#city_search").val())
        {
            navigator.geolocation.getCurrentPosition(success, error);
        }
        else
        {
            srch_city = $("#city_search").val();
            getWeatherConditions(`https://api.openweathermap.org/data/2.5/weather?q=${srch_city}&units=metric&appid=${api_key}`);
        };
        
        function success(pos)
        {
            longitude = pos.coords.longitude;
            latitude = pos.coords.latitude;
            getWeatherConditions(`https://api.openweathermap.org/data/2.5/weather?&lat=${latitude}&lon=${longitude}&units=metric&appid=${api_key}`);
            
        };

        function error(err) 
        {
            console.log(`ERROR(${err.code}): ${err.message}`);
        }   
        
    };
};

function getWeatherConditions(queryURL)
{
    
    $.get(queryURL).then(function(res)
    {
        var myWeather = res;
        console.log(myWeather.dt+" + "+myWeather.timezone+" = "+Date((myWeather.dt+myWeather.timezone)*1000));
        var today = moment(Date((myWeather.dt)*1000)).format('LLL');
        

        $("#current_weather").empty();
        var myWeatherIcon = `http://openweathermap.org/img/w/${myWeather.weather[0].icon}.png`;
        $("#current_weather").append(`<h3 id="currHdr" class="col-12" style="color:black"><strong>${myWeather.name} (${today} <span id="cityLocalTime"></span></strong>)<img id="wicon" src="${myWeatherIcon}" alt="Weather icon"></h3>`);
        $("#current_weather").append(`<h6 class="col-12">Temperature: ${myWeather.main.temp} °C</h6>`);
        $("#current_weather").append(`<h6 class="col-12">Humidity: ${myWeather.main.humidity} %</h6>`);
        $("#current_weather").append(`<h6 class="col-12">Wind: ${myWeather.wind.speed} MPH</h6>`);
        $.get(`https://api.openweathermap.org/data/2.5/uvi?lat=${myWeather.coord.lat}&lon=${myWeather.coord.lon}&units=metric&appid=${api_key}`).then(function(fore)
        {
            $("#current_weather").append(`<h6 class="col-12">UV Index: <span style="color: white; border:solid; border-color:red; border-width:thick; background-color:red">${fore.value}</span></h6>`);
        });

        
        currentCityTime = setInterval(function()
        {
            $.get(`http://api.timezonedb.com/v2.1/get-time-zone?key=${timeInCityKey}&format=json&by=position&lat=${myWeather.coord.lat}&lng=${myWeather.coord.lon}`).then(function(success, error)
            {
                function success(cTime)
                {
                    $("#currHdr")[0].innerHTML = `<strong>${myWeather.name} (${moment(cTime.formatted).format('LLL')})</strong><img id="wicon" src="${myWeatherIcon}" alt="Weather icon">`;
                };

                function error(err)
                {
                    $("#currHdr")[0].innerHTML = `<strong>${myWeather.name} ("Current time unavailable")</strong><img id="wicon" src="${myWeatherIcon}" alt="Weather icon">`;
                };
            });
        }, 5000);

        var forecast_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${myWeather.coord.lat}&lon=${myWeather.coord.lon}&units=metric&appid=${api_key}`;
        $.get(forecast_URL).then(function(res)
        {
            myForecast = res;

            $("#five_day").empty();
            currDate = new Date();
            myStart = Math.floor(currDate.getHours()/3);

            for (i=0; i < 5; i++)
            {
                var weather_icon_5day = `https://openweathermap.org/img/w/${myForecast.list[myStart].weather[0].icon}.png`;
                $("#five_day").append(`<div class="card bg-primary"><div class="card-body text-left" id="day${i}_forecast" style="color:white"><p class="card-text">${moment(myForecast.list[myStart].dt_txt).format('L')}</p></div></div>`);
                $(`#day${i}_forecast`).append(`<h6>Temp: ${myForecast.list[myStart].main.temp} °C</h6>`);
                $(`#day${i}_forecast`).append(`<h6><img id="wicon" src="${weather_icon_5day}" alt="Weather icon">`);
                $(`#day${i}_forecast`).append(`<h6>Humidity: ${myForecast.list[myStart].main.humidity} %</h6>`);
                $(`#day${i}_forecast`).append(`<h6>Wind: ${myForecast.list[myStart].wind.speed} MPH</h6>`);

                myStart += 8;
            };
            $("#five_day").prepend(`<h3 class="col-12" style="color:black"><strong>5 Day Forecast</strong></h3>`);
        }).then(function()
        {
            $.get(`https://api.openweathermap.org/data/2.5/uvi/forecast?lat=${myForecast.city.coord.lat}&lon=${myForecast.city.coord.lon}&appid=${api_key}`).then(function(fore_5d)
            {
                for (i=0; i < 5; i++)
                {
                    $(`#day${i}_forecast`).append(`<h6>UV Index: <span style="color: white; border:solid; border-color:red; border-width:thick; background-color:red">${fore_5d[i].value}</span></h6>`);
                }
            });
        });
    });
}

function showHistory()
{
    if (!localStorage.city_srch_history)
    {
        var srch_history = [];
    }
    else
    {
        srch_history = JSON.parse(localStorage.getItem("city_srch_history"));
    }

    if ($("#city_search").val())
    {
        if (!srch_history.includes($("#city_search").val()))
        {
            srch_history.push($("#city_search").val());
            localStorage.setItem("city_srch_history", JSON.stringify(srch_history));
        }
    };

    $("#city_list").empty();
    $("#city_list").attr("size", Math.min(srch_history.length, 20));
    for (i=0; i < srch_history.length; i++)
    {
        $("#city_list").append(`<option id=${srch_history[i]}>${srch_history[i]}</option>`);
    }
};

$(document).ready(getLocationURL());