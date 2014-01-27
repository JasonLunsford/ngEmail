
angular.module('myApp.directives', []).
	directive('emailListing', [function() {
		return {
			restrict: 'EA',
			replace: false,
			scope: {
				email: '=', // accept an object as parameter, making the email object available to this isolate scope
				action: '&', // accept a function as a parameter
				shouldUseGravater: '@' // accept a string as a parameter
			},
			templateUrl: 'partials/emailListing.html',
			controller: ['$scope', '$element', '$attrs', '$transclude',
				function($scope, $element, $attrs, $transclude) {
					
					/* think of handleClick as an extension of the function declared in the root scope (setSelectedMail), available in each isolate scope attached to the
					   individual mail items. */
					$scope.handleClick = function() {
						//referencing action attribute (setSelectedMail) specified in View, passing object BACK to parent for processing
						$scope.action({selectedMail: $scope.email});
					};
					
				}
			]
		}
	}]);
