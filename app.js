const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const fs = require("fs");

const apiKey = fs.readFileSync('api-key.txt', 'utf8').trim();

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const cities = [
    { name: "Cairo", lat: 30.0444, lon: 31.2357 },
    { name: "Giza", lat: 30.0131, lon: 31.2089 },
    { name: "Alexandria", lat: 31.2001, lon: 29.9187 }
];

app.get("/", (req, res) => {
    res.render("geolocation");
});

app.get("/weather", (req, res) => {
    let weatherData = [];
    let completedRequests = 0;

    cities.forEach(city => {
        const options = {
            url: "https://api.openweathermap.org/data/2.5/weather",
            method: "GET",
            qs: {
                lat: city.lat,
                lon: city.lon,
                APPID: apiKey
            }
        };

        request(options, function(error, response, body) {
            if (error) {
                weatherData.push({ city: city.name, error: true });
            } else {
                const data = JSON.parse(body);
                if (data.cod !== 200) {
                    weatherData.push({ city: city.name, error: true });
                } else {
                    weatherData.push({
                        city: city.name,
                        weather: data.weather[0].main,
                        description: data.weather[0].description,
                        temp: Math.round(data.main.temp - 273.15),
                        humidity: data.main.humidity,
                        wind: data.wind.speed,
                        icon: data.weather[0].icon,
                        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
                        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString()
                    });
                }
            }

            completedRequests++;
            if (completedRequests === cities.length) {
                res.render("list", { weatherData });
            }
        });
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
