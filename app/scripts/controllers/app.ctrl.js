'use strict';

function init() {
  angular.element(document).ready(function() {
    window.init();
  });
}

angular.module('GleanApp.controllers', ['GleanApp.services'])
.controller('AppCtrl', AppCtrl);


//####################################
//####################################
//  APP CONTROLLER
//####################################
//####################################

/**
 * @ngdoc function
 * @name AppCtrl
 * @description
 * The main controller for the app
 */
function AppCtrl ($scope, $state, $window, $rootScope, LoginService, User) {

	$scope.logout = logout;
	$window.init = init;
	$scope.initgapi = initgapi;

	function init () {
		$scope.$apply($scope.initgapi);
	}

	function logout () {
		LoginService.logout().then(function() {
			$state.go('login');
		});
	}

	function initgapi () {
		User.initgapi().then(function() {
			$rootScope.$broadcast('init-complete');
		}, function(error) {
			console.log('Error initializing gapi:', error);
		})
	}
}