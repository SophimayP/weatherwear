/* -------------- GEOLOCATION ------------ */
var city;
var cityUpper;
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
            cityUpper = location.address_components[2].short_name; //passing the current city to be in this div
            document.getElementById("barLocDisp").innerHTML = cityUpper;
            city = location.address_components[2].short_name; //Getting the current city
            city = city.replace(/\s+/g, '-').toLowerCase(); //making lowercase and any spaces change to - so that it will not break URL and cities like New Plymouth become new-plymouth which works with the URL. 
              
            /* -------------- WEATHER ------------ */
            //Metservice JSON can't seem to be used as has an origin error:  http://metservice.com/publicData/localForecastwellington and Sam Jones was passing it through a proxy which he let me use - hope thats ok as it's the same data I'm receiving all I'm swapping out is the URL and it saves me having to host it on a third party proxy server myself just to get pass the origin not being allowed.
            var metServ = "http://uni.ey.nz/metservice.php?oneMinObs_";
            var jsonURL = metServ + city;
            $.getJSON(jsonURL, function (json) {
             var clothingLayers = json.clothingLayers;
             $("#1").hide();
             $("#1to2").hide();
             $("#2").hide();
             $("#2to3").hide();
             $("#3").hide();
             $("#3to4").hide();
             if(clothingLayers == "1"){
                 $("#1").show();
             }else if(clothingLayers == "1 to 2"){
                 $("#1to2").show();
             }else if(clothingLayers == "2"){
                 $("#2").show();
             }else if(clothingLayers == "2 to 3"){
                 $("#2to3").show();
             }else if(clothingLayers == "3"){
                 $("#3").show();
             }else if(clothingLayers == "3 to 4"){
                 $("#3to4").show();
             }else{
                 $("#3to4").show();
             }
             var weatherTemp = json.temperature;
             var windLayers = json.windProofLayers;
             document.getElementById("barTempDisp").innerHTML = weatherTemp + '°';
             document.getElementById("weatherDisp").innerHTML = "It's currently " + weatherTemp +" degrees in " + cityUpper + ".";
             document.getElementById("layersDisp").innerHTML = "MetService recommends " + clothingLayers + " clothing layers and " + windLayers + " windproof layers.";  
             var rainFall = 5;
             var rain = false;
             rainFall = parseInt(json.rainfall);
             if(rainFall >= 5){
                 rain = true;
             }
             if(rain){
                 document.getElementById("rainDisp").innerHTML = "There's been " + rainFall + "mm of rainfall today so you might want to take a raincoat.";
             }else{
                 document.getElementById("rainDisp").innerHTML = "There's been just " + rainFall + "mm of rainfall today so don't worry about a raincoat.";
             }
            });
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
    $('.entryImg').each(function(i, obj) {
        var result = document.getElementsByClassName("entryImg")[i].innerHTML;
        var imgSrc = '<img class="oImg" src="images/outfits/' + result + '.png">'
        console.log(imgSrc);
        document.getElementsByClassName("entryImg")[i].innerHTML = imgSrc;
    });
});

$("#submit").click(function(){
	var entry = {
        scale: 5,
        rain: "No",
	}
    if ($('#rain').is(":checked")){
      entry.rain = "Yes";
    }
    entry.scale = document.getElementById("slider").value;
	data.child(city).push(entry);
});


/*------------------ SLIDER ---------------------*/
var $element = $('input[type="range"]');
var outfitState = 1; 

$element
.rangeslider({
    polyfill: false,
    onInit: function() {
        calcPic(this.value);  
    }
})
.on('input', function() {
    calcPic(this.value);
});

function calcPic(val) {
    if(val != outfitState){
        outfitState = val;
        updatePic();
    }
}

function updatePic() {
    $("#o1").hide();
    $("#o2").hide();
    $("#o3").hide();
    $("#o4").hide();
    $("#o5").hide();
    $("#o6").hide();
    $("#o7").hide();
    $("#o8").hide();
    $("#o9").hide();
    if(outfitState == 1){
        $("#o1").show();
    }else if(outfitState == 2){
        $("#o2").show();
    }else if(outfitState == 3){
        $("#o3").show();
    }else if(outfitState == 4){
        $("#o4").show();
    }else if(outfitState == 5){
        $("#o5").show();
    }else if(outfitState == 6){
        $("#o6").show();
    }else if(outfitState == 7){
        $("#o7").show();
    }else if(outfitState == 8){
        $("#o8").show();
    }else if(outfitState == 9){
        $("#o9").show();
    }
}

/*------------------ DISPLAY ---------------------*/
$(document).ready(function(){
    //initial hide the three parts of the app
    $("#metservData").hide();
    $("#enterData").hide();
    $("#othersData").hide();
    $("#landingPage").show();
    //when the logo is clicked go to the landing page
    $("#logo").click(function(){
        $("#landingPage").show();
        $("#metservData").hide();
        $("#enterData").hide();
        $("#othersData").hide();
    });
    //when the respective button is pushed show the element and hide the others
    $("#metServBtn").click(function(){
        $("#metservData").show();
        $("#enterData").hide();
        $("#othersData").hide();
        $("#landingPage").hide();
    });
    $("#enterDataBtn").click(function(){
        $("#enterData").show();
        $("#metservData").hide();
        $("#othersData").hide();
        $("#landingPage").hide();
    });
    $("#dispOthersBtn").click(function(){
        $("#othersData").show();
        $("#enterData").hide();
        $("#metservData").hide();
        $("#landingPage").hide();
    });
});
