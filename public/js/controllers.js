'use strict';

angular.module('ngEmailv2.controllers', []).
	controller('HomeController', ['$scope', '$sce', 'pageTitleService', function ($scope, $sce, pageTitleService) {
		$scope.selectedMail = "";

		// When app first opens point to the Inbox
		pageTitleService.setMyTitle("Inbox");
		$scope.currentPageTitle = pageTitleService.getMyTitle();
		
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

		$scope.$on('pageTitleChanged', function() {
			$scope.currentPageTitle = pageTitleService.getMyTitle();
		})

	}]).
	controller('MailListingController', ['$scope', 'mailService', 'pageTitleService', function ($scope, mailService, pageTitleService) {
		/* object controlling visibility of mailbox controls - loosely coupled to the mailbox, but should be flexible in cases where multiple
		   mailboxes will need to share the same control (like everybody showing "Delete" except for Inbox)
		   if inbox true, show Mark Unread.
		   if trash false, show Recycle, otherwise show Delete
		*/
		$scope.mailboxOpts = { inboxSet:true, trashSet:false, junkSet:false};

		// initialize a mailbox flag array to keep track of which mailbox we are on, allows decoupling from the name displayed in the view
		$scope.mailbox = { inbox:true, sent:false, junk:false, trash:false }

		// initialize the various objects we'll be using
		$scope.email = {};
		$scope.inbox = {};
		$scope.sent = {};
		$scope.junk = {};
		$scope.trash = {};
		$scope.emailCollect = {};

		// call the mailSerice service, via promise, to collect our email from the server
		mailService.getMail()
		.success(function(data, status, headers) {
			$scope.email = data;
			$scope.inbox = data;
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

					// check flag state of each mailbox, act accordingly
					if ( $scope.mailbox.inbox ) {
						$scope.trash[i] = $scope.inbox[i];
						delete $scope.inbox[i];
					} else if ( $scope.mailbox.sent ) {
						delete $scope.sent[i];
					} else if ( $scope.mailbox.junk ) {
						delete $scope.junk[i];
					} else if ( $scope.mailbox.trash ) {
						delete $scope.trash[i];
					} else {
						console.log("Unknown mailbox type or typo somewhere.");
					}
					delete $scope.emailCollect[i];
				}
			}

			if ( cleanHashTable ) {
				$scope.selectAllBtn = true;
				$scope.$emit("emailHasBeenDeleted");
			}
		};

		// spin thru the $scope.email hash table and populate the emailCollect with all the ID goodness it can hold.
		// or clear entries already in $scope.emailCollect
		$scope.selectAllBtn = true;
		$scope.selectAllEmails = function() {

			if ( $scope.selectAllBtn ) {
				// check flag state of each mailbox, act accordingly
				if ( $scope.mailbox.inbox ) {
					for (var i in $scope.inbox) {
						if ( $scope.inbox.hasOwnProperty(i) ) {
							$scope.emailCollect[i] = true;
						}
					}
				} else if ( $scope.mailbox.sent ) {
					for (var i in $scope.sent) {
						if ( $scope.sent.hasOwnProperty(i) ) {
							$scope.emailCollect[i] = true;
						}
					}
				} else if ( $scope.mailbox.junk ) {
					for (var i in $scope.junk) {
						if ( $scope.junk.hasOwnProperty(i) ) {
							$scope.emailCollect[i] = true;
						}
					}
				} else if ( $scope.mailbox.trash ) {
					for (var i in $scope.trash) {
						if ( $scope.trash.hasOwnProperty(i) ) {
							$scope.emailCollect[i] = true;
						}
					}
				} else {
					console.log("Unknown mailbox type or typo somewhere.");
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

		$scope.returnToInbox = function() {
			var cleanHashTable = false;

			for (var i in $scope.emailCollect) {
				// use hasOwnProperty to filter out keys from the Object.prototype
				if ( $scope.emailCollect.hasOwnProperty(i) ) {
					cleanHashTable = true;
					// move item to inbox
					$scope.inbox[i] = $scope.junk[i];
					// then remove it from the junk mailbox and the collected email hash table
					delete $scope.junk[i];
					delete $scope.emailCollect[i];
				}
			}

			if ( cleanHashTable ) {
				$scope.selectAllBtn = true;
				$scope.$emit("emailHasBeenDeleted");
			}
		}

		$scope.selectInbox = function() {
			// set page title via service
			pageTitleService.setMyTitle("Inbox");
			// set all keys in this hash table to false (not using hasOwnProperty here, watch out for strange defects)
			// then set appropriate mailbox flag to true
			for ( var i in $scope.mailbox ) { $scope.mailbox[i] = false }
			$scope.mailbox.inbox = true;
			// set mailbox control options accordingly
			for ( var i in $scope.mailboxOpts ) { $scope.mailboxOpts[i] = false }
			$scope.mailboxOpts.inboxSet = true;
			// signal to parent controller the page title changed
			$scope.$emit('pageTitleChanged');

			// set the common array equal to the targetted array so ng-repeat spins thru the correct data set
			$scope.email = $scope.inbox;
		}

		$scope.selectSent = function() {
			pageTitleService.setMyTitle("Sent");
			for ( var i in $scope.mailbox ) { $scope.mailbox[i] = false }
			$scope.mailbox.sent = true;
			for ( var i in $scope.mailboxOpts ) { $scope.mailboxOpts[i] = false }
			$scope.mailboxOpts.trashSet = true;
			$scope.$emit('pageTitleChanged');

			$scope.email = $scope.sent;
		}

		$scope.selectJunk = function() {
			pageTitleService.setMyTitle("Junk");
			for ( var i in $scope.mailbox ) { $scope.mailbox[i] = false }
			$scope.mailbox.junk = true;
			for ( var i in $scope.mailboxOpts ) { $scope.mailboxOpts[i] = false }
			$scope.mailboxOpts.junkSet = true;
			$scope.mailboxOpts.trashSet = true;
			$scope.$emit('pageTitleChanged');

			$scope.email = $scope.junk;
		}

		$scope.selectTrash = function() {
			pageTitleService.setMyTitle("Trash");
			for ( var i in $scope.mailbox ) { $scope.mailbox[i] = false }
			$scope.mailbox.trash = true;
			for ( var i in $scope.mailboxOpts ) { $scope.mailboxOpts[i] = false }
			$scope.mailboxOpts.trashSet = true;
			$scope.$emit('pageTitleChanged');

			$scope.email = $scope.trash;
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

		$scope.toggleForward = function() {
			$scope.showingReply = !$scope.showingReply;
			$scope.reply = {};
			$scope.reply.to = $scope.selectedMail.from.join(", ");
			$scope.reply.body = "\n\n ---------------------------- \n\n" + $scope.selectedMail.body;
		};

		$scope.sendToJunk = function() {
			console.log( "Junk clicked - not as dirty as it sounds." );
		};

		$scope.sendToTrash = function() {
			console.log( "Trashed clicked - bye-bye email." );
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
