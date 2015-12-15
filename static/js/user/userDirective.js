(function(){
	var app = angular.module("userModule");

	app.directive("newUser", ["userService", "$mdDialog", function(userService, $mdDialog){
		return {
			restrict: 'AE',
			templateUrl: 'static/views/new-user.html',
			controller: function(){
				var that = this;

				this.expanded = true;
				this.user = userService.user;

				this.AddNewUser = function() {
					if(!newUserForm.$valid) {
						return;
					}

					console.log("Adding new user");

					// post call to add this entry to the database

					// todo: add this to the callback of the post call
					// show confirmation dialog
					$mdDialog.show($mdDialog.alert()
						.clickOutsideToClose(true)
						.title("Submission Confirmation")
						.textContent("Thank you for your submission, we will get back to you at " + that.user.mobileOrEmail + " as soon as we find a match.")
						.ariaLabel("Submission Confirmation Dialog")
						.ok("Okay")
						);

				};

				this.setHomeToCurrentLocation = function() {
					userService.setHomeToCurrentLocation();
				};

				this.setOfficeToCurrentLocation = function() {
					userService.setOfficeToCurrentLocation();
				};

				this.searchHomeAddress = function() {
					userService.searchHomeAddress();					
				};

				this.searchOfficeAddress = function() {
					userService.searchOfficeAddress();					
				};

			},
			controllerAs: 'NewUserController'
		};	
	}]);

})();