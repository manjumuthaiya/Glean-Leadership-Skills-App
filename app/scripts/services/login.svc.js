'use strict';

angular.module('GleanApp.services', [])
.factory('LoginService', LoginService);

//####################################
//####################################
//  LogIn SERVICE
//####################################
//####################################


/**
 * @ngdoc service
 * @name LoginService
 * @description
 * LogIn service
 */
 function LoginService ($q, $rootScope) {
 	
 	var service = {
 		login: login,
 		tryAutoLogin: tryAutoLogin,
 		logout: logout

 	};

 	return service;

 	/**
     * @ngdoc function
     * @name login
     * @description
     * Method to login the user by showing the linkedin auth page
     */
     function login () {
     	 var deferred = $q.defer();

     	 function loginSuccess(token) {
     	 	$rootScope.localUser.setItem('linkedin_token', token).then(function() {
     	 		deferred.resolve();
     	 	});
     	 }

     	 function loginFailure (error) {
     	 	deferred.reject(error);
     	 }
     	 SocialGap.Linkedin_PerformLogon(loginSuccess, loginFailure);

     	 return deferred.promise;
     }

     /**
     * @ngdoc function
     * @name tryAutoLogin
     * @description
     * Method to login the user automatically using the preset token
     */
     function tryAutoLogin () {
     	var deferred = $q.defer();

     	$rootScope.localUser.getItem('linkedin_token').then(function(token) {
     		if (!token || token == null) {
     			deferred.reject(token);
     		} else {
     			deferred.resolve(token);
     		}
     	}, function(error) {
     		deferred.reject(error);
     	});
     	
     	return deferred.promise;
     }

     /**
     * @ngdoc function
     * @name logout
     * @description
     * Method to logout the user by clearing the linkedin auth token from local storage
     */
     function logout () {
     	var deferred = $q.defer();
     	$rootScope.localUser.removeItem('linkedin_token').then(function() {
     		deferred.resolve();
     	}, function(error) {
     		deferred.reject();
     	});
     	return deferred.promise;
     }
 }