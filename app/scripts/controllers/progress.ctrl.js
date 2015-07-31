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
      $scope.userProgress = 0;
      $scope.doneCount = 0;
      $scope.pendingCount = 365;


      function init () {
      }


      function getNextExercise () {
        User.getNextExerciseForUser().then(function(data) {
          var day = data.result.day;
          var done = day - 1;
          $scope.userProgress =  Math.floor(((done)/365) * 100);
          $scope.doneCount = done;
          $scope.pendingCount = 365 - done;

          console.log("User progress is at: ", $scope.userProgress, data);
          $scope.userProgress = 50;
        }, function(error) {
          console.log("ERROR: ", error);
        });
      }





      $scope.$on('init-complete', function(event, args) {
        //Gapi initialized
        getNextExercise();
      });

   	  init();
}