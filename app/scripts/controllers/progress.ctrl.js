'use strict';

angular.module('GleanApp.controllers')
.controller('ProgressCtrl', ProgressCtrl);


//####################################
//####################################
//  PROGRESS CONTROLLER
//####################################
//####################################

/**
 * @ngdoc function
 * @name ProgressCtrl
 * @description
 * The  controller for the progress page 
 */
function ProgressCtrl ($scope, $state, User) {
 	

  	//####################################
      //  SCOPE FUNCTIONS
      //####################################
      $scope.getNextExercise = getNextExercise;




      function init () {
        getNextExercise();
      }


      function getNextExercise () {
        User.getNextExerciseForUser().then(function(result) {
          console.log("success!! ", result);
        }, function(error) {
          console.log("ERROR: ", error);
        });
      }
   	  init();
}