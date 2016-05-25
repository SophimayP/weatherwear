var globalData = {
    currentCity : null,
    weatherData : {
        temperature: null,
        clothingLayers: null,
        windLayers: null,
        rainFall: null,
        rain: null
    },
    othersData : {}
};

function getGeolocation(){
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
                globalData.currentCity = location.address_components[2].short_name; 
                break;
              }
            }
          }
        });
      });
    }
}

function getFirebaseData(){
    //var fireURL = globalData.currentCity;
    var fireURL = "Wellington";
    fireURL = fireURL.replace(/\s+/g, '-').toLowerCase();
    var fireHtml = "https://intense-fire-1222.firebaseio.com/" + fireURL +"/";
    //var fireHtml = "https://intense-fire-1222.firebaseio.com/";
    var data = new Firebase(fireHtml);
    data.on("value", function(snapshot){
        globalData.othersData = snapshot.val();
        render();
    }); 
}

function getWeatherData(){
    var metServ = "http://uni.ey.nz/metservice.php?localObs_";
    var cityURL = globalData.currentCity;
    cityURL = cityURL.replace(/\s+/g, '-').toLowerCase(); //making lowercase and any spaces change to - so that it will not break URL and cities like New Plymouth become new-plymouth which works with the URL. 
    var jsonURL = metServ + cityURL;
    $.getJSON(jsonURL, function (json) {
        globalData.weatherData.temperature = json.threeHour.temp;
        globalData.weatherData.clothingLayers = json.threeHour.clothingLayers;
        globalData.weatherData.windLayers = json.threeHour.windProofLayers;
        globalData.weatherData.rainFall = 5;
        globalData.weatherData.rain = false;
        globalData.weatherData.rainFall = parseInt(json.threeHour.rainfall);
        if(globalData.weatherData.rainFall >= 5){
         globalData.weatherData.rain = true;
        }
    });
}

function render(){
    document.getElementById("barLocDisp").innerHTML = globalData.currentCity;
    //Weather Display
    $("#1").hide();
    $("#1to2").hide();
    $("#2").hide();
    $("#2to3").hide();
    $("#3").hide();
    $("#3to4").hide();
    if(globalData.weatherData.clothingLayers == "1"){
        $("#1").show();
    }else if(globalData.weatherData.clothingLayers == "1 to 2"){
        $("#1to2").show();
    }else if(globalData.weatherData.clothingLayers == "2"){
        $("#2").show();
    }else if(globalData.weatherData.clothingLayers == "2 to 3"){
        $("#2to3").show();
    }else if(globalData.weatherData.clothingLayers == "3"){
        $("#3").show();
    }else if(globalData.weatherData.clothingLayers == "3 to 4"){
        $("#3to4").show();
    }else{
        $("#3to4").show();
    }
    document.getElementById("barTempDisp").innerHTML = globalData.weatherData.temperature + '°';
    document.getElementById("weatherDisp").innerHTML = "It's currently " + globalData.weatherData.temperature +" degrees in " + globalData.currentCity + ".";
    document.getElementById("layersDisp").innerHTML = "MetService recommends " + globalData.weatherData.clothingLayers + " clothing layers and " + globalData.weatherData.windLayers + " windproof layers.";  
    if(globalData.weatherData.rain){
         document.getElementById("rainDisp").innerHTML = "There's been " + globalData.weatherData.rainFall + "mm of rainfall today so you might want to take a raincoat.";
     }else{
         document.getElementById("rainDisp").innerHTML = "There's been just " + globalData.weatherData.rainFall + "mm of rainfall today so don't worry about a raincoat.";
     }
    
 
    //Others Data Display
    var source = $("#home-template").html();
	var template = Handlebars.compile(source);
    console.log(globalData.othersData);
	var html = template(globalData.othersData);
	$("#change").html(html);
    $('.entryImg').each(function(i, obj) {
        var result = document.getElementsByClassName("entryImg")[i].innerHTML;
        var imgSrc = '<img class="othersImg" src="images/outfits/' + result + '.png">'
        document.getElementsByClassName("entryImg")[i].innerHTML = imgSrc;
    });
    $( ".anEntry" ).addClass( "grid-item" );
    var $grid = $('.grid').packery({
      itemSelector: '.grid-item',
      columnWidth: 100
    });
    // make all grid-items draggable
    $grid.find('.grid-item').each( function( i, gridItem ) {
      var draggie = new Draggabilly( gridItem );
      // bind drag events to Packery
      $grid.packery( 'bindDraggabillyEvents', draggie );
    });
}

$("#submit").click(function(){
    var data2 = new Firebase("https://intense-fire-1222.firebaseio.com/wellington/"); 
	var entry = {
        scale: 5,
        rain: "No",
	}
    if ($('#rain').is(":checked")){
      entry.rain = "Yes";
    }
    entry.scale = document.getElementById("slider").value;
	data2.child("userEntries").push(entry); //puts the data in an entry underneath userentries underneath wellington so that the handles variable can just be userentries which will work for all citys instead of having to change the city name inside the template.
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
    //load the different information into globaldata
    getGeolocation();
    getFirebaseData();
    if(globalData.currentCity != null){
        getWeatherData(); 
        //if(globalData.weatherData.temperature != null){}
        getFirebaseData();
    }
    
    $("#inputCity").change(function () {
        globalData.currentCity = $(this).val();
        getWeatherData();
        if(globalData.weatherData.temperature != null){
            render();
        }
        getFirebaseData();
        //render();
    });
    
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
