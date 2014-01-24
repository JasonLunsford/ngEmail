'use strict';

angular.module('myApp.controllers', []).
	controller('HomeController', function ($scope) {


	}).
	controller('MailListingController', function ($scope, $http) {
		$scope.email = []

		$http({
			method:"GET",
			url:"/api/mail"
		})
		.success(function(data, status, headers) {
			
		})
		.error(function(data, status, headers) {
			
		});
	}).
	controller('ContentController', function ($scope) {


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
