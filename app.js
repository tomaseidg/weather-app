const express = require("express");
const bodyParser = require("body-parser"); // To retrieve data from our user
const request = require("request"); // To interact with the API
// const skycons = require("skycons");
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

    // var icon = new Skycons({"color": "pink"});
    // icon.add("icon1", Skycons.PARTLY_CLOUDY_DAY);

    let today = new Date();
    let currentDay = today.getDay();
    let day = "";
    let weather = "";
    let temp = "";
    let city = "";

    let options = {
        url: "https://api.openweathermap.org/data/2.5/weather",
        method: "GET",
        qs: {
            q: "London",
            APPID: apiKey
        }
    };

    request(options, function(error, response, body) {
        let data = JSON.parse(body);
        weather = data.weather[0].main;
        temp = data.main.temp;
        city = data.name;

        // I need to put the render here and not outside because of closures.

        res.render("list", {
            weatherDes: weather,
            tempF: temp,
            cityName: city
        });

    });

});

// if (navigator.geolocation) {
// 	navigator.geolocation.getCurrentPosition(function(position) {
// 		var lat = position.coords.latitude;
// 		var long = position.coords.longitude;
// 	})
// }

app.post("/", function(req, res) {

});

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});