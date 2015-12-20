(function(){
	var app = angular.module("userModule", []);

	app.service("userService", ["mapService", function(mapService){
		var that = this;
		var shiftTimings = [
			"12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM",
			"6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM",
			"12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM",
			"6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"
		];

		this.user = {};
		this.user.home = new MapResult();
		this.user.office = new MapResult();
		this.user.mobileOrEmail = "";
		this.user.carNumberType = "even";
		this.user.shiftStartTimes = shiftTimings;
		this.user.shiftStartTime = that.user.shiftStartTimes[8];
		this.user.shiftStopTimes = shiftTimings;
		this.user.shiftStopTime = that.user.shiftStopTimes[16];

		this.setHomeToCurrentLocation = function() {
			mapService.getCurrentLocation("Home", homeLocationUpdated)
			.then(function(result){
				console.log(result);
				that.user.home = result;
			}, function(reason){
				console.log(reason);
			});
		};

		this.setOfficeToCurrentLocation = function() {
			mapService.getCurrentLocation("Office", officeLocationUpdated)
			.then(function(result){
				console.log(result);
				that.user.office = result;
			}, function(reason){
				console.log(reason);
			});
		};

		this.searchHomeAddress = function() {
			mapService.searchAddress(that.user.home.formatted_address, "Home", homeLocationUpdated)
			.then(function(result){
				console.log("Search successful for home address");
				that.user.home = result;
			}, function(reason){
				console.log(reason);
			});
		};

		this.searchOfficeAddress = function() {
			mapService.searchAddress(that.user.office.formatted_address, "Office", officeLocationUpdated)
			.then(function(result){
				console.log("Search successful for office address");
				that.user.office = result;
			}, function(reason){
				console.log(reason);
			});
		};


		function homeLocationUpdated(response) {
			if(response.status === false) {
				console.log("Failed to fetch address from marker, try dragging marker again");
				return;
			}
			console.log("Home address updated to: " + response.result.formatted_address);
			that.user.home = response.result;
		}

		function officeLocationUpdated(response) {
			if(response.status === false) {
				console.log("Failed to fetch address from marker, try dragging marker again");
				return;
			}
			console.log("Office address updated to: " + response.result.formatted_address);
			that.user.office = response.result;
		}

		that.setHomeToCurrentLocation();


	}]);

})();