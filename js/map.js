  var map = L.Wrld.map("map", "91579bb03b94dbe153485fb8b1033e8d", {
    center: [56.459801, -2.977928],
    zoom: 15,
    indoorsEnabled: true
  });

  var markers = [];
  var markerController = new WrldMarkerController(map); 
  var indoorControl = new WrldIndoorControl("widget-container", map);
  var currentIndoorMapId;
  var currentFloor;

  var poiApi = new WrldPoiApi("91579bb03b94dbe153485fb8b1033e8d");

  var lastMouseDown;
  function onMouseDown(event) {
    lastMouseDown = event.latlng;
  }
  
  function onIndoorEntityClicked(event) {
    event.ids.forEach(identifyEntity);
  }
  
  function onIndoorMapEntered(event) {
    currentIndoorMapId = event.indoorMap.getIndoorMapId();
    currentFloor = map.indoors.getFloor().getFloorIndex();
    poiApi.searchIndoors(currentIndoorMapId, currentFloor,onPOISearchResults,
      {tags: "General"});
  }

  function onPOISearchResults(success, results){
    if (success) 
    { 
      results.forEach(displayPOIMarker)
    }
  }

  function displayPOIMarker(marker){
    console.log(marker);
    var tempMarker = markerController.addMarker(markers,[marker.lat,marker.lon], {iconKey: "toilet_men"});
    tempMarker.on("click", function(e) { displayMarkerPopUp(tempMarker); });
  }

  function onIndoorMapFloorChanged() {
    currentFloor = map.indoors.getFloor().getFloorIndex();
  }
  
  function identifyEntity(id) {
    var latLng = lastMouseDown;
    
    var popupOptions = { 
      indoorMapId: currentIndoorMapId, 
      indoorMapFloorIndex: currentFloor, 
      autoClose: false, 
      closeOnClick: false,
      minWidth: "5"          
    };
    var popup = L.popup(popupOptions)
      .setLatLng(latLng)
      .addTo(map)
      .setContent(id);
  }

  map.indoors.on("indoormapenter", onIndoorMapEntered);
  map.indoors.on("indoormapfloorchange", onIndoorMapFloorChanged)
  map.indoors.on("indoorentityclick", onIndoorEntityClicked);
  map.on("mousedown", onMouseDown);