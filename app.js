const express = require("express");
const bodyParser = require("body-parser"); // To retrieve data from our user
const request = require("request"); // To interact with the API
const fs = require("fs");

let apiKey = "";
fs.readFile('api-key.txt', function(err, data) {
    if (err) {
        throw err;
    }
    apiKey = data;
});

const app = express();

app.set("view engine", "ejs"); // To use the template ejs

app.use(express.static("public")); // To put style and images
app.use(bodyParser.urlencoded({ extended: true }));

// I put into the get method what I want to have directly without any action from the user.

app.get("/", function(req, res) {
    res.render("geolocation");
})


app.get("/weather", function(req, res) {

    let lat = req.query.lat;
    let lon = req.query.lon;

    let today = new Date();
    let currentDay = today.getDay();
    let day = "";
    let weather = "";
    let tempF = "";
    let tempC = "";
    let city = "";
    let icon = "";

    let options = {
        url: "https://api.openweathermap.org/data/2.5/weather",
        method: "GET",
        qs: {
            lat: lat,
            lon: lon,
            APPID: apiKey
        }
    };

    request(options, function(error, response, body) {
        let data = JSON.parse(body);
        weather = data.weather[0].main;
        tempK = data.main.temp;
        city = data.name;
        icon = data.weather[0].icon;

        tempC = Math.round(tempK - 273.15);

        // I need to put the render here and not outside because of closures.

        res.render("list", {
            weatherDes: weather,
            temp: tempC,
            cityName: city,
            oldIcon: icon
        });

    });

});

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});