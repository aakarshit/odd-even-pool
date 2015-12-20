(function(){
	var app = angular.module("userModule");

	app.directive("newUser", ["userService", "$mdDialog", "$http", function(userService, $mdDialog, $http){
		return {
			restrict: 'AE',
			templateUrl: 'static/views/new-user.html',
			controller: function(){
				var that = this;

				this.expanded = true;
				this.user = userService.user;
				this.searchingHome = false;
				this.searchingOffice = false;

				function searchCompleted(location) {
					if(location === "Home") {
						that.searchingHome = false;
					} else if(location === "Office") {
						that.searchingOffice = false;
					}
				}

				this.AddNewUser = function() {
					console.log("Adding new user");

					if(!newUserForm.$valid && newUserForm.$error) {
						console.log("form not valid");
						console.log(newUserForm.$error);
						return;
					}

					// post call to add this entry to the database
					$http.post('/api',{ user: that.user })
						.then(function(response){
							// success
							console.log(response);

							$mdDialog.show($mdDialog.alert()
								.clickOutsideToClose(true)
								.title("Submission Confirmation")
								.textContent("Thank you for your submission, we will get back to you at " 
									+ that.user.mobileOrEmail + " as soon as we find a match.")
								.ariaLabel("Submission Confirmation Dialog")
								.ok("Okay")
								);
						}, function(response){
							// failure
							console.log("Failed to submit data");
							console.log(response);
						});

					// todo: add this to the callback of the post call
					// show confirmation dialog
					

				};

				this.setHomeToCurrentLocation = function() {
					that.searchingHome = true;
					userService.setHomeToCurrentLocation(searchCompleted);
				};

				this.setOfficeToCurrentLocation = function() {
					that.searchingOffice = true;
					userService.setOfficeToCurrentLocation(searchCompleted);
				};

				this.searchHomeAddress = function() {
					that.searchingHome = true;
					userService.searchHomeAddress(searchCompleted);
				};

				this.searchOfficeAddress = function() {
					that.searchingOffice = true;
					userService.searchOfficeAddress(searchCompleted);
				};

				that.setHomeToCurrentLocation();

			},
			controllerAs: 'NewUserController'
		};	
	}]);

})();