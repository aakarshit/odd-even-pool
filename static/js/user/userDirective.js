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

							// show submission confirmation dialog
							$mdDialog.show({
					      controller: ["$scope", "$mdDialog", "mobileOrEmail", function($scope, $mdDialog, mobileOrEmail) {
					      	$scope.mobileOrEmail = mobileOrEmail;
								  $scope.hide = function() {
								    $mdDialog.hide();
								  };
					      }],
					      templateUrl: 'static/views/submit-confirm.html',
					      parent: angular.element(document.body),
					      clickOutsideToClose:true,
					      locals: {
					      	mobileOrEmail: that.user.mobileOrEmail
					      }
					    });

						}, function(response){
							// failure
							console.log("Failed to submit data");
							console.log(response);
						});

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