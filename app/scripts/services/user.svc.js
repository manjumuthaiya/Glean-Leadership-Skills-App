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
 function UserService ($http, $q, $rootScope, ENV, Utils) {

 	var service = {
 		saveLocalUser: saveLocalUser,
 		getNextExerciseForUser: getNextExerciseForUser,
          getUserData: getUserData,
          getLocalUser: getLocalUser,
          initgapi: initgapi,
          setUserLastExerciseCompleted: setUserLastExerciseCompleted,
          isPendingWork: isPendingWork,
          calculateUserProgress: calculateUserProgress,
          exercise: {},
          user: {},
          pending: {}
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
          service.user = user;
 		$rootScope.localUser.setItem('user_info', user).then(function() {
 			deferred.resolve();
 		}, function() {
 			deferred.reject();
 		});

 		return deferred.promise;
 	}

     /**
     * @ngdoc function
     * @name getLocalUser
     * @description
     * Gets the currently logged in user id from local storage
     */
 	function getLocalUser () {
 		var deferred = $q.defer();

 		$rootScope.localUser.getItem('user_info').then(function(user) {
               service.user = user;
 			deferred.resolve(user);
 		}, function(error) {
 			deferred.reject(error);
 		});
 		return deferred.promise;
 	}

      /**
     * @ngdoc function
     * @name getUserData
     * @description
     * Gets the currently logged in user's data from the server
     */
     function getUserData (userId) {
          var deferred = $q.defer();

          
          gapi.client.certify.getUser({'userId': userId})
           .then(function(data) {

                deferred.resolve(data);
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

          var user = service.user;
          gapi.client.certify.getNextExerciseForUser({'userId': user.id}).then(function(data) {
               service.exercise = data.result;

               deferred.resolve(data);
          }, function(error) {
               deferred.reject(error);
          });
	 		
 		 		
 		return deferred.promise;

 	}


     /**
     * @ngdoc function
     * @name setUserLastExerciseCompleted
     * @description
     * Updates the server on which exercise was last completed by the user
     */
     function setUserLastExerciseCompleted (completed) {
          var deferred = $q.defer();
          var user = service.user;

          gapi.client.certify.setUserLastExerciseCompleted({'userId': user.id, 'lastExercise': completed})
          .then(function(data) {
               service.pending.progressed++;      //Increment progress
               deferred.resolve();
          }, function(error) {
               deferred.reject(error);     
          });
             
          
          
          return deferred.promise;

     }

     function getPendingDaysWork (firstLogin) {
          var format = 'YYYY-MM-DDT00:00:00.000-00:00';
          var deferred = $q.defer();

          getLocalUser().then(function(user) {
               return getUserData(user.id);
          }).then(function(userData) {
               console.log("getUserData response:", userData);
               var pending = 0;

               if(userData.result.startDate && userData.result.startDate !== null) {
                    var startDate = moment(userData.result.startDate, format);
                    var today = moment();
                    var shouldHaveCompleted = today.diff(startDate, "days");
                    if(shouldHaveCompleted == 0 && userData.result.lastExerciseCompleted == 0) {
                         pending = 1;   //User started today (first login, counted as the first day of work)
                    } else {
                         pending = shouldHaveCompleted - userData.result.lastExerciseCompleted + 1;
                    }

               }
               if(userData.status != 200 && firstLogin == 'true') {     //For some reason user data does not get sent back on first login, we need to explicitly pass around this boolean
                    pending = 1;
               }
               //TODO: Put an if condn here to make this call only if pending is not 0 -- store the num of days completed in localStorage
               getNextExerciseForUser().then(function(data) {
                    if(data.result === null) {    //All exercises have been completed
                         pending = 0;
                    }
                    var response = {
                         pending: pending,
                         exercise: data.result
                    };
                    deferred.resolve(response);
               });
          }); 

          return deferred.promise;
      }


      function isPendingWork (firstLogin) {
           console.log("isPendingWork: ", service.pending);
           if(Utils.isEmptyObject(service.pending)) {
               var deferred = $q.defer();
               getPendingDaysWork(firstLogin).then(function(result) {
                    console.log("getPendingDaysWork response : ", result);
                    if(result.pending === 0) {
                         service.pending.days = 0;
                         service.pending.progressed = 0;
                         deferred.resolve({isPending: false, nextExercise: result.exercise});  //Caught up, but still return the exercise for now (progress circle needs it)
                    } else if(result.pending === -1) { //User has not started yet
                         service.pending.days = 1;
                         service.pending.progressed = 0;
                         deferred.resolve({isPending: true, nextExercise: result.exercise});
                    }
                    service.pending.days = result.pending;
                    service.pending.progressed = 0;    //Counter for current session
                    deferred.resolve({isPending: true, nextExercise: result.exercise});
               });

               return deferred.promise;
         
           }
           if(service.pending.days - service.pending.progressed > 0) {
               return true;
           }

           return false; //Caught up
      }

      function calculateUserProgress (done) {
          var userProgress = Math.ceil(((done)/365) * 100);  
          return userProgress; 
      }
 }
 	