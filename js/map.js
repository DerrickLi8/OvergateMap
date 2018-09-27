var span = document.getElementsByClassName("close")[0];
var modal = document.getElementById("shopModal");
var centreModal = document.getElementById("centreModal");
var centreModalIcon = document.getElementById("centreModalIcon");
var currentCentreChart;
var graphInterval;

const indoorMapId = 'EIM-e16a94b1-f64f-41ed-a3c6-8397d9cfe607';
var map = L.Wrld.map("map", "91579bb03b94dbe153485fb8b1033e8d", {
    center: [56.460094, -2.972821],
    zoom: 16,
    indoorsEnabled: true
});

var indoorControl = new WrldIndoorControl("widget-container", map);
var markerController = new WrldMarkerController(map);
var poiApi = new WrldPoiApi("91579bb03b94dbe153485fb8b1033e8d");

var centreModalUp = false;

const markerHeightAdjustment = -30;

var allShopFloors = [];
var currentFloor;
var curSelectedMarker;
var interval;

var dbInfo = [];

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

function updateMarkers(){
    allShopFloors.forEach(function(curShopFloor){
        var options;
        var densityRating = curShopFloor.densityRating;
        console.log(densityRating);
        if(densityRating === "Quiet"){
            options={iconKey:"green-marker"};
        }else if(densityRating === "Average"){
            options={iconKey:"yellow-marker"};
        }else{
            options={iconKey:"red-marker"};
        }
        markerController.updateMarker(curShopFloor.marker,options);
    })
}
function calculateDensityRating(shopFloor) {
    var density = shopFloor.databaseInfo.storePopulationDensity;
    var densityRating = 0;
    if (density <= 5.68) {
        densityRating = "Busy";
    } else if (density <= 9.95) {
        densityRating = "Average";
    } else {
        densityRating = "Quiet";
    }
    return densityRating;
}

function onlyUnique(value, index, self) {
    return self.indexOf(value.title) === index.title;
}

function updateCentreModal(totalRatings, totalVisitors, totalCurVisitors) {
    "use strict";
    document.getElementById("centreCurVisitors").innerHTML = "Current Visitors: " + totalCurVisitors;
    document.getElementById("centreShopNumbers").innerHTML = "Number of Shops: " + 0;
    document.getElementById("centreFloorNumbers").innerHTML = "Number of Floors: " + map.indoors.getActiveIndoorMap().getFloorCount();
    document.getElementById("centreTotalVisitors").innerHTML = "Total Visitors: " + totalVisitors;
    var ctx = document.getElementById("centreChart").getContext('2d');
    var data = {
        datasets: [{
            data: [totalRatings.Busy, totalRatings.Quiet, totalRatings.Average],
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(26, 199, 25, 1)',
                'rgba(255, 206, 86, 1)'
            ]
        }],

        labels: [
            'Busy',
            'Quiet',
            'Average'
        ]
    };
    if(currentCentreChart){
        currentCentreChart.destroy();
    }
     currentCentreChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            legend: {
                display: false
            }
        }
    });

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
    mapDbInfo();
    updateMarkers();
    if (curSelectedMarker) {
        updateMarkerPopUpText(curSelectedMarker.id);
        updateShopGraph();
    }
}

function requestDataFromDBFirst() {
    "use strict";
    return $.ajax({
        url: 'backend_functions.php',
        type: 'POST',
        data: { funct: 'getStoreTable' },
        success: function (result) {
            dbInfo = JSON.parse(result);
            searchForAllMarkers();
        }
    });
}

function requestDataFromDBUpdate() {
    "use strict";
    return $.ajax({
        url: 'backend_functions.php',
        type: 'POST',
        data: { funct: 'getStoreTable' },
        success: function (result) {
            dbInfo = JSON.parse(result);
            updateDisplay();
        }
    });
}

function movePopup() {
    "use strict";

    if (!curSelectedMarker) {
        return;
    }
    var marker = curSelectedMarker.curMarker;

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

    if (curSelectedMarker) {
        if (curSelectedMarker.curMarker) {
            if (curSelectedMarker.curMarker === curMarker) {
                closeModalPopup();
                return;
            }
        }
    }

    updateMarkerPopUpText(id);
    curSelectedMarker = { curMarker: curMarker, id: id };
    markerController.selectMarker(curMarker);
    movePopup();
}


function setShopFloorDBID(id, index) {
    "use strict";
    allShopFloors[index].dbID = id;
}

function mapDbInfo() {
    "use strict";
    var index = 0;

    var totalRatings = {
        "Quiet": 0,
        "Average": 0,
        "Busy": 0
    };

    var totalVisitors = 0;
    var totalCurVisitors = 0;
    console.log("mapdbinfo");
    dbInfo.forEach(function (element) {
        allShopFloors.forEach(function (element2) {
            if ((element2.title === element.storeName) && (element2.floor == element.storeFloor)) {
                element2.databaseInfo = element;
                var curRating = calculateDensityRating(element2);
                element2.densityRating = curRating;
                totalRatings[curRating] = totalRatings[curRating] + 1;
                totalVisitors += parseInt(element.storeTotPopulation);
                totalCurVisitors += parseInt(element.storeCurPopulation);
                console.log(element2.title + " " + element.storeName);
            }
        });
    });
    console.log(index);
    console.log(allShopFloors);
    console.log(totalRatings);
    updateCentreModal(totalRatings, totalVisitors, totalCurVisitors);
}



function onPOISearchResults(success, results) {
    "use strict";
    console.log(results);
    if (!success) {
        return;
    }
    var i;
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
                imageURL: results[i].user_data.image_url,
                marker: tempMarker,
                densityRating: "",
                databaseInfo: []
            };
            allShopFloors.push(shopFloor);
        }());
    }
    updateDisplay();
    interval = setInterval(function () {
        requestDataFromDBUpdate();
    }, 5000);
}

function searchForAllMarkers() {
    "use strict";
    var poiSettings = { tags: "General", number: 10000};
    poiApi.searchIndoors(indoorMapId, currentFloor, onPOISearchResults,
        poiSettings);
}

function openCentreModal() {
    centreModal.style.display = "block";
    centreModal.classList.add("centreModal", "bounceInDown", "delay-3s", "animated");
    centreModal.style.top = "0px";
    centreModalIcon.classList.remove("glyphicon-chevron-down");
    centreModalIcon.classList.add("glyphicon-chevron-up");
    
}

function closeCentreModal() {
    centreModal.classList.remove("centreModal", "bounceInDown", "delay-3s", "animated");
    centreModal.classList.add("centreModal", "bounceOutUp", "animated");
    setTimeout(function () {
        centreModal.classList.remove("bounceOutUp", "delay-3s", "animated");
        centreModal.style.top = "-35%";
        centreModalIcon.classList.remove("glyphicon-chevron-up");
        centreModalIcon.classList.add("glyphicon-chevron-down");
    },
        1000)
}

function toggleCentreModal() {
    console.log(centreModalUp);
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
    requestDataFromDBFirst();
    openCentreModal();
    currentFloor = map.indoors.getFloor().getFloorIndex();
}

map.on('initialstreamingcomplete', () => {
    map.indoors.enter(indoorMapId);
});
map.indoors.on("indoormapenter", onIndoorMapEntered);
map.indoors.on("indoormapfloorchange", closeModalPopup);
map.on("pan", movePopup);
map.on("zoom", movePopup);