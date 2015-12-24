(function(){
	var app = angular.module("userModule", []);

	app.service("userService", ["mapService", "$http", "$q", function(mapService, $http, $q){
		var that = this;
		var shiftTimings = [
			"12:00 AM", "12:30 AM", "1:00 AM", "1:30 AM", "2:00 AM", "2:30 AM",
			"3:00 AM", "3:30 AM", "4:00 AM", "4:30 AM", "5:00 AM", "5:30 AM",
			"6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", 
			"9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
			"12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
			"3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
			"6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM",
			"9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM"
		];

		this.user = {};
		this.user.address = {};
		this.user.address.home = "";
		this.user.address.office = "";
		this.user.marker = {};
		this.user.marker.home = null;
		this.user.marker.office = null;
		this.user.home = new MapResult('Home');
		this.user.office = new MapResult('Office');
		this.user.mobileOrEmail = "";
		this.user.carNumberType = "even";
		this.user.shiftStartTimes = shiftTimings;
		this.user.shiftStartTime = that.user.shiftStartTimes[16];
		this.user.shiftStopTimes = shiftTimings;
		this.user.shiftStopTime = that.user.shiftStopTimes[33];

		this.addressAutocomplete = {};
		this.addressAutocomplete.home = {};
		this.addressAutocomplete.home.selectedItem = null;
		this.addressAutocomplete.home.autocompleteSuggestions = [];
		this.addressAutocomplete.office = {};
		this.addressAutocomplete.office.selectedItem = null;
		this.addressAutocomplete.office.autocompleteSuggestions = [];

		

		function markerChanged(status, locationName, result) {
			if(status === true) {
				console.log("[markerChanged]: Successfully handled marker dragend event");
				var location = locationName.toLowerCase();
				var userLocation = that.user[location];
				for(var key in userLocation) { 
					if(result[key]) {
						userLocation[key] = result[key];
					} else {
						if(key !== 'locationName')
							userLocation[key] = "";
					}
				};
				that.user.address[location] = userLocation.formatted_address;
				if(that.user.marker.home && that.user.marker.office) {
					mapService.drawRoute(that.user.marker.home, that.user.marker.office)
						.then(function(status){
						console.log("[markerChanged]: Successfully drawn route from home to office - " + status);
					}, function(status){
						console.log("[markerChanged]: Failed to draw route - " + status);
					});
				}
			} else {
				console.log("[markerChanged]: Failed to handle marker dragend event")
			}
		}

		function createBackendData() {
			console.log("[createBackendData]: Creating backend data");
			return {
				user: {
					mobileOrEmail: that.user.mobileOrEmail,
					carNumberType: that.user.carNumberType,
					shiftStartTime: that.user.shiftStartTime,
					shiftStopTime: that.user.shiftStopTime,
					home: that.user.home,
					office: that.user.office
				}
			};
		}


		// populate autocomplete suggestions
		this.populateAutocompleteSuggestions = function(location) {
			var address = that.user.address[location];
			if(address === '') { return; }
			var autocompleteSuggestions = that.addressAutocomplete[location].autocompleteSuggestions;
			mapService.getAutocompleteSuggestions(address)
				.then(function(results){
					console.log("[populateAutocompleteSuggestions]: Successfully fetched autocomplete suggestions");
					console.log(results);
					autocompleteSuggestions.length = 0;
					autocompleteSuggestions.push.apply(autocompleteSuggestions, results);
				}, function(status){
					console.log("[populateAutocompleteSuggestions]: Failed to get autocomplete suggestions");
				});
		};

		// fetch place details given a place id
		this.processAutocompleteItemSelected = function(location) {
			var placeId = that.addressAutocomplete[location].selectedItem.place_id;
			var userLocation = that.user[location];
			mapService.getDetailsFromPlaceId(placeId)
				.then(function(result) {
						console.log("[processAutocompleteItemSelected]: Fetched details from place id:");
						console.log(result);
						for(var key in userLocation) { 
							if(result[key]) {
								userLocation[key] = result[key];
							} else {
								if(key !== 'locationName')
									userLocation[key] = "";
							}
						};
						return mapService.dropMarker(that.user.marker[location], {
								lat: userLocation.lat,
								lng: userLocation.lng,
								locationName: userLocation.locationName
							}, markerChanged);
					}, function(status) {
						console.log("[processAutocompleteItemSelected]: Failed to fetch place details from place id- " + status);
					})
				.then(function(marker){
						console.log("[processAutocompleteItemSelected]: Successfully created marker");
						console.log(marker);
						that.user.marker[location] = marker;
						return mapService.drawRoute(that.user.marker.home, that.user.marker.office);
					}, function(status){
						console.log("[processAutocompleteItemSelected]: Failed to create marker - " + status);
					})
				.then(function(status){
						console.log("[processAutocompleteItemSelected]: Successfully drawn route from home to office - " + status);
					}, function(status){
						console.log("[processAutocompleteItemSelected]: Failed to draw route - " + status);
					});
		};

		

		this.addUserToBackend = function() {
			var deferred = $q.defer();
			console.log("[addUserToBackend]: Adding user to backend");
			$http.post('/api', createBackendData())
				.then(function(response){
					console.log("[addUserToBackend]: Success - " + response);
					deferred.resolve(response);
				}, function(response){
					deferred.reject("Failed to submit data to backend");
				});
			return deferred.promise;
		};


		this.resetData = function() {
			that.user.address.home = "";
			mapService.removeMarker(that.user.marker.home);
			that.user.marker.home = null;
			that.user.home = null;

			that.user.address.office = "";
			mapService.removeMarker(that.user.marker.office);
			that.user.marker.office = null;
			that.user.office = null;

			that.user.mobileOrEmail = "";
			that.user.carNumberType = "even";
			that.user.shiftStartTime = that.user.shiftStartTimes[16];
			that.user.shiftStopTime = that.user.shiftStopTimes[33];

			mapService.removeRoute();
		};



	}]);

})();