let persist = [];

$(document).ready(function () {
    if (localStorage.getItem('savedCities')) {
    persist = JSON.parse(localStorage.getItem('savedCities'));
    $('#searchHistory').empty();
    for (let index = 0; index < persist.length; index++) {
        $('#searchHistory').append($('<li>').text(persist[index]).addClass('list-group-item'));

    }}
});

// search query

$('#searchBtn').on('click', function (e) {
    e.preventDefault();
    // console.log($(this).siblings("input").attr('id'));
    var userInput = $(this).siblings("input").val();
    const queryUrlCity = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=dcbd3f6575fe8b0ac1a0e366b4b242e4`
    queryCity(queryUrlCity);
    saveListLocalStorage(persist, userInput);
});

$('#cityInput').on('keydown', function (e) {
    if (e.key === "Enter") {
        var userInput = $(this).val();
        const queryUrlCity = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=dcbd3f6575fe8b0ac1a0e366b4b242e4`
        queryCity(userInput, queryUrlCity);

        saveListLocalStorage(persist, userInput);
    }

});

$('#searchHistory').on('click', function (e) {
    console.log(e.target.textContent);
    var userInput = e.target.textContent;
    const queryUrlCity = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=dcbd3f6575fe8b0ac1a0e366b4b242e4`
    queryCity(userInput, queryUrlCity);


});
function queryCity(userInput, queryUrlLatLon) {
    $('#hider').removeClass('d-none');
    $.ajax({
        url: queryUrlLatLon,
        method: 'GET',
        success: function (response) {
            console.log(response)

            fullQuery = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.coord.lat}&lon=${response.coord.lon}&units=imperial&appid=dcbd3f6575fe8b0ac1a0e366b4b242e4`

            var date = moment.unix(response.dt).format('L');

            $('#cityNameDate').text(`${response.name} ${date}`);

            $.ajax({
                url: fullQuery,
                method: 'GET'
            }).then(function (response) {
                console.log(response);

                // alter HTML elements

                $('#cityTemp').html(`Temperature: ${response.current.temp} &#176;F`);
                $('#cityIcon').attr('src', `http://openweathermap.org/img/wn/${response.current.weather[0].icon}@2x.png`);
                $('#cityHum').html(`Humidity: ${response.current.humidity}&#37;`);
                $('#cityWind').html(`Wind Speed: ${response.current.wind_speed} MPH`);
                $('#cityUV').html(`UV Index: ${response.current.uvi}`);

                // Add to search history list


                // 5day forecast
                for (let index = 1; index < 6; index++) {
                    console.log(response.daily[index]);
                    $(`#${index}Date`).html(moment.unix(response.daily[index].dt).format('L'));
                    $(`#${index}Icon`).children(0).attr('src', `http://openweathermap.org/img/wn/${response.daily[index].weather[0].icon}@2x.png`);
                    $(`#${index}Temp`).html(`Temp: ${response.daily[index].temp.max.toFixed(1)}&#176;F`);
                    $(`#${index}Hum`).html(`Humidity: ${response.daily[index].humidity}&#37;`);

                }

            });
        }
    }).then();



};

function saveListLocalStorage(searchList, userInput) {
    if (!localStorage.getItem('savedCities')) {
        searchList = [];
        searchList.push(userInput);
        localStorage.setItem('savedCities', JSON.stringify(searchList))
        console.log(searchList);
        $('#searchHistory').empty();
        for (let index = 0; index < searchList.length; index++) {
            $('#searchHistory').append($('<li>').text(searchList[index]).addClass('list-group-item'));

        }

    } else {
        searchList = JSON.parse(localStorage.getItem('savedCities'));
        if (searchList.indexOf(userInput) === -1 && userInput.length > 0) {
            searchList.push(userInput);
            console.log(searchList);
            $('#searchHistory').empty();
            for (let index = 0; index < searchList.length; index++) {
                $('#searchHistory').append($('<li>').text(searchList[index]).addClass('list-group-item'));

            }
        }

        localStorage.setItem('savedCities', JSON.stringify(searchList))
    }
}