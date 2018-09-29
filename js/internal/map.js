//Shop Modal variables
var span = document.getElementsByClassName("close")[0];
var modal = document.getElementById("shopModal");

//Centre Modal variables
var centreModal = document.getElementById("centreModal");
var centreModalIcon = document.getElementById("centreModalIcon");

//Runtime variables to keep track of them outwith functons
var currentCentreChart;
var graphInterval;


//Set up Overgate indoor map ID, map and map widgets
const indoorMapId = 'EIM-e16a94b1-f64f-41ed-a3c6-8397d9cfe607';
var map = L.Wrld.map("map", "91579bb03b94dbe153485fb8b1033e8d", {
    center: [56.460094, -2.972821],
    zoom: 16,
    indoorsEnabled: true
});
var indoorControl = new WrldIndoorControl("widget-container", map);
var markerController = new WrldMarkerController(map);
var poiApi = new WrldPoiApi("91579bb03b94dbe153485fb8b1033e8d");

//Used to keep track of current modal status
var centreModalUp = false;

//Used to adjust the marker popup height
const markerHeightPopUpAdjustment = -30;

//Keeps track of the data pull loop
var dataPullInterval;

//Can be changed to adjust how often to pull info from the database
var dataPullTimeInMS = 5000;


var initialDataPull = true;

//Used to store all shop floors
var allShopFloors = [];

//Used to keep track of currently selected floor and cure marker
var currentFloor;
var curSelectedMarker;

//Used to store pulled in db information
var dbInfo = [];


function closeModalPopup() {
    "use strict";
    markerController.deselectMarker();
    curSelectedMarker = null;
    deleteShopGraph();
    modal.style.display = "none";
}

// When the user clicks on the exit button, close the modal
span.onclick = function () {
    "use strict";
    closeModalPopup();
};

//Sets colour of icon based on density rating
function updateMarkerIconsBasedOnDensityRating() {
    "use strict";
    allShopFloors.forEach(function (curShopFloor) {
        var options;
        var densityRating = curShopFloor.densityRating;
        if (densityRating === "Quiet") {
            options = {iconKey: "green-marker" };
        } else if (densityRating === "Average") {
            options = {iconKey: "yellow-marker" };
        } else {
            options = {iconKey: "red-marker" };
        }
        markerController.updateMarker(curShopFloor.marker, options);
    })
}

//Used to calculate current density rating of a shop floor
function calculateDensityRating(shopFloor) {
    "use strict";
    var density = shopFloor.databaseInfo.storePopulationDensity;
    var densityRating = "";
    if (density <= 5.68) {
        densityRating = "Busy";
    } else if (density <= 9.95) {
        densityRating = "Average";
    } else if (density >= 0) {
        densityRating = "Quiet";
    }
    return densityRating;
}


function updateCentreModal(totalRatings, totalVisitors, totalCurVisitors) {
    "use strict";
    document.getElementById("centreCurVisitors").innerHTML = "Current Visitors: " + totalCurVisitors;
    document.getElementById("centreShopNumbers").innerHTML = "Number of Shops: " + 68;
    document.getElementById("centreFloorNumbers").innerHTML = "Number of Floors: " + map.indoors.getActiveIndoorMap().getFloorCount();
    document.getElementById("centreTotalVisitors").innerHTML = "Total Visitors Today: " + totalVisitors;
    drawCentreModalChart(totalRatings);
}

function updateMarkerPopUpText(shopFloorID) {
    "use strict";
    var curShopFloor = allShopFloors[shopFloorID];
    document.getElementById("shopModalTitle").innerHTML = curShopFloor.title;
    document.getElementById("shopModalImage").src = curShopFloor.imageURL;
    document.getElementById("modalCurVisitors").innerHTML = "Current Visitors: " + curShopFloor.databaseInfo.storeCurPopulation;
    document.getElementById("modalPopDensity").innerHTML = "Population Density: " + curShopFloor.databaseInfo.storePopulationDensity;
    document.getElementById("modalPopDensityRating").innerHTML = "Density Rating: " + curShopFloor.densityRating;
    document.getElementById("modalTotalVisitors").innerHTML = "Total Visitors: " + curShopFloor.databaseInfo.storeTotPopulation;
}

function updateDisplay() {
    "use strict";
    mapDbInfo();
    updateMarkerIconsBasedOnDensityRating();
    if (curSelectedMarker) {
        updateMarkerPopUpText(curSelectedMarker.id);
        updateShopGraph();
    }
}

function updateMarkerPopUpShopDescription(id) {
    "use strict"
    var curShopFloor = allShopFloors[id];
    document.getElementById("shopDesc").innerHTML = "<h5>Description</h5>" + curShopFloor.description;
}

function requestDataFromDB() {
    "use strict";
    return $.ajax({
        url: 'php/backend_functions.php',
        type: 'POST',
        data: { funct: 'getStoreTable' },
        success: function (result) {
            dbInfo = JSON.parse(result);
            if(initialDataPull){
                initialDataPull = false;
                searchForAllMarkers();
            }else{
                updateDisplay();
            }
        }
    });
}

function movePopupBasedOnMapPos() {
    "use strict";

    if (!curSelectedMarker) {
        return;
    }
    var marker = curSelectedMarker.curMarker;

    var projection = map.latLngToLayerPoint(marker._latlng);
    markerController.selectMarker(marker);
    modal.style.display = "block";
    modal.style.top = projection.y + markerHeightPopUpAdjustment + "px";
    modal.style.left = projection.x + "px";
}

function displayMarkerPopUp(id, event) {
    "use strict";
    deleteShopGraph();
    $('.nav-tabs a:first').tab('show');
    var curShopFloor = allShopFloors[id];
    var curMarker = curShopFloor.marker;

    if (curSelectedMarker) {
        if (curSelectedMarker.curMarker) {
            if (curSelectedMarker.curMarker === curMarker) {
                closeModalPopup();
                return;
            }
        }
    }
    updateMarkerPopUpShopDescription(id);
    updateMarkerPopUpText(id);
    curSelectedMarker = { curMarker: curMarker, id: id };
    markerController.selectMarker(curMarker);
    createShopGraph();
    movePopupBasedOnMapPos();
}


function setShopFloorDBID(id, index) {
    "use strict";
    allShopFloors[index].dbID = id;
}

//Map database information to its relevant shop floor in allShopFloors
function mapDbInfo() {
    "use strict";

    var totalRatings = {
        "Quiet": 0,
        "Average": 0,
        "Busy": 0
    };

    //Total visitors from today
    var totalVisitors = 0;

    var totalCurVisitors = 0;
    dbInfo.forEach(function (dbInfoElement) {
        allShopFloors.forEach(function (allShopFloorsElement) {
            if ((allShopFloorsElement.title === dbInfoElement.storeName) && (allShopFloorsElement.floor == dbInfoElement.storeFloor)) {
                allShopFloorsElement.databaseInfo = dbInfoElement;
                var curRating = calculateDensityRating(allShopFloorsElement);
                allShopFloorsElement.densityRating = curRating;
                totalRatings[curRating] = totalRatings[curRating] + 1;
                totalVisitors += parseInt(dbInfoElement.storeTotPopulation);
                totalCurVisitors += parseInt(dbInfoElement.storeCurPopulation);
            }
        });
    });
    updateCentreModal(totalRatings, totalVisitors, totalCurVisitors);
}



function onPOISearchResults(success, results) {
    "use strict";

    //If search fails
    if (!success) {
        return;
    }

    var i;
    //Loop through all shops and create a marker and shop floor object
    for (i = 0; i < results.length; i++) {
        (function () {
            var markerOptions = {
                isIndoor: true, iconKey: "",
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
                floor: results[i].floor_id,
                description: results[i].user_data.description,
                imageURL: results[i].user_data.image_url,
                marker: tempMarker,
                densityRating: "",
                databaseInfo: []
            };

            allShopFloors.push(shopFloor);
        }());
    }

    updateDisplay();
    dataPullInterval = setInterval(function () {
        requestDataFromDB();
    }, dataPullTimeInMS);
}

//Load in our marker information from the WRLD3D POI API
function searchForAllMarkers() {
    "use strict";
    var poiSettings = { tags: "General", number: 10000 };
    poiApi.searchIndoors(indoorMapId, currentFloor, onPOISearchResults,
        poiSettings);
}

function openCentreModal() {
    "use strict"
    centreModal.style.display = "block";
    centreModal.classList.add("centreModal", "bounceInDown", "delay-3s", "animated");
    centreModal.style.top = "0px";
    centreModalIcon.classList.remove("glyphicon-chevron-down");
    centreModalIcon.classList.add("glyphicon-chevron-up");

}

function closeCentreModal() {
    "use strict"
    centreModal.classList.remove("centreModal", "bounceInDown", "delay-3s", "animated");
    centreModal.classList.add("centreModal", "bounceOutUp", "animated");

    //After animation, bring modal back up to top right, Timeout needed to let animation play
    setTimeout(function () {
        centreModal.classList.remove("bounceOutUp", "delay-3s", "animated");
        centreModal.style.top = "-39%";
        centreModalIcon.classList.remove("glyphicon-chevron-up");
        centreModalIcon.classList.add("glyphicon-chevron-down");
    },
        1000)
}

function toggleCentreModal() {
    "use strict"
    if (!centreModalUp) {
        closeCentreModal();
        centreModalUp = true;
    } else {
        openCentreModal();
        centreModalUp = false;
    }
}

function onIndoorMapEntered(event) {
    "use strict";
    requestDataFromDB();
    openCentreModal();
    currentFloor = map.indoors.getFloor().getFloorIndex();
}

map.on('initialstreamingcomplete', () => {
    map.indoors.enter(indoorMapId);

});

//Add callbacks from internal map functions
map.indoors.on("indoormapenter", onIndoorMapEntered);
map.indoors.on("indoormapfloorchange", closeModalPopup);
map.on("pan", movePopupBasedOnMapPos);
map.on("zoom", movePopupBasedOnMapPos);

//
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var target = $(e.target).attr("href"); // activated tab
    if (target == '#vis') {
        updateShopGraph();
    }
});