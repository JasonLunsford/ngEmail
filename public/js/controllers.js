'use strict';

angular.module('myApp.controllers', []).
	controller('HomeController', function ($scope) {


	}).
	controller('SettingsController', function ($scope) {
		$scope.settings = {
			name:"Jason",
			email:"noway@jose.com",
			age:38
		}
				
		$scope.updateSettings = function() {
			console.log("updateSettings was called.");
		}

	});
