var locData;

//Google Map Key: AIzaSyDZ7402uvsGRTOP_pqKkRm3fjWXbeIJ7pg        
// Try HTML5 geolocation.
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var geocoder = new google.maps.Geocoder;
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    geocoder.geocode({'latLng': pos}, function (locations, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        for (var location of locations) {
          if ($.inArray('locality', location.types) != -1) {
            document.getElementById("locDisp").innerHTML = location.formatted_address;
            locData = location.formatted_address;
            break;
          }
        }
      }
    });
  });
}

var data = new Firebase("https://intense-fire-1222.firebaseio.com/");

data.on("value", function(snapshot){
	var context = snapshot.val();
	var source = $("#home-template").html();
	var template = Handlebars.compile(source);
	var html = template(context);
	$("#change").html(html);
});

$("#submit").click(function(){
	var entry = {
		warmhat: "No",
		tshirt: "No",
		scarf: "No",
        shorts: "No",
        jacket: "No",
        jeans: "No",
        loc: null
	}
    if ($('#warmHat').is(":checked")){
      entry.warmhat = "Yes";
    }
    if ($('#tShirt').is(":checked")){
      entry.tshirt = "Yes";
    }
    if ($('#scarf').is(":checked")){
      entry.scarf = "Yes";
    }
    if ($('#jacket').is(":checked")){
      entry.jacket = "Yes";
    }
    if ($('#shorts').is(":checked")){
      entry.shorts = "Yes";
    }
    if ($('#jeans').is(":checked")){
      entry.jeans = "Yes";
    }
    entry.loc = locData;

	console.log(entry); //testing info has been placed into object
	data.child("entries").push(entry);
});

//final try
var express = require('express');
var http= require('http');

var portNumber = 3000;
var app = express();

app.get('/proxy', function(request, response){
  	performProxyCall(request.query.urlToFetch, response);
});

function performProxyCall(url, response){
	http.get(url, function(responseFromOtherDomain) {
	  	var contentType = responseFromOtherDomain.headers['content-type'];
		responseFromOtherDomain.on("data", function(responseBody) {
			response.writeHead(200, {'Content-Type': contentType});
		    response.end(responseBody);
	  	});
	});
}

app.use(express.static(__dirname)); //serve static content

app.listen(portNumber);
console.log('Requester with proxy is listening on port '+ portNumber);

/*
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}

var xhr = createCORSRequest('GET', "http://metservice.com/publicData/localForecastwellington");
if (!xhr) {
  throw new Error('CORS not supported');
}

console.log(xhr);
*/
/*
var metServ = "http://metservice.com/publicData/localForecastwellington";

$.getJSON(metServ, function (json) {
    var weatherForecast = json.days[0].forecast;
    console.log('Forecast : ', weatherForecast);
    //Trying to test if working by printing the simple forecast to the console
});
*/

