// openweather.js

/* 
FYI >> weather icon url: http://openweathermap.org/img/w/10d.png
Use the data .icon proprty to get the value and then build the complete path to the image
*/

const api_key = '&APPID=' // add your API key after the =
const searchBtn = document.querySelector('#searchbutton')
const searchBtnForecast = document.querySelector('#searchbuttonforecast')
const weather = document.querySelector('#weather')
const searchBox = document.querySelector('#searchbox')

const checkLocation = (forecastOption) => {
    weather.innerHTML = ''
    weather.style.display = 'none'
    let location = searchBox.value
    if (location != '' && location != undefined) {
        if (forecastOption == 'current') {
            getWeather(location)
        } else if (forecastOption == 'forecast')
            getWeatherForecast(location)
    }
}

const isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

const getWeather = (location) => {
    let url = ''
    let output = ''

    if (isNumeric(location)) {
        url = `http://api.openweathermap.org/data/2.5/weather?zip=${location}&units=imperial${api_key}`
    } else {
        url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial${api_key}`
    }

    console.log(url)

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // YOUR CODE GOES HERE (REMOVE THIS ONCE YOU ADD YOUR CODE)
        })
}

// get weather forecast for a location
const getWeatherForecast = (location) => {
    let url = ''
    let output = ''
    let current_date = ''
    let new_date = ''

    // do we have a location or a zip code?
    if (isNumeric(location)) {
        url = `http://api.openweathermap.org/data/2.5/forecast?zip=${location}&units=imperial${api_key}`
    } else {
        url = `http://api.openweathermap.org/data/2.5/forecast?q=${location}&units=imperial${api_key}`
    }

    console.log(url)

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // show the data you got back from fetch
            console.log(data)
            if (data.cod != '404') {
                // how many days?
                console.log(data.list.length)

                output += `<h2>Forecast for ${data.city.name}</h2>`
                for (let i = 0; i < data.list.length; i++) {
                    current_date = data.list[i].dt_txt.substring(0, 10);
                    if (new_date == '') {
                        new_date = current_date
                        shortDate = moment(data.list[i].dt_txt).format("dddd")
                        output += `<div><h3>${shortDate}</h3></div>`
                    }

                    if (current_date !== new_date) {
                        shortDate = moment(data.list[i].dt_txt).format("dddd")
                        output += `<div><h3>${shortDate}</h3></div>`
                        new_date = current_date
                    }

                    output += `<div class="hourly">`
                    shortTime = moment(data.list[i].dt_txt).format("hh mm a")
                    output += `<div>${shortTime}</div>`
                    output += `<div>Temperature: ${data.list[i].main.temp_min}</div>`
                    output += `<div>Humidity: ${data.list[i].main.humidity}</div>`
                    output += `<div>${data.list[i].weather[0].description}</div>`
                    let icon = data.list[i].weather[0].icon;
                    icon = `<img src="http://openweathermap.org/img/w/${icon}.png" />`
                    output += icon
                    output += `</div>`
                }
            } else {
                output = `<p>No weather avaialable for that location. Please try again.</p>`
            } // end if
            // display results
            weather.style.display = "block"
            weather.innerHTML = output
        })
} // end getWeatherForecast

// Event Listeners
searchBtn.addEventListener('click', () => { checkLocation('current') })
searchBtnForecast.addEventListener('click', () => { checkLocation('forecast') })