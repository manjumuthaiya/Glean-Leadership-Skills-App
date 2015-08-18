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
function ProgressCtrl ($scope, $state, $stateParams, User, Utils) {
 	

  	//####################################
      //  SCOPE FUNCTIONS
      //####################################
      $scope.loadNextExerciseAndUserProgress = loadNextExerciseAndUserProgress;
      $scope.goToNextExercise = goToNextExercise;
      $scope.init = init;
      $scope.calculateUserProgress = calculateUserProgress;

      //####################################
      //  SCOPE VARIABLES
      //####################################
      $scope.userProgress = 0;
      $scope.doneCount = 0;
      $scope.pendingCount = 365;

      $scope.nextExerciseType = '';
      $scope.pending = true;
      $scope.firstLogin = $stateParams.firstLogin;


      function init () {
        if($stateParams.pending == 'false') {
            calculateUserProgress(User.exercise.day);

        } else if(!Utils.isEmptyObject(User.exercise)) {  //User is working on something
            calculateUserProgress(User.exercise.day - 1);
        } else {
            $scope.showSpinner(); //Parent scope function
        }
      }



      function loadNextExerciseAndUserProgress () {
        //For some reason user data does not get sent back on first login, we need to explicitly pass around a boolean
        User.isPendingWork($scope.firstLogin).then(function(pendingWork) {
            $scope.hideSpinner();
            //The first response has the next exercise packaged with it
            console.log(pendingWork);
            var exerciseData = pendingWork.nextExercise;
            calculateUserProgress(exerciseData.day - 1); //Done upto the previous exercise
            $scope.nextExerciseType = exerciseData.type.toLowerCase();

            console.log("User progress is at: ", $scope.userProgress, $scope.nextExerciseType);

            if (pendingWork.isPending === false) {
              $scope.pending = false;
            }
        });
        
        
      }

      function goToNextExercise () {
         $state.go('app.exercise', {exerciseType: $scope.nextExerciseType});
      }


      function calculateUserProgress (doneCount) {
        $scope.doneCount = doneCount;
        $scope.pendingCount = 365 - doneCount;
        $scope.userProgress = User.calculateUserProgress(doneCount);
      }


      $scope.$on('init-complete', function(event, args) {
        //Gapi initialized
        loadNextExerciseAndUserProgress();
      });

      $scope.$on('$ionicView.beforeEnter', function(event, args) {
        //State change event - whether it is first load or cached view
        init();

      })

}