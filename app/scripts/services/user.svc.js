'use strict';

angular.module('GleanApp.services', [])
.factory('User', UserService);

//####################################
//####################################
//  User SERVICE
//####################################
//####################################


/**
 * @ngdoc service
 * @name UserService
 * @description
 * User service - stores local user data, handles fetch/update of user data in the cloud
 */
 function UserService ($http, $q, $rootScope, ENV) {

 	var service = {
 		saveLocalUser: saveLocalUser,
 		getNextExerciseForUser: getNextExerciseForUser,
          initgapi: initgapi
 	};

 	return service;


     /**
     * @ngdoc function
     * @name initGapi
     * @description
     * Initialize google api endpoint helper object
     */
     function initgapi() {
          var ROOT = ENV.apiEndpoint + '/_ah/api';
          var deferred = $q.defer();

          gapi.client.load('certify', 'v1', function() {
               deferred.resolve();
          }, ROOT);

          return deferred.promise;
     };

 	/**
     * @ngdoc function
     * @name saveLocalUser
     * @description
     * Saves the currently logged in user's id and basic info to the local storage
     */
 	function saveLocalUser (user) {
 		var deferred = $q.defer();
 		$rootScope.localUser.setItem('user_info', user).then(function() {
 			deferred.resolve();
 		}, function() {
 			deferred.reject();
 		});

 		return deferred.promise;
 	}


 	function getLocalUser () {
 		var deferred = $q.defer();

 		$rootScope.localUser.getItem('user_info').then(function(user) {
 			deferred.resolve(user);
 		}, function(error) {
 			deferred.reject(error);
 		});
 		return deferred.promise;
 	}


 	/**
     * @ngdoc function
     * @name getNextExerciseForUser
     * @description
     * Fetches the next exercise that needs to be completed by the user
     */
 	function getNextExerciseForUser () {
 		var deferred = $q.defer();

 		getLocalUser().then(function(user) {
 			console.log("GOt local user: ", user);
 			var url = ENV.apiEndpoint + '/_ah/api/certify/v1/getNextExerciseForUser?userId=' + user.id;
	 		console.log("Endpoint: ", url);
	 		$http
	 		.get(url)
	 		.success(function(data, status, headers, config) {
	 			deferred.resolve(data);
		 	})
	 		.error(function(data, status, headers, config) {
	 			deferred.reject(data);
	 		})
 		});
 		
 		return deferred.promise;

 	}
 }
 	