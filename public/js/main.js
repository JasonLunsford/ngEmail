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

    // let's normalize the capitalization if the user went all cap/some cap on us
  $urlRouterProvider
    .rule(function ($injector, $location) {
      var path = $location.path();
      var normalized = path.toLowerCase();

      if (path != normalized) {
        $location.replace().path(normalized);
      }
    })
    .otherwise("/404");

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
    .state('404', {
        url: '{path:.*}',
        templateUrl: 'partials/404'
    });

  $locationProvider.html5Mode(true);

});
