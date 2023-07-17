const apiKey = 'fdc32dde1a5238314eca300805f5d0b9';
const suggestionList = $("#location-suggestion");
let suggestions = [];



//Event Handlers for search 
$("#search-form").on("submit", function (event) {
    event.preventDefault();
    searchBarInput(event);
});

$('#search-button').click(function (event) {
    searchBarInput(event);
});

//Builds API call query string
function searchBarInput(event) {
    var locationName = $('#search-input').val();
    if (locationName.trim().length > 0) {
        locationName = locationName.trim().replaceAll(" ", "%20");
        var apiURLGeo = 'http://api.openweathermap.org/geo/1.0/direct?q=' + locationName + '&limit=5' + '&appid=' + apiKey + '&units=metric';
        geoAPILookUp(apiURLGeo);
        console.log(apiURLGeo);
    } else {
        clearSuggestions();
    }
}

//First API lookup to get suggestions and building an array with info
function geoAPILookUp(apiURLGeo) {
    fetch(apiURLGeo)
        .then(function (response) {
        return response.json();
        })
        .then(function (data) {
            console.log('API response:', data);
            suggestions = [];            
            data.forEach(item => {                
                let locationObj = {
                    name: item.name,
                    state: item.state,
                    country: item.country,
                    lat: item.lat,
                    lon: item.lon,
                };
                suggestions.push(locationObj);                
            });
            console.log(suggestions);
            if (suggestions.length < 1) {
                alert("No location. Please try search again");
            }
            displaySuggestions();
        })
        .catch(function(error) {
            console.error('Error fetching location suggestions:', error);
            clearSuggestions();
        });    
}

//Displays suggestions and passess on lat and lon details to getWeatherData
function displaySuggestions() {
    suggestionList.empty();
    suggestions.forEach(option => {
        let listItem = $('<li></li>');

        let locationText = option.name + ", " + option.country;
        if (option.state) {
            locationText = option.name + ", " + option.state + ", " + option.country;
        }

        let button = $('<button></button>').text(locationText);
        button.on('click', function () {
            $('#search-input').val(locationText);
            $("#city-name").text(locationText);
            clearSuggestions();
            getWeatherData(option.lat, option.lon);
        });
        listItem.append(button);
        suggestionList.append(listItem);
    });
}

function clearSuggestions() {
    suggestionList.empty();
}

//Gets weather data using lat and lon parameters
function getWeatherData(lat,lon) {
    const apiURLWeather = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ lat +'&lon='+ lon +'&appid='+ apiKey;

    fetch(apiURLWeather)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log('Weather API response:', data);
        displayCurrentWeather(data);
        displayFutureWeather(data);
    })
    .catch(function (error) {
        console.error('Error fetching weather data:', error);
    });
}


//Renders current weather in
function displayCurrentWeather(data) {
    const currentInfo = data.list[0];    
    const weatherIcon = currentInfo.weather[0].icon;
    const temperature = Math.round(parseInt(currentInfo.main.temp) - 273.15) ;
    const humidity = currentInfo.main.humidity;
    const windSpeed = currentInfo.wind.speed;
    const dateTimeString = currentInfo.dt_txt;

    const date = dayjs(dateTimeString);
    
    const formattedDate = date.format("MMMM D, YYYY h:mm A");
    
    $("#weather-icon").attr("src", "http://openweathermap.org/img/w/" + weatherIcon + ".png").css("display", "block");
    $('#current-date').text(formattedDate)
    $("#temperature").text("Temperature: " + temperature + " °C");
    $("#humidity").text("Humidity: " + humidity + "%");
    $("#wind-speed").text("Wind Speed: " + windSpeed + " km/h");
}


//Forecast for next 5 days
function displayFutureWeather(data) {
    console.log(data);
}