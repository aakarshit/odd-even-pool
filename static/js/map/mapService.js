(function(){
	var app = angular.module("mapModule", []);

	app.service("mapService", ["$q", function($q){
		var that = this;
		var currentLocationLatLng = null;

		this.map = {};
		this.geocoder = {};
		this.directionsService = {};
		this.directionsDisplay = {};
		this.autocompleteService = {};
		this.placeService = {};

		// intialize
		(function() {
			that.map = new google.maps.Map(document.getElementById('map-canvas'), {
				center: new google.maps.LatLng(28.6100, 77.2300),
		    zoom: 12
			});
			that.geocoder = new google.maps.Geocoder;
			that.autocompleteService = new google.maps.places.AutocompleteService();
			that.placeService = new google.maps.places.PlacesService(that.map);
			that.directionsService = new google.maps.DirectionsService();
			that.directionsDisplay = new google.maps.DirectionsRenderer({
				markerOptions: {
					visible: false
				}
			});
			that.directionsDisplay.setMap(that.map);
		})();

		
		// takes in an array of results that the geocoding api returns
		// search for a result object that is an approximate location
		// extract components from the geocode result object and convert to a local result object
		function parseGeocodeResults(results) {
			var geocodeResult = results[0];
			for (var i = 0; i < results.length; ++i) {
				if(results[i].geometry.location_type === "APPROXIMATE") {
					geocodeResult = results[i];
					break;
				}
			}
			return convertGeocodeResultToLocalResult(geocodeResult);
		}


		function convertGeocodeResultToLocalResult(geocodeResult) {
			var localResult = {};
			localResult.formatted_address = geocodeResult.formatted_address;
			for (var i = 0; i < geocodeResult.address_components.length; ++i) {
				var addressComponent = geocodeResult.address_components[i];
				switch(addressComponent.types[0]) {
					case "country":
						localResult.country = addressComponent.short_name || "";
						break;
					case "postal_code":
						localResult.postal_code = addressComponent.short_name || "";
						break;
					case "administrative_area_level_1":
						localResult.administrative_area_level_1 = addressComponent.short_name || "";
						break;
					case "administrative_area_level_2":
						localResult.administrative_area_level_2 = addressComponent.short_name || "";
						break;
					case "administrative_area_level_3":
						localResult.administrative_area_level_3 = addressComponent.short_name || "";
						break;
					case "administrative_area_level_4":
						localResult.administrative_area_level_4 = addressComponent.short_name || "";
						break;
					case "administrative_area_level_5":
						localResult.administrative_area_level_5 = addressComponent.short_name || "";
						break;
					case "locality":
						localResult.locality = addressComponent.short_name || "";
						break;
					case "sublocality_level_1":
						localResult.sublocality_level_1 = addressComponent.short_name || "";
						break;
					case "sublocality_level_2":
						localResult.sublocality_level_2 = addressComponent.short_name || "";
						break;
					case "sublocality_level_3":
						localResult.sublocality_level_3 = addressComponent.short_name || "";
						break;
					case "sublocality_level_4":
						localResult.sublocality_level_4 = addressComponent.short_name || "";
						break;
					case "sublocality_level_5":
						localResult.sublocality_level_5 = addressComponent.short_name || "";
						break;
					case "neighborhood":
						localResult.neighborhood = addressComponent.short_name || "";
						break;
					case "premise":
						localResult.premise = addressComponent.short_name || "";
						break;
					case "subpremise":
						localResult.subpremise = addressComponent.short_name || "";
						break;
				} // end switch
			} // end loop through address components
			localResult.lat = geocodeResult.geometry.location.lat();
			localResult.lng = geocodeResult.geometry.location.lng();
			return localResult;
		}

		// fetches address from lat long
		function getAddressFromLatLng(latLng) {
			console.log("[getAddressFromLatLng]: Fetching address from lat long:");
			console.log(latLng)
			var deferred = $q.defer();
			that.geocoder.geocode({'location': latLng}, function(results, status) {
		    if (status === google.maps.GeocoderStatus.OK) {
		    	var result = parseGeocodeResults(results);
		      if (result) {
		        deferred.resolve(result);
		      } else {
		        deferred.reject("No reverse geocoding results found");
		      }
		    } else {
		      deferred.reject('Reverse geocoder failed due to: ' + status);
		    }
			});
			return deferred.promise;
		}

		this.removeMarker = function(marker) {
			console.log("[removeMarker]: removing marker from map");
			marker.setMap(null);
		};

		this.removeRoute = function() {
			console.log("[removeRoute]: removing route from map");
			that.directionsDisplay.setMap(null);
		};

		// drop a marker on given location and return the marker
		this.dropMarker = function(marker, location, markerChangedCallback) {
			console.log("[dropMarker]: dropping marker on location:");
			console.log(location);
			var latLng = {lat: location.lat, lng: location.lng};
			if(marker === null) {
				marker = new google.maps.Marker({
					position: latLng,
					map: that.map,
					draggable: true,
					animation: google.maps.Animation.DROP,
					label: location.locationName,
					title: location.locationName
				});
			}
			marker.setPosition(latLng);
			that.map.setCenter(latLng);
			marker.setMap(that.map);
			google.maps.event.addListener(marker, 'dragend', function(event){
		    console.log("[dropMarker]: marker dragged to location:");
		    console.log(event.latLng);
		    getAddressFromLatLng(event.latLng)
		    .then(function(result){
		    	markerChangedCallback(true, marker.getLabel(), result);
		    }, function(reason){
		    	markerChangedCallback(false, marker.getLabel());
		    })
			});
			return marker;
		};

		// draw a route from home to office
		this.drawRoute = function(fromMarker, toMarker) {
			console.log("[drawRoute]: drawing route from home to office");
			var deferred = $q.defer();
			if(fromMarker === null || toMarker === null) {
				deferred.reject("Atleast one marker not populated");
			} else {
				var request = {
					origin: fromMarker.getPosition(),
					destination: toMarker.getPosition(),
					travelMode: google.maps.TravelMode.DRIVING
				};
				that.directionsService.route(request, function(result, status) {
			  	if (status == google.maps.DirectionsStatus.OK) {
			      that.directionsDisplay.setDirections(result);
			      deferred.resolve(status);
			    } else {
			    	deferred.reject(status);
			    }
			  });
			}
		  return deferred.promise;
		}

		// search for autocomplete suggestions
		this.getAutocompleteSuggestions = function(searchText) {
			console.log("[getAutocompleteSuggestions]: Fetching autocomplete suggestions for: " + searchText);
			var deferred = $q.defer();
			that.autocompleteService.getPlacePredictions({ 
				input: searchText 
			}, function(predictions, status) {
				if (status != google.maps.places.PlacesServiceStatus.OK) {
		      deferred.reject(status);
		    }
				deferred.resolve(predictions);
			});
			return deferred.promise;
		};

		// get details from place id
		this.getDetailsFromPlaceId = function(placeId) {
			console.log("[getDetailsFromPlaceId]: Fetching place details from id: " + placeId);
			var deferred = $q.defer();
			that.placeService.getDetails({
				placeId: placeId
			}, function(place, status){
				if (status != google.maps.places.PlacesServiceStatus.OK) {
			    deferred.reject(status);
			  }
			  deferred.resolve(convertGeocodeResultToLocalResult(place));
			});
			return deferred.promise;
		};

		// center map on current location
		this.centerMapOnCurrentLocation = function() {
			console.log("[centerMapOnCurrentLocation]: centering map on current location")
			fetchCurrentLocation()
				.then(function(latLng){
					console.log("[centerMapOnCurrentLocation]: Successfully fetched current location");
					console.log(latLng)
					that.map.setCenter(latLng);
				}, function(status){
					console.log("[centerMapOnCurrentLocation]: Failed to center map - " + status);
				});
		};

		// get current location
		function fetchCurrentLocation() {
			console.log("[fetchCurrentLocation]: Fetching current location");
			var deferred = $q.defer();
			if(navigator.geolocation) {
		    navigator.geolocation.getCurrentPosition(function(position) {
		      currentLocationLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		      deferred.resolve(currentLocationLatLng);
		    }, function() {
		    	deferred.reject("Failed to get current location");
		    });
		  }
		  else {
		    deferred.reject("Browser doesn't support fetching the current location");
		  }
		  return deferred.promise;
		};

		that.centerMapOnCurrentLocation();

	}]);

})();