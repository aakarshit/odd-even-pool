(function(){
	var app = angular.module("userModule", []);

	app.service("userService", ["mapService", function(mapService){
		var that = this;

		this.user = {};
		this.user.home = new MapResult();
		this.user.office = new MapResult();
		this.user.mobileOrEmail = "";
		this.user.carNumberType = "even";
		this.user.shiftStartTimes = ["8 AM", "2 PM", "8 PM", "2 AM"];
		this.user.shiftStartTime = that.user.shiftStartTimes[0];
		this.user.shiftStopTimes = ["4 PM", "10 PM", "4 AM", "10 AM"];
		this.user.shiftStopTime = that.user.shiftStopTimes[0];

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

		//that.setHomeToCurrentLocation();


	}]);

})();