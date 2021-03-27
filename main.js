var test = document.getElementById("test");
var carousel = document.getElementById("CountryCarousel");


window.onload = function() {

 

    fetch('http://countryapi.gear.host/v1/Country/getCountries?pName=Costa%20Rica')
    .then((resp) => resp.json())
    .then(function(data) {
     
      test.innerHTML=data.Name[0].main;
      
      })

}