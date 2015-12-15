(function(){
	var app = angular.module("userModule", []);

	app.service("userService", ["mapService", function(mapService){
		var that = this;

		this.user = {};
		this.user.homeAddress = "";
		this.user.officeAddress = "";
		this.user.mobileOrEmail = "";
		this.user.carNumberType = "even";
		this.user.shiftStartTimes = ["8 AM", "2 PM", "8 PM", "2 AM"];
		this.user.shiftStartTime = that.user.shiftStartTimes[0];
		this.user.shiftStopTimes = ["4 PM", "10 PM", "4 AM", "10 AM"];
		this.user.shiftStopTime = that.user.shiftStopTimes[0];

		this.setHomeToCurrentLocation = function() {
			mapService.getCurrentLocation("Home", homeLocationUpdated)
			.then(function(currentLocation){
				console.log(currentLocation);
				that.user.homeAddress = currentLocation.address;
			}, function(reason){
				console.log(reason);
			});
		};

		this.setOfficeToCurrentLocation = function() {
			mapService.getCurrentLocation("Office", officeLocationUpdated)
			.then(function(currentLocation){
				console.log(currentLocation);
				that.user.officeAddress = currentLocation.address;
			}, function(reason){
				console.log(reason);
			});
		};

		this.searchHomeAddress = function() {
			mapService.searchAddress(that.user.homeAddress, "Home", homeLocationUpdated)
			.then(function(){
				console.log("Search successful for home address");
			}, function(reason){
				console.log(reason);
			});
		};

		this.searchOfficeAddress = function() {
			mapService.searchAddress(that.user.officeAddress, "Office", officeLocationUpdated)
			.then(function(){
				console.log("Search successful for office address");
			}, function(reason){
				console.log(reason);
			});
		};


		function homeLocationUpdated(result) {
			if(result.status === false) {
				console.log("Failed to fetch address from marker, try dragging marker again");
				return;
			}
			console.log("Home address updated to: " + result.address);
			that.user.homeAddress = result.address;
		}

		function officeLocationUpdated(result) {
			if(result.status === false) {
				console.log("Failed to fetch address from marker, try dragging marker again");
				return;
			}
			console.log("Office address updated to: " + result.address);
			that.user.officeAddress = result.address;
		}

		//that.setHomeToCurrentLocation();


	}]);

})();