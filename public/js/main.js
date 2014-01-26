'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
	'ngRoute',
	'ngSanitize',
	'myApp.controllers',
	'myApp.services'
]).

config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/home',
      controller: 'HomeController'
    }).
    when('/settings', {
      templateUrl: 'partials/settings',
      controller: 'SettingsController'
    }).
    otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
});
