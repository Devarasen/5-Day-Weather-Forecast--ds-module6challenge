const apiKey = 'fdc32dde1a5238314eca300805f5d0b9';
const suggestionList = $("#location-suggestion");
let suggestions = [];
let lat;
let lon;


$('#search-button').on('click', function (event) {
    searchBarInput(event);
});


function searchBarInput(event) {
    var locationName = $('#search-input').val();
    if (locationName.trim().length > 0) {
        locationName.trim().replaceAll(" ", "%20");
        var apiURLGeo = 'http://api.openweathermap.org/geo/1.0/direct?q=' + locationName + '&limit=5' + '&appid=' + apiKey + '&units=metric';
        geoAPILookUp(apiURLGeo);
        console.log(apiURLGeo);
    } else {
        clearSuggestions();
    }
}

function geoAPILookUp(apiURLGeo) {
    fetch(apiURLGeo)
        .then(function (response) {
        return response.json();
        })
        .then(function (data) {
            console.log('API response:', data);
            suggestions = [];
            data.forEach(item => {
                let locationStr = item.name + ", " + item.country;
                if (item.state) {
                    locationStr = item.name + ", " + item.state + ", " + item.country;
                }
                suggestions.push(locationStr);
            });
            displaySuggestions();
        })
        .catch(function(error) {
            console.error('Error fetching location suggestions:', error);
            clearSuggestions();
        });    
}

function displaySuggestions() {
    suggestionList.empty();
    suggestions.forEach(option => {
        let listItem = $('<li></li>');
        let button = $('<button></button>').text(option);
        button.on('click', function () {
            $('#search-input').val(option);
            clearSuggestions();
        });
        listItem.append(button);
        suggestionList.append(listItem);
    });
}

function clearSuggestions() {
    suggestionList.empty();
}


function getWeatherData(locationName) {
    const apiURL = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ lat +'&lon='+ lon +'&appid='+ apiKey;
}

