const wrapper = document.querySelector(".wrapper"),
    inputPart = document.querySelector(".input-part"),
    infoTxt = inputPart.querySelector(".info-txt"),
    inputField = inputPart.querySelector("input"),
    getLocationBtn = inputPart.querySelector("button"),
    infoWeather = wrapper.querySelector(".weather-part"),
    iconWeather = infoWeather.querySelector("img"),
    backArrow = wrapper.querySelector("header i"),
    apiKey = '4e7d7d8388ec167545aed27240d5e9d8';
let api;

inputField.addEventListener('keyup', e => {
    if (e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
        saveLocalStorage(inputField.value);
    }
});
backArrow.addEventListener("click", () => {
    wrapper.classList.remove("active");
    inputField.value = JSON.parse(localStorage.getItem('localCountry'))
});


if (localStorage.getItem('localCountry')) {
    inputField.value = JSON.parse(localStorage.getItem('localCountry'))
}


function saveLocalStorage(value) {
    localStorage.setItem('localCountry', JSON.stringify((value)));
}

getLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSucces, onError);
    } else {
        alert('no compatible')
    }
});

function onSucces(position) {
    const {
        latitude,
        longitude,
    } = position.coords;

    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onError() {
    infoTxt.innerText = "Acceso denegado";
    infoTxt.classList.add("error");
}

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}

function fetchData() {
    infoTxt.innerText = "Obteniendo datos";
    infoTxt.classList.add('pending');
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

 let map;

 function initMap(lon, lat) {
     map = new google.maps.Map(document.getElementById("map"), {
         center: {
             lat: lon,
             lng: lat,
         },
        zoom: 8
     })
 }

function weatherDetails(info) {
    infoTxt.classList.replace('pending', 'error');
    if (info.cod == "404") {
        infoTxt.innerText = `${inputField.value} Ciudad/Pais no encontrado`;
    } else {
        const city = info.name;
        const country = info.sys.country;
        const {
            description,
            id
        } = info.weather[0];
         const {
        lon,
        lat
         } = info.coord;
         initMap(lon, lat);
        const {
            feels_like,
            humidity,
            temp,
            pressure,
            temp_min,
            temp_max
        } = info.main;
        const {
            speed
        } = info.wind;
        if (id == 800) {
            iconWeather.src = "img/clear.svg";
        } else if (id >= 200 && id <= 232) {
            iconWeather.src = "img/storm.svg";
        } else if (id >= 600 && id <= 622) {
            iconWeather.src = "img/snow.svg";
        } else if (id >= 701 && id <= 781) {
            iconWeather.src = "img/haze.svg";
        } else if (id >= 801 && id <= 804) {
            iconWeather.src = "img/cloud.svg";
        } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
            iconWeather.src = "img/rain.svg";
        }
        infoWeather.querySelector(".temp .numb").innerText = Math.floor(temp);
        infoWeather.querySelector(".weather").innerText = description;
        infoWeather.querySelector(".location span").innerText = `${city}, ${country}`;
        infoWeather.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        infoWeather.querySelector(".temp .numb-3").innerText = Math.floor(temp_min);
        infoWeather.querySelector(".temp .numb-4").innerText = Math.floor(temp_max);
        infoWeather.querySelector(".humidity span").innerText = `${humidity}%`;
        infoWeather.querySelector(".pressure span").innerText = `${pressure}`;
        infoWeather.querySelector(".speed span").innerText = `${speed}`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}