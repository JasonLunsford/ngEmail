'use strict';

angular.module('myApp.controllers', []).
	controller('HomeController', ['$scope', '$sce', function ($scope, $sce) {
		$scope.selectedMail = "";
		
		/* called from home.html, typically handled by MailListingController, but works here
		   because Angular "walk ups" the controller heirarchy when / if it fails to find
		   the $scope property or method it was looking for in the child-most controller */
		$scope.setSelectedMail = function(mail) {
			$scope.selectedMail = mail;
			/* check if the body field is an array - if so, activate Strict Contextual Escaping (SCE) to allow
			   HTML character rendering - otherwise, carry on cuz SCE has already been assigned */
			if( Object.prototype.toString.call( $scope.selectedMail.body ) === '[object Array]' ) {
				$scope.selectedMail.body = $sce.trustAsHtml($scope.selectedMail.body.join(","));
			}
		};
		
		// also called from home.html view
		$scope.isSelected = function(mail) {
			if ($scope.selectedMail) {
				return $scope.selectedMail === mail;
			}
		};

	}]).
	controller('MailListingController', ['$scope', 'mailService', function ($scope, mailService) {
		$scope.email = []
		$scope.nYearsAgo = 11; // establishes baseline years for custom age filter

		mailService.getMail()
		.success(function(data, status, headers) {
			$scope.email = data.all;
		})
		.error(function(data, status, headers) {
			
		});
		
		// filter function - each loop item processed thru this function. if output truthy, item is rendered to screen
		$scope.searchPastNYears = function(email) {
			var emailSentAtDate = new Date(email.sent_at),
				nYearsAgoDate = new Date();
				
			nYearsAgoDate.setFullYear(nYearsAgoDate.getFullYear() - $scope.nYearsAgo);
			return emailSentAtDate > nYearsAgoDate;
		}
	}]).
	controller('ContentController', ['$scope', '$rootScope', 'mailService', function ($scope, $rootScope, mailService) {
		$scope.showingReply = false;
		$scope.reply = {};
		
		$scope.toggleReplyForm = function() {
			$scope.showingReply = !$scope.showingReply;
			$scope.reply = {};
			$scope.reply.to = $scope.selectedMail.from.join(", ");
			$scope.reply.body = "\n\n ---------------------------- \n\n" + $scope.selectedMail.body;
		};
		
		$scope.sendReply = function() {
			$scope.showingReply = false;
			$rootScope.loading = true;
			
			mailService.sendEmail($scope.reply)
			.then(function(status) {
				$rootScope.loading = false;
			}, function(err) {
				$rootScope.loading = false;
			});	
		};
		
		/*  hook into the watch list functionality by using $watch - when watched events are
			detected an angular event digest loop is triggered, in this case setting $scope.showingReply
			back to false and resetting the $scope.reply object */
		$scope.$watch('selectedMail', function(evt) {
			$scope.showingReply = false; // hide reply form
			$scope.reply = {}; 			 // reset reply object
		});

	}]).
	controller('SettingsController', ['$scope', function ($scope) {
		$scope.settings = {
			name:'Jason',
			email:'noway@jose.com',
			age:38
		}
				
		$scope.updateSettings = function() {
			console.log("updateSettings was called.");
		}

	}]);
