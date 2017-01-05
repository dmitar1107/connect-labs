
var ConnectMap = function(){
  this.markersArray = [];
  this.mappedPeople = 0;
  this.markerClusterer = null;
  this.mapCenter = new google.maps.LatLng(38.49271939740332, -52.066500000000026);
  this.mapdiv = document.getElementById('map');
  this.zoomLevel = 3;
  this.mapOptions = {
    zoom: this.zoomLevel,
    center: this.mapCenter,
    disableDefaultUI: true,
    mapTypeControl: false,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    streetViewControl: false,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT
    },
    minZoom: 2
  };
  this.initialize();
}

ConnectMap.prototype.initialize = function() {
  var _this=this;
  this.setMapsize();
  this.map = new google.maps.Map(this.mapdiv, this.mapOptions);
  $(window).resize(function() {
    _this.setMapsize();
  });
  // Event Handlers
  $("#map-controls .satellite").on("click", function(e) {
    _this.toggleMapMode(e);
  });
  $("#map-controls .locate").on("click", function() {
    _this.setCurrentLocation();
  }); 
  if(! /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    google.maps.event.addDomListener(this.map, 'tilesloaded', function(){
      if($('#newPos').length==0){
          $('div.gmnoprint').last().parent().wrap('<div id="newPos" style="position:absolute;right:8px;top:35px" />');
      }
    });
  }
}

ConnectMap.prototype.initializeMarkers = function(connectionsObject) {
  this.mappedPeople = 0;
  this.createMarkers(connectionsObject);
  this.markerClusterer = new MarkerClusterer(this.map, this.markersArray);
  google.maps.event.addListener(this.markerClusterer, 'clusterclick', function(cluster) {
    if(cluster.markers_.length==1){
      infoWindow.fetchContact(cluster.markers_[0].fb_id); //show profile
    }else{
     infoWindow.cluster( cluster );
    }
  });
  this.clusterComplete = true;
  connectInstance.activeFilterContainer.headline("<div id='numbers-count'><div id='total-people-count'><span>of<br />" + connectInstance.user.connections.length + "</span></div><div id='mapped-people-count'><span>" + connectInstance.map.mappedPeople + "</span></div></div>");
  
}

ConnectMap.prototype.updateMarkers = function(connectionsObject) {
  this.clearOverlays();
  this.initializeMarkers(connectionsObject);
  this.markerClusterer.fitMapToMarkers();
}

ConnectMap.prototype.clearOverlays = function() {
  this.markerClusterer.clearMarkers();
  this.markersArray.length = 0;
  connectInstance.activeFilterContainer.headline("<div id='numbers-count'><div id='total-people-count'><span>of<br />" + connectInstance.user.connections.length + "</span></div><div id='mapped-people-count'><span>" + this.markersArray.length + "</span></div></div>");
  
}  
  
ConnectMap.prototype.setMapsize = function() {
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    this.mapdiv.style.height=($(window).height())+'px';
  } else {
  this.mapdiv.style.height=($(window).height()-118)+'px';
  }
  this.mapdiv.style.width=($(window).width())+'px';
}

ConnectMap.prototype.addMarker = function(location, contact) {
  var photo_url = "http://graph.facebook.com/" + contact.fb_id + "/picture";
  var marker = new google.maps.Marker({
    position: location,
    animation: google.maps.Animation.DROP,	
    map: this.map,
    fb_id: contact.fb_id,
    photo_url: photo_url,
    name: contact.name
  });
  this.markersArray.push(marker);
}
	
	
ConnectMap.prototype.createMarkers = function(contacts) {
  for (i in contacts) {
    if(contacts[i].lat && contacts[i].lng){
      var location = new google.maps.LatLng(contacts[i].lat, contacts[i].lng);
      this.addMarker(location, contacts[i]);
	  this.mappedPeople++;
    }
  }
}	

ConnectMap.prototype.setLocation = function(position) {
  this.map.panTo(position);
}

ConnectMap.prototype.setCurrentLocation = function(zoom) {
  var _this = this;
  if(!zoom){
    zoom = 11;
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var currentLatLng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      _this.setLocation(currentLatLng);
      _this.map.setZoom(zoom);
    }, function() {
      // geolocation not supported.
      });
  }
}

ConnectMap.prototype.toggleMapMode = function(event) {
  if ($("#map-controls .satellite").hasClass("selected")) {
    this.map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
    $("#map-controls .satellite").removeClass("selected");
  } else {
    this.map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
    $("#map-controls .satellite").addClass("selected");
  }
}

ConnectMap.prototype.filterMarkers = function(newMarker) {
	var contact = new Object;
	contact.fb_id = newMarker[3];
	contact.name = newMarker[0];
        var location = new google.maps.LatLng(newMarker[1], newMarker[2]);
	this.setLocation(location);
        this.map.setZoom(10);
        infoWindow.fetchContact(contact.fb_id); //show profile
}

ConnectMap.prototype.singleMarker = function(location, contact) {
  var photo_url = "http://graph.facebook.com/" + contact.fb_id + "/picture";
  var photo_marker = "util/markers/create.php?friend_id=" + contact.fb_id + "&count=" + 1 + "&photo_url=" + photo_url;
  var marker = new google.maps.Marker({
    position: location,
    animation: google.maps.Animation.DROP,	
    map: this.map,
    fb_id: contact.fb_id,
    photo_url: photo_marker,
    name: contact.name
  });
  google.maps.event.addListener(marker, 'clusterclick', function(cluster) {
    infoWindow.cluster( cluster );
    //console.log(marker);
  });
  return marker;
  
}
