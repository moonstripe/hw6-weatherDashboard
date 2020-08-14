
// search query

$('#searchBtn').on('click', function (e) {
    e.preventDefault();
    // console.log($(this).siblings("input").attr('id'));
    var userInput = $(this).siblings("input").val();
    const queryUrlCity = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=dcbd3f6575fe8b0ac1a0e366b4b242e4`
    queryCity(queryUrlCity);

});

$('#cityInput').on('keydown', function (e) {
    if (e.key === "Enter") {
        var userInput = $(this).val();
        const queryUrlCity = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=dcbd3f6575fe8b0ac1a0e366b4b242e4`
        queryCity(queryUrlCity);

        $('#searchHistory').append($('<li>').text(userInput).addClass('list-group-item'));
        
    }

});

$('#searchHistory').on('click', function (e) {
    console.log(e.target.textContent);
    var userInput = e.target.textContent;
    const queryUrlCity = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=dcbd3f6575fe8b0ac1a0e366b4b242e4`
    queryCity(queryUrlCity);

});
function queryCity(queryUrlLatLon) {
    $.ajax({
        url: queryUrlLatLon,
        method: 'GET'
    }).then(function (response) {
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

            // 5day forecast
            for (let index = 1; index < 6; index++) {
                console.log(response.daily[index]);
                $(`#${index}Date`).html(moment.unix(response.daily[index].dt).format('L'));
                $(`#${index}Icon`).children(0).attr('src', `http://openweathermap.org/img/wn/${response.daily[index].weather[0].icon}@2x.png`);
                $(`#${index}Temp`).html(`Temp: ${response.daily[index].temp.max.toFixed(1)}&#176;F`);
                $(`#${index}Hum`).html(`Humidity: ${response.daily[index].humidity}&#37;`);

            }

        });
    });



};