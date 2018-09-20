
var map = L.Wrld.map("map", "91579bb03b94dbe153485fb8b1033e8d", {
    center: [56.460094, -2.972821],
    zoom: 17,
    indoorsEnabled: true
});

var indoorControl = new WrldIndoorControl("widget-container", map);
var markerController = new WrldMarkerController(map);
var poiApi = new WrldPoiApi("91579bb03b94dbe153485fb8b1033e8d");

var allMarkers = [];
var allMarkerTitles = [];
var currentIndoorMapId;
var currentFloor;

function displayMarkerPopUp(id){
    "use strict";
    var marker = allMarkers[id];
    var title = allMarkerTitles[id];
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
    .setContent("Popup");

    marker.bindPopup(popup)
}

function onPOISearchResults(success, results) { 
    "use strict";
    if (!success) {
        return;
    }
    var i;
    for (i = 0; i < results.length; i++) {
      (function () {
            var markerOptions = {isIndoor: true, iconKey: "toilet_men",
                    floorIndex: results[i].floor_id};

            var tempMarker = markerController.addMarker(i, [results[i].lat,
                    results[i].lon], markerOptions);
            allMarkers.push(tempMarker);
            allMarkerTitles.push(results[i].title);

            var index = i;
            tempMarker.on("click", function (e) {
                displayMarkerPopUp(index);
            });
        }());
    }
}

function searchForAllMarkers(){
    "use strict";
    var poiSettings = {tags: "General", number: 100, floorRange: 1};
    poiApi.searchIndoors(currentIndoorMapId, currentFloor, onPOISearchResults,
            poiSettings);
}

function onIndoorMapEntered(event) {
    "use strict";
    currentIndoorMapId = event.indoorMap.getIndoorMapId();
    currentFloor = map.indoors.getFloor().getFloorIndex();
    searchForAllMarkers();
}

map.indoors.on("indoormapenter", onIndoorMapEntered);