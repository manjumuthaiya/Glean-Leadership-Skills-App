'use strict';

angular.module('GleanApp.controllers')
.controller('ExerciseCtrl', ExerciseCtrl);


//####################################
//####################################
//  EXERCISE CONTROLLER
//####################################
//####################################

/**
 * @ngdoc function
 * @name ExerciseCtrl
 * @description
 * The  controller for the exercise pages 
 */
function ExerciseCtrl ($scope, $state, $sce, $ionicHistory, User) {
	//Scope variables
 	$scope.exercise = User.exercise;
 	$scope.content = $sce.trustAsHtml($scope.exercise.content);

 	//Scope functions
 	$scope.done = done;
 	$scope.isCurrentExercise = isCurrentExercise;
 	$scope.returnToHomePage = returnToHomePage;
 	$scope.goForward = goForward;

 	function done () {
 		User.setUserLastExerciseCompleted($scope.exercise.day).then(function() {
 			if(User.isPendingWork()) {
 				$scope.showSpinner();
 				User.getNextExerciseForUser().then(function(data) {
 					$scope.hideSpinner();
 					if(data.result === null) {	//All exercises have been completed
 						returnToHomePage(false);
 					} else {
 						//$state.transitionTo($state.current, $state.$current.params, { reload: true, inherit: true, notify: true });//reload
 						$state.transitionTo($state.current, {exerciseType: data.result.type.toLowerCase(), day: data.result.day}, {reload: true, inherit: true, notify: true});
 					}
 					
 				});
 			} else {
 				returnToHomePage(false); //no more pending
 			}
 		});
 	}

 	function returnToHomePage (isPending) {

 		$ionicHistory.nextViewOptions({
				    disableBack: true
				 });
 		$ionicHistory.backView().stateParams = {pending: isPending};
 		$ionicHistory.goBack();
 	}

 	function goForward () {
 		$ionicHistory.forwardView().go();
 	}

 	function isCurrentExercise () {
 		return $scope.exercise.day === User.exercise.day;
 	}

}