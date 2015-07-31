'use strict';

angular.module('GleanApp.services')
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
 function LoginService ($q, $rootScope, $http, User) {
 	
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
     	 	$rootScope.localUser.setItem('linkedin_token', token);
     	 	$http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
     	 	console.log("trying to retrieve basic profile...");
     	 	$http
     	 	.get('https://api.linkedin.com/v1/people/~?format=json')
     	 	.success(function(data, status, headers, config) {
     	 		var user = {
     	 			id: data.id,
     	 			firstName: data.firstName,
     	 			lastName: data.lastName,
     	 			headline: data.headline
     	 		};
     	 		console.log("our user is: ", user);
     	 		User.saveLocalUser(user);
                    deferred.resolve();
     	 	})
     	 	.error(function(data, status, headers, config) {
     	 		 console.log("ERROR!", data, status, headers, config);
                     deferred.reject(data);
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