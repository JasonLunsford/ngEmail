'use strict';

angular.module('myApp.controllers', []).
	controller('HomeController', ['$scope', '$sce', 'keyboardService', function ($scope, $sce, keyboardService) {
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

		// pick up signal from the MailListingController child scope, reset selectedMail object and call the isSelected method, which closes
		// the former email View (since it was deleted - duh!)
		$scope.$on('emailHasBeenDeleted', function() {
			$scope.selectedMail = "";
			$scope.isSelected();
		})

	}]).
	controller('MailListingController', ['$scope', 'mailService', function ($scope, mailService) {
		$scope.email = {};
		$scope.emailCollect = {};

		// call the mailSerice service, via promise, to collect our email from the server
		mailService.getMail()
		.success(function(data, status, headers) {
			$scope.email = data;
		})
		.error(function(data, status, headers) { });

		// receive object with our checkbox info from directive and manipulate the $scope.emailCollect hash accordingly
		$scope.updateCheckedEmail = function(checkedEmail) {
			var thisID = checkedEmail.checkID;
			
			if ( $scope.emailCollect[thisID] ) {
				delete $scope.emailCollect[thisID];
			} else {
				$scope.emailCollect[thisID] = true;
			}

		}

		// spin thru the $scope.emailCollect hash table and delete any matching objects found within from the $scope.email hash table
		// aka associative array, aka Object, aka not an object extended from the Array.prototype.
		// This works because with Objects delete is the correct way to remove members, wherein Arrays prefer arr.splice.
		$scope.deleteCheckedEmail = function() {
			var cleanHashTable = false;

			for (var i in $scope.emailCollect) {
				// use hasOwnProperty to filter out keys from the Object.prototype
				if ( $scope.emailCollect.hasOwnProperty(i) ) {
					cleanHashTable = true;
					delete $scope.email[i];
					delete $scope.emailCollect[i];
				}
			}

			if ( cleanHashTable ) {
				$scope.$emit("emailHasBeenDeleted");
			}
		};

		// spin thru the $scope.email hash table and populate the emailCollect with all the ID goodness it can hold.
		// or clear entries already in $scope.emailCollect
		$scope.selectAllBtn = true;
		$scope.selectAllEmails = function() {

			if ( $scope.selectAllBtn ) {
				for (var i in $scope.email) {
					if ( $scope.email.hasOwnProperty(i) ) {
						$scope.emailCollect[i] = true;
					}
				}
			} else {
				for (var i in $scope.emailCollect) {
					// use hasOwnProperty to filter out keys from the Object.prototype
					if ( $scope.emailCollect.hasOwnProperty(i) ) {
						delete $scope.emailCollect[i];
					}
				}
			}

			// toggle the select / unselect all flag
			$scope.selectAllBtn = $scope.selectAllBtn === false ? true: false;
		}

		// clean up emailCollect after Mark As Unread clicked to prevent unintended email deletes - yay good housekeeping
		$scope.showUnreadEmails = function() {
			for (var i in $scope.emailCollect) {
				// use hasOwnProperty to filter out keys from the Object.prototype
				if ( $scope.emailCollect.hasOwnProperty(i) ) {
					delete $scope.emailCollect[i];
				}
			}

			// reset back to true to keep UI consistent
			$scope.selectAllBtn = true;
		}

	}]).
	controller('ContentController', ['$scope', '$rootScope', 'mailService', function ($scope, $rootScope, mailService) {
		$scope.showingReply = false;
		$scope.reply = {};
		
		$scope.toggleReply = function() {
			$scope.showingReply = !$scope.showingReply;
			$scope.reply = {};
			$scope.reply.to = $scope.selectedMail.from.join(", ");
			$scope.reply.body = "\n\n ---------------------------- \n\n" + $scope.selectedMail.body;
		};

		$scope.toggleReplyAll = function() {
			$scope.showingReply = !$scope.showingReply;
			$scope.reply = {};
			$scope.reply.to = $scope.selectedMail.from.join(", ");
			$scope.reply.body = "\n\n ---------------------------- \n\n" + $scope.selectedMail.body;
		};

		$scope.toggleForward = function() {
			$scope.showingReply = !$scope.showingReply;
			$scope.reply = {};
			$scope.reply.to = $scope.selectedMail.from.join(", ");
			$scope.reply.body = "\n\n ---------------------------- \n\n" + $scope.selectedMail.body;
		};

		$scope.downloadAttachment = function() {
			console.log( "Download Attachment clicked." );
		};
		
		$scope.sendReply = function() {
			console.log("Sending reply.");
			$scope.showingReply = false;
			$rootScope.loading = true;
			
			mailService.sendEmail($scope.reply)
			.then(function(status) {
				$rootScope.loading = false;
			}, function(err) {
				$rootScope.loading = false;
			});	
		};

		$scope.attachFile = function() {
			console.log( "Attach File clicked." );
		}
		
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
