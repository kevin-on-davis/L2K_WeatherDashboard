var api_key = "35b3e9dd48656fb03d90eff0aff2cd0c";
var srch_city;
var btn_city_search = $("#search_button");
var lst_city_list = $("#city_list");

btn_city_search.on("click", function()
{
    getLocationURL();
});

lst_city_list.on("click", "option", function(event)
{
    getWeatherConditions(`https://api.openweathermap.org/data/2.5/weather?q=${this.innerHTML}&units=metric&appid=${api_key}`);
})

function getLocationURL() {
    var longitude;
    var latitude;

    // debugger;
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
        var today = moment(Date()).format('LL');
        $("#current_weather").empty();
        // console.log(res.coord.lat);
        var myWeatherIcon = `http://openweathermap.org/img/w/${myWeather.weather[0].icon}.png`;
        $("#current_weather").append(`<h3 class="col-12" style="color:black"><strong>${myWeather.name} (${today}</strong>)<img id="wicon" src="${myWeatherIcon}" alt="Weather icon"></h3>`);
        $("#current_weather").append(`<h6 class="col-12">Temperature: ${myWeather.main.temp} °C</h6>`);
        $("#current_weather").append(`<h6 class="col-12">Humidity: ${myWeather.main.humidity} %</h6>`);
        $("#current_weather").append(`<h6 class="col-12">Wind: ${myWeather.wind.speed} MPH</h6>`);
        $.get(`https://api.openweathermap.org/data/2.5/uvi?lat=${myWeather.coord.lat}&lon=${myWeather.coord.lon}&units=metric&appid=${api_key}`).then(function(fore)
        {
            // console.log(fore);
            $("#current_weather").append(`<h6 class="col-12">UV Index: <span style="color: white; border:solid; border-color:red; border-width:thick; background-color:red">${fore.value}</span></h6>`);
        });

        var forecast_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${myWeather.coord.lat}&lon=${myWeather.coord.lon}&units=metric&appid=${api_key}`;
        $.get(forecast_URL).then(function(res)
        {
            myForecast = res;
            // console.log(res);
            
            
            $("#five_day").empty();
            for (i=0; i < 5; i++)
            {
                var weather_icon_5day = `https://openweathermap.org/img/w/${myForecast.list[i].weather[0].icon}.png`;
                $("#five_day").append(`<div class="card bg-primary"><div class="card-body text-left" id="day${i}_forecast" style="color:white"><p class="card-text">${moment(moment(today).add(i+1, 'day')).format('LL')}</p></div></div>`);
                $(`#day${i}_forecast`).append(`<h6>Temp: ${myForecast.list[i].main.temp} °C</h6>`);
                $(`#day${i}_forecast`).append(`<h6><img id="wicon" src="${weather_icon_5day}" alt="Weather icon">`);
                $(`#day${i}_forecast`).append(`<h6>Humidity: ${myForecast.list[i].main.humidity} %</h6>`);

                // $.get(`https://api.openweathermap.org/data/2.5/uvi/forecast?lat=${myForecast.city.coord.lat}&lon=${myForecast.city.coord.lon}&appid=${api_key}`).then(function(fore_5d)
                // {
                //     console.log(fore_5d[i].value);
                //     $(`#day${i}_forecast`).append(`<h6>UV Index: ${fore_5d[i].value}</h6>`);
                // });
            };
            $("#five_day").prepend(`<h3 class="col-12" style="color:black"><strong>5 Day Forecast</strong></h3>`);
        });
    });
}

function showHistory()
{
    if (!localStorage.city_srch_history)
    {
        var srch_history = new Array();
    }
    else
    {
        srch_history = JSON.parse(localStorage.getItem("city_srch_history"));
    }

    if ($("#city_search").val())
    {
        srch_history.push($("#city_search").val());
        localStorage.setItem("city_srch_history", JSON.stringify(srch_history));
    };

    $("#city_list").empty();
    $("#city_list").attr("size", Math.min(srch_history.length, 20));
    for (i=0; i < srch_history.length; i++)
    {
        $("#city_list").append(`<option id=${srch_history[i]}>${srch_history[i]}</option>`);
    }
};

$(document).ready(getLocationURL());

// getMyLocationURL();
