var city;
/* -------------- GEOLOCATION ------------ */
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
            city = location.address_components[2].short_name; //Getting the current city
            city = city.replace(/\s+/g, '-').toLowerCase(); //making lowercase and any spaces change to - so that it will not break URL and cities like New Plymouth become new-plymouth which works with the URL. 
              
            /* -------------- WEATHER ------------ */
            //Metservice JSON can't seem to be used as has an origin error:  http://metservice.com/publicData/localForecastwellington and Sam Jones was passing it through a proxy which he let me use - hope thats ok as it's the same data I'm receiving all I'm swapping out is the URL and it saves me having to host it on a third party proxy server myself just to get pass the origin not being allowed.
            var metServ = "http://uni.ey.nz/metservice.php?oneMinObs_";
            var jsonURL = metServ + city;
            $.getJSON(jsonURL, function (json) {
             var weatherForecast = json.temperature;
             document.getElementById("weatherDisp").innerHTML = 'Temperature : ' + weatherForecast;
            });
            break;
          }
        }
      }
    });
  });
}

/*function getCurrentLat(callback){
    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition(function(position) {
            callback(position.coords.latitude);
        });
    }else{
        console.log("Unable to access your geolocation");
    }
}
var aLat = getCurrentLat();
console.log(aLat);

var outCity = getCity();
console.log(outCity + "outside loop");*/

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
        scale: 10.5,
        rain: "No",
        loc: null
	}
    if ($('#rain').is(":checked")){
      entry.rain = "Yes";
    }
    entry.scale = document.getElementById("slider").value;
    entry.loc = city;
	data.child("entries").push(entry);
});


/*------------------ SLIDER ---------------------*/
var $element = $('input[type="range"]');
var state1 = 1; 

$element
.rangeslider({
    polyfill: false,
    onInit: function() {
        calcPic(this.value);
        document.getElementById("sVal").innerHTML = this.value;    
    }
})
.on('input', function() {
    calcPic(this.value);
    document.getElementById("sVal").innerHTML = this.value;
});

function calcPic(val) {
    var tempState;
    if(val <= 0){
        tempState = 1;
    }else if(val > 0 && val <= 20){
        tempState = 2;
    }else if(val > 20){
        tempState = 3;
    }
    if(tempState != state1){
        state1 = tempState;
        updatePic();
    }
}

function updatePic() {
    $("#o1").hide();
    $("#o2").hide();
    $("#o3").hide();
    if(state1 == 1){
        $("#o1").show();
    }else if(state1 == 2){
        $("#o2").show();
    }else if(state1 == 3){
        $("#o3").show();
    }
}
