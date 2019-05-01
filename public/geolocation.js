if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        location.replace("/weather?lat=" + lat + "&lon=" + long);
    })
}