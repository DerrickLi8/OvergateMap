var span = document.getElementsByClassName("close")[0];
var modal = document.getElementById("myModal");

const indoorMapId = 'EIM-e16a94b1-f64f-41ed-a3c6-8397d9cfe607';
var map = L.Wrld.map("map", "91579bb03b94dbe153485fb8b1033e8d", {
    center: [56.460094, -2.972821],
    zoom: 16,
    indoorsEnabled: true
});

var indoorControl = new WrldIndoorControl("widget-container", map);
var markerController = new WrldMarkerController(map);
var poiApi = new WrldPoiApi("91579bb03b94dbe153485fb8b1033e8d");

const markerHeightAdjustment = -30;

var allShopFloors = [];
var currentFloor;
var curSelectedMarker;

function closeModalPopup() {
    "use strict";
    markerController.deselectMarker();
    curSelectedMarker = null;
    modal.style.display = "none";
}

// When the user clicks on x, close the modal
span.onclick = function () {
    "use strict";
    closeModalPopup();
};

function movePopup(){
    "use strict";
    var marker = curSelectedMarker;
    if (!marker) {
        return;
    }

    var projection = map.latLngToLayerPoint(marker._latlng);
    markerController.selectMarker(marker);
    modal.style.display = "block";
    modal.style.top = projection.y + markerHeightAdjustment + "px";
    modal.style.left = projection.x + "px";
}

function displayMarkerPopUp(id, event) {
    "use strict";
    var curShopFloor = allShopFloors[id];
    var curMarker = curShopFloor.marker;

    if (curSelectedMarker === curMarker) {
        closeModalPopup();
        return;
    }

    var title = curShopFloor.title;

    curSelectedMarker = curMarker;
    markerController.selectMarker(curMarker);
    movePopup();
}

function onPOISearchResults(success, results) {
    "use strict";
    if (!success) {
        return;
    }
    var i;
    for (i = 0; i < results.length; i++) {
        (function () {
            var markerOptions = {
                isIndoor: true, iconKey: "toilet_men",
                floorIndex: results[i].floor_id
            };

            var tempMarker = markerController.addMarker(i, [results[i].lat,
                    results[i].lon], markerOptions);

            var index = i;
            tempMarker.on("click", function (e) {
                displayMarkerPopUp(index, e);
            });

            var shopFloor = {
                title: results[i].title,
                marker: tempMarker,
                occupancy: 0,
                populationDensity: 0
            };

            allShopFloors.push(shopFloor);
        }());
    }
}

function searchForAllMarkers() {
    "use strict";
    var poiSettings = {tags: "General", number: 100, floorRange: 1};
    poiApi.searchIndoors(indoorMapId, currentFloor, onPOISearchResults,
            poiSettings);
}

function onIndoorMapEntered(event) {
    "use strict";
    currentFloor = map.indoors.getFloor().getFloorIndex();
    searchForAllMarkers();
}

map.on('initialstreamingcomplete', () => {
    map.indoors.enter(indoorMapId);
  });
map.indoors.on("indoormapenter", onIndoorMapEntered);
map.indoors.on("indoormapfloorchange", closeModalPopup);
map.on("pan", movePopup);
map.on("zoom", movePopup);