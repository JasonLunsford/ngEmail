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
	}]).
	// may decide to make this a directive instead, stay tuned
	factory('keyboardService', ['$rootScope', function($rootScope) {
		var watches = [];
		var onKeyPress = function(key) {
			for ( var i = watches.length - 1; i >= 0; i-- ) {
				watches[i](key);
			};
		};
  
		document.addEventListener('keypress', onKeyPress);
  
		return {
			setGlobalKey: function(key, f) {
				watches.push(function(evt) {
					if (evt.ctrlKey && evt.which == key) { f(evt); }
				});
			}
		}
	}]);
