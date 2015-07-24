'use strict';

angular.module('GleanApp.controllers')
.controller('LoginCtrl', LoginCtrl);


//####################################
//####################################
//  LOGIN CONTROLLER
//####################################
//####################################

/**
 * @ngdoc function
 * @name LoginCtrl
 * @description
 * The login controller for the app that handles LinkedIn auth
 */
function LoginCtrl ($scope, $state, LoginService) {
 	

  	//####################################
      //  SCOPE FUNCTIONS
      //####################################

   	$scope.login = login;

  	function login() {
    	console.log("Starting !!");
    	LoginService.login().then(function(token) {
        console.log("Successful login callback "+token);
        $state.go("app.progress");
      }, function(error) {
        alert("Login failed :(");
        console.log(error);
      });
  	}

   // LoginService.tryAutoLogin().then(function(token) {console.log("Successful", token)}, function(token) {console.log("Failure", token)});
}