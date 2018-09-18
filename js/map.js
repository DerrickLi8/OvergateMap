
var map = L.Wrld.map("map", "91579bb03b94dbe153485fb8b1033e8d", {
  center: [56.4601, -2.9728],
  zoom: 16,
  indoorsEnabled: true
});

var markers = []
var curMarkers = []
var markerTitles = []
var index = 0;
var markerController = new WrldMarkerController(map);
var indoorControl = new WrldIndoorControl("widget-container", map);
var currentIndoorMapId;
var currentFloor;
var poiApi = new WrldPoiApi("91579bb03b94dbe153485fb8b1033e8d");
function onIndoorMapEntered(event) {
  currentIndoorMapId = event.indoorMap.getIndoorMapId();
  currentFloor = map.indoors.getFloor().getFloorIndex();
  console.log(currentFloor);
  poiApi.searchIndoors(currentIndoorMapId, currentFloor, onPOISearchResults,
    { tags: "General", number: 100, floorRange: 1 });
}

function onPOISearchResults(success, results) { 
  if (success) {
    var i;
    for(i=0; i < results.length; i++){
      (function () {
        var tempMarker = markerController.addMarker(i, [results[i].lat, results[i].lon], { isIndoor: true, iconKey: "toilet_men", floorIndex: results[i].floor_id });
        markers.push(tempMarker);
        var tempTitle = results[i].title
        markerTitles.push(tempTitle);
        var index = i;
        tempMarker.on("click", function (e) { displayMarkerPopUp(index); });
      }());
    }
  }
}

function displayMarkerPopUp(markersIndex) {
  marker=markers[markersIndex];
  console.log(markersIndex);
  title=markerTitles[markersIndex];
  if (marker.getPopup()) {
    console.log(marker.getPopup());
    marker.unbindPopup();
  }
  console.log(marker);
  console.log(title);
  var popupOptions = {
    indoorMapId: currentIndoorMapId,
    indoorMapFloorIndex: currentFloor,
    autoClose: false,
    closeOnClick: false,
    minWidth: "5"
  };

  var popup = L.popup(popupOptions)
    .setLatLng(marker._latlng)
    .addTo(map)
    .setContent(
      "<div class='panel panel-primary'>" +
      "<div class='panel-heading'>" +
      "<h2 class='panel-title'>" +
      title + " Floor " + marker.options.indoorMapFloorIndex +
      "</h2>" +
      "</div>" +
      "<div class='panel-body'>" +
      "<div class='container'> " +

      "<div id='myCarousel' class='carousel slide' data-ride='carousel'> " +
      "		<script src ='js/carousel.js'></script>" +
      "<br></br>" +
      " <!-- Indicators --> " +
      "<ol class='carousel-indicators' style='position:relative;background-color:rgba(0, 0, 0, 0.69);border-radius: 25px;padding-top:5px; border: 2px rgba(0, 0, 0, 0.69); margin-bottom:0px' > " +
      " <li data-target='#myCarousel' data-slide-to='0' style='' class='active'></li> " +
      "<li data-target='#myCarousel' data-slide-to='1' style=''></li> " +
      "<li data-target='#myCarousel' data-slide-to='2' style=''></li> " +
      "</ol> " +

      " <!-- Wrapper for slides --> " +
      " <div class='carousel-inner'> " +

      "      <div class='item active'> " +
      " <h3 class='ch3' style='text-align:center;color:darkgray'>People Density History</h3>" +
      "        <div class='carousel-caption'> " +
      "       </div> " +
      "      </div> " +

      "      <div class='item'> " +
      "        <img src='https://datavizcatalogue.com/methods/images/top_images/area_graph.png' style='width:100%;' alt='...'>" + 
      "      <div class='carousel-caption'> " +
      "   </div> " +
      "</div> " +

      "<div class='item'> " +
      " <img src='https://www.charterworld.com/news/wp-content/uploads/2012/09/Graph-sqm.jpg' style='width:100%;' alt='...'>" +
      "<div class='carousel-caption'> " +
      "</div> " +
      "</div> " +
      "</div> " +
      "</div>" +

      "<div style='width:90%;margin-left:5%;'><hr align='center'></div>" +
      "<h4 style='text-align:center;'>Current Statistics</h4>" +
      "<div class='row' style='width:100%;'>" +
      "<div class='col-md-6' style='text-align:center;'>"+
      "<h4>"+ title + " Floor " + marker.options.indoorMapFloorIndex +"</h4>" +
      "<div class='shopContent' style='text-align:center;'>"+
        "<p>Current Visitors: 10" +
        "<p>Current Population Density: 10/m2" +
        "<p>Current Pop Density Rating: Average" +
      "</div>"+
      "</div>" +
      "<div class='col-md-6' style='text-align:center;'>"+
      "<h4>"+ title +"</h4>" +
      "<div class='shopContent' style='text-align:center;'>"+
        "<p>Current Visitors: 20" +
        "<p>Current Population Density: 30/m2" +
        "<p>Current Pop Density Rating: High" +
      "</div>"+
      "</div>" +
      "</div>"+
      "</div>"

    );

  marker.bindPopup(popup)
}

function onIndoorMapFloorChanged() {
  currentFloor = map.indoors.getFloor().getFloorIndex();
}

map.indoors.on("indoormapenter", onIndoorMapEntered);
map.indoors.on("indoormapfloorchange", onIndoorMapFloorChanged);