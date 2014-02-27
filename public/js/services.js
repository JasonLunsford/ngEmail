'use strict';

angular.module('ngEmailv2.services', []).
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
	}]).
	factory('pageTitleService', [function() {
		var internalTitle;

		var setMyTitle = function(title) {
			internalTitle = title;
		}

		var getMyTitle = function() {
			return internalTitle;
		}

		return {
			setMyTitle:setMyTitle,
			getMyTitle:getMyTitle
		}

	}]);
