'use strict';

// Declare app level module which depends on filters, and services

angular.module('ngEmailv2', [
	'ui.router',
	'ngSanitize',
	'ngEmailv2.controllers',
	'ngEmailv2.services',
	'ngEmailv2.directives',
  'ngEmailv2.filters'
]).

config(function ($urlRouterProvider, $locationProvider, $stateProvider) {

  // For any unmatched url, redirect to /
  $urlRouterProvider.otherwise("/");

  $locationProvider.html5Mode(true);

  $stateProvider
    .state('home', {
        url: '/',
        templateUrl: 'partials/home',
        controller: 'HomeController'
    })
    .state('settings', {
        url: '/settings',
        templateUrl: 'partials/settings',
        controller: 'SettingsController'
    })

});
