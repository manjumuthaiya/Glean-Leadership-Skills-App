'use strict';

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
function AppCtrl ($scope, $state, LoginService) {

	console.log("AppCtrl");
	$scope.logout = logout;

	function logout () {
		LoginService.logout().then(function() {
			$state.go("login");
		});
	}
}