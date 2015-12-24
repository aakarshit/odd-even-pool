(function(){
	var app = angular.module("userModule");

	// app.directive("autocompleteChange", ["$timeout", "userService", function($timeout, userService) {
	// 	return {
	// 		link: function(scope, element, attrs) {
	// 			$timeout(function(){
	// 				// element.find("#home-address").bind("input", function() {
	// 				// 	console.log("[autocompleteChange]: Home address changed");
	// 				// 	userService.populateAutocompleteSuggestions('home');
	// 				// });
	// 				// element.find("#office-address").bind("input", function() {
	// 				// 	console.log("[autocompleteChange]: Office address changed");
	// 				// 	userService.populateAutocompleteSuggestions('office');
	// 				// });
	// 			}, 0);
	// 		}
	// 	}
	// }]);

	app.directive("newUser", ["userService", "$mdDialog", function(userService, $mdDialog){
		return {
			restrict: 'AE',
			templateUrl: 'static/views/new-user.html',
			controller: function(){

				var that = this;
				this.expanded = true;
				this.user = userService.user;
				this.addressAutocomplete = userService.addressAutocomplete;

				// submit form
				this.submitForm = function() {
					if(!newUserForm.$valid && newUserForm.$error) {
						console.log("[submitForm]: Form not valid");
						console.log(newUserForm.$error);
						return;
					}
					userService.addUserToBackend()
						.then(function(response){
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
					    userService.resetData();
						}, function(response){
							console.log("[submitForm]: Failed to submit form - " + response);
						});

					// clear the form

				};

				// this.dropMarkerClicked = function(location) {
				// 	console.log("[dropMarkerClicked]: dropped marker on location: " + location);
				// };

				// handler for when an address is changed
				this.addressChanged = function(location) {
					console.log("[addressChanged]: " + location + " address changed");
					userService.populateAutocompleteSuggestions(location);	
				};

				// handler for when an autocomplete suggestion is selected
				this.addressSelected = function(location) {
					console.log("[addressSelected]: " + location + " autocomplete address selected");
					userService.processAutocompleteItemSelected(location);	
				};

			},
			controllerAs: 'NewUserController'
		};	
	}]);

})();