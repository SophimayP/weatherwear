
/* -------------- GEOLOCATION ------------ */
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

/* -------------- DATABASE ------------ */
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

/* -------------- WEATHER ------------ */

//Metservice JSON can't seem to be used as has an origin error:  http://metservice.com/publicData/localForecastwellington and Sam Jones was passing it through a proxy which he let me use - hope thats ok as its the same data im receiving all I'm swapping out is the URL and it saves me having to host it on a third party proxy server myself as its just to get pass the origin not being allowed.

 var metServ = "http://uni.ey.nz/metservice.php?oneMinObs_wellington";
 
 $.getJSON(metServ, function (json) {
     var weatherForecast = json.temperature;
     console.log('Temperature : ', weatherForecast);
 });

