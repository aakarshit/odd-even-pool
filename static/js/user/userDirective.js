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

				this.AddNewUser = function() {
					console.log("Adding new user");

					// if(!newUserForm.$valid) {
					// 	console.log("form not valid");
					// 	console.log(newUserForm.$error);
					// 	return;
					// }

					

					// post call to add this entry to the database
					$http.post('/api',{ user: that.user })
						.then(function(response){
							// success
							console.log(response.data);

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