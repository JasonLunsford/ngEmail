'use strict';

angular.module('myApp.services', []).
	factory('mailService', ['$http', '$q', function($http, $q) {
		var getMail = function() {
			return $http({ method:'GET', url:'/api/mail'})
		};
		
		var sendEmail = function(mail) {
			var d = $q.defer();
			$http({
				method:'POST',
				data:mail,
				url:'/api/send'
			}).success(function(data, status, header) {
				d.resolve(data);
			}).error(function(data, status, headers) {
				d.reject(data);
			});
			
			return d.promise;
		};
		
		return {
			getMail:getMail,
			sendEmail:sendEmail
		}
	}]);
