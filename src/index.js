function formatDate (timestamp) {
    let date = new Date(timestamp);

    let day = date.getDay();

    let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
    ];
    let dayOfWeek = (days[day]);


    //time minutes
    let timeMinutes = date.getMinutes();
    if (timeMinutes < 10) {
        timeMinutes = `0${timeMinutes}`;
    }

    //time of day converted to 12-Hour with AM/PM
    let timeHour = date.getHours();
    if (timeHour === 12) {
        return `${dayOfWeek} ${timeHour}:${timeMinutes} PM`;
    } else { if (timeHour === 0) {
        return `${dayOfWeek} 12:${timeMinutes} AM`;
        } else {
        if (timeHour > 12) { 
        timeHour = timeHour - 12;
        return `${dayOfWeek} ${timeHour}:${timeMinutes} PM`;
        } else {
            return `${dayOfWeek} ${timeHour}:${timeMinutes} AM`;
        }
        }
    }
}


function getForecast(coordinates) {
    let apiKey = "ca47e9200d90350ad07692b8ce034ca3";
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;
    axios.get(`${apiUrl}`).then(displayForecast);
}


function updateCurrent(response) {
    console.log(response.data.sys.country);
    document.querySelector(".city-current").innerHTML = response.data.name + " (" + response.data.sys.country + ")" ;
    //citytime
    document.querySelector(".time-current").innerHTML = formatDate(response.data.dt * 1000);
    document.querySelector(".description-current").innerHTML = response.data.weather[0].description;
    let iconCode = response.data.weather[0].icon;
    document.querySelector(".icon-current").setAttribute("src", `http://openweathermap.org/img/wn/${iconCode}@2x.png`);
    
    celsiousTemperature = response.data.main.temp
    document.querySelector(".temperature-current").innerHTML = Math.round(celsiousTemperature);
    document.querySelector(".humidity-current").innerHTML = response.data.main.humidity;
    document.querySelector(".wind-current").innerHTML = Math.round(response.data.wind.speed);
    
    getForecast(response.data.coord);
    
}


function handleSubmit(event) {
    event.preventDefault();
    //this  vvvvv fixes glitch of when you toggle to °F and then do another search the temperature is in C but says it is F
    celsious.classList.add("active");
    fahrenheit.classList.remove("active");
    //  ^^^^^
    let city = document.querySelector("#city-name-input").value;
    let apiKey = "ca47e9200d90350ad07692b8ce034ca3";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    axios.get(`${apiUrl}`).then(updateCurrent);
}


function unitsFahrenheit() {
    celsious.classList.remove("active");
    fahrenheit.classList.add("active");
     document.querySelector(".temperature-current").innerHTML = Math.round(celsiousTemperature * 9/5) + 32;
}

function unitsCelsious() {
    celsious.classList.add("active");
    fahrenheit.classList.remove("active");
    document.querySelector(".temperature-current").innerHTML = Math.round(celsiousTemperature);
}

function formatFutureDate(timestamp) {
    let futureDate = new Date(timestamp * 1000);
    let futureDay = futureDate.getDay();
    let futureDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return futureDayNames[futureDay];
}

function displayForecast(response) {
    let futureDates = response.data.daily;
    let forecastElement = document.querySelector("#forecast");
    let forecastHTML = `<div>`;
    futureDates.forEach(function(futureDay, index){
        if (index < 5) {forecastHTML = forecastHTML + 
            `<div class="row card-future">
                <div class="col-4 day-future">${formatFutureDate(futureDay.dt)}</div>
                <div class="col-4">
                  <img
                    src="http://openweathermap.org/img/wn/${futureDay.weather[0].icon}@2x.png"
                    alt="weather-icon"
                    class="icon-future"
                  />
                </div>
                <div class="col-4 temperature-future">
                <span class="high-future">${Math.round(futureDay.temp.max)}° </span
                ><span class="low-future">| ${Math.round(futureDay.temp.min)}°</span>                
                </div>
              </div>`;
        }
    })


    forecastHTML = forecastHTML + `</div>`
    forecastElement.innerHTML= forecastHTML;
}


document.querySelector("#fahrenheit").addEventListener("click", unitsFahrenheit);

document.querySelector("#celsious").addEventListener("click", unitsCelsious);

let celsiousTemperature = null;


let city = "Philadelphia";

document.querySelector(".input-city").addEventListener("submit", handleSubmit);

let apiKey = "ca47e9200d90350ad07692b8ce034ca3";

let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
axios.get(`${apiUrl}`).then(updateCurrent);
