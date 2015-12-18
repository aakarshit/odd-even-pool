(function(){
	var app = angular.module("mapModule", []);

	app.service("mapService", ["$q", function($q){
		var that = this;

		this.map = {};
		this.geocoder = {};
		this.directionsService = {};
		this.directionsDisplay = {};
		this.markers = [];

		// takes in an array of results that the geocoding api returns
		// search for a result object that is an approximate location
		// extract components from the geocode result object and convert to a local result object
		function convertGeocodeResultToLocalResult(results) {
			var localResult = new MapResult();

			var geocodeResult = results[0];
			for (var i = 0; i < results.length; ++i) {
				if(results[i].geometry.location_type === "APPROXIMATE") {
					geocodeResult = results[i];
					break;
				}
			}

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

			console.log(localResult);

			return localResult;
		}

		// fetches address from lat long
		function getAddressFromLatLng(latLng) {
			var deferred = $q.defer();
			that.geocoder.geocode({'location': latLng}, function(results, status) {
		    if (status === google.maps.GeocoderStatus.OK) {
		    	var result = convertGeocodeResultToLocalResult(results);
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

		// fetches lat long from address
		function getLatLngFromAddress(address) {
			var deferred = $q.defer();
			that.geocoder.geocode({'address': address}, function(results, status) {
		    if (status === google.maps.GeocoderStatus.OK) {
		    	var result = convertGeocodeResultToLocalResult(results);
		      if (result) {
		        deferred.resolve(result);
		      } else {
		        deferred.reject("No geocoding results found");
		      }
		    } else {
		      deferred.reject('Geocoder failed due to: ' + status);
		    }
			});
			return deferred.promise;
		}

		// if both markers have been placed, draw route
		// else noop
		function tryDrawRoute() {
			if(that.markers["Home"] && that.markers["Office"]) {
				console.log("drawing route from home to office");
				var request = {
					origin: that.markers["Home"].getPosition(),
					destination: that.markers["Office"].getPosition(),
					travelMode: google.maps.TravelMode.DRIVING
				};
				that.directionsService.route(request, function(result, status) {
			  	if (status == google.maps.DirectionsStatus.OK) {
			      that.directionsDisplay.setDirections(result);
			    }
			  });
			}
		}

		// get lat long from address
		// create/place existing marker on location and center map
		// set the locationUpdate callback as handler for marker's dragend event
		this.searchAddress = function(address, locationName, locationUpdateCallback) {
			var deferred = $q.defer();

			getLatLngFromAddress(address)
			.then(function(result){

				var latLng = {lat: result.lat, lng: result.lng}

				console.log(latLng);

      	// center the map
      	that.map.setCenter(latLng);

      	// place a marker on location
      	var marker = {};
      	if(that.markers[locationName]) {
      		marker = that.markers[locationName];
      		marker.setPosition(latLng);
      	} else {
					marker = new google.maps.Marker({
				    position: latLng,
				    map: that.map,
				    title: locationName,
				    draggable: true,
						animation: google.maps.Animation.DROP,
						label: locationName
				  });
				  // register callback for marker's dragend event
				  google.maps.event.addListener(marker, 'dragend', function(event){
				    console.log(event.latLng);
				    getAddressFromLatLng(event.latLng)
				    .then(function(result){
				    	tryDrawRoute();
				    	locationUpdateCallback({status: true, result: result});
				    }, function(reason){
				    	locationUpdateCallback({status: false});
				    })
					});
				  that.markers[locationName] = marker;
      	}
			  marker.setMap(that.map);
			  tryDrawRoute();

			  // return status
			  deferred.resolve(result);

			}, function(reason){
				// failed to search address
	    	deferred.reject("Failed to search address");
			});

			return deferred.promise;
		};

		// gets the user's current location in latlong
		// create/place existing marker on the location and center map on it
		// set the locationUpdate callback as handler for marker's dragend event
		// return the address from lat long
		this.getCurrentLocation = function(locationName, locationUpdateCallback) {
			var deferred = $q.defer();

			// if the browser supports geolocation
			if(navigator.geolocation) {

				// get the user location in lat long
		    navigator.geolocation.getCurrentPosition(function(position) {
		      latLng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

		      // get address from lat long
		      getAddressFromLatLng(latLng)
		      .then(function(result){

		      	var address = result.formatted_address;
		      	
		      	console.log(address);

		      	// center the map
		      	that.map.setCenter(latLng);

		      	// send fetched address to caller
		      	deferred.resolve(result);

		      	// place a marker on location
		      	var marker = {};
		      	if(that.markers[locationName]) {
		      		marker = that.markers[locationName];
		      		marker.setPosition(latLng);
		      	} else {
							marker = new google.maps.Marker({
						    position: latLng,
						    map: that.map,
						    title: locationName,
						    draggable: true,
								animation: google.maps.Animation.DROP,
								label: locationName
						  });
						  // register callback for marker's dragend event
						  google.maps.event.addListener(marker, 'dragend', function(event){
						    console.log(event.latLng);
						    getAddressFromLatLng(event.latLng)
						    .then(function(result){
						    	tryDrawRoute();
						    	locationUpdateCallback({status: true, result: result});
						    }, function(reason){
						    	locationUpdateCallback({status: false});
						    })
							});
						  that.markers[locationName] = marker;
		      	}
					  marker.setMap(that.map);
					  tryDrawRoute();

		      }, function(reason){
		      	// failed to reverse geocode
						console.log(reason);
						deferred.reject(reason);
		      });

		    }, function() {
		    	// failed to get user's current location
		    	deferred.reject("Failed to get current location");
		    });
		  }
		  else {
		  	// browser doesn't support fetching user's location
		    deferred.reject("Browser doesn't support fetching the current location");
		  }

		  return deferred.promise;
		};


		// intiialize
		(function() {

			// init the map
			that.map = new google.maps.Map(document.getElementById('map-canvas'), {
				center: new google.maps.LatLng(28.6100, 77.2300),
		    zoom: 12
			});
			that.geocoder = new google.maps.Geocoder;
			that.directionsService = new google.maps.DirectionsService();
			that.directionsDisplay = new google.maps.DirectionsRenderer({
				markerOptions: {
					visible: false
				}
			});
			that.directionsDisplay.setMap(that.map);
		})();




	}]);

})();