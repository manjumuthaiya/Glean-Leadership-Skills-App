// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('GleanApp', ['ionic', 'GleanApp.controllers', 'GleanApp.services', 'LocalForageModule'])
.config(config)
.run(run);

/**
 * @ngdoc function
 * @name config
 * @description
 * function for configuring the states
 */
function config ($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('login', {
    url: '/login',
    controller: 'LoginCtrl',
    templateUrl: 'templates/login.html'
  })
  .state('app', {
    url: '/app',
    abstract: true,
    controller: 'AppCtrl',
    templateUrl: 'templates/menu.html'
  })
  .state('app.home', {
    url: '/home',
    views: {
      'menuContent' : {
          templateUrl: 'templates/home.html'
      }
    }
  });
}

/**
 * @ngdoc function
 * @name run
 * @description
 * Run function that performs some init tasks for the app
 */

function run($ionicPlatform, $rootScope, $state, $localForage, LoginService) {
  $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
       if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }

      //Do some initial setup for the app
      function init () {
          alert("init");
         SocialGap.Linkedin_ChangeSettings('75w41rzx3jnkq1', 'SRK294JiW4OsId3f', 'http://localhost/auth/linkedin/callback', 'r_basicprofile');
      
     
         $rootScope.localUser = $localForage.createInstance({
          name: 'GLSUser',
          storeName: 'GLSUserData'
         });
         console.log("db is: ",$rootScope.localUser);

         LoginService.tryAutoLogin().then(function(token) {
            $state.go('app.home');    //Already logged in
         }, function(error) {
            $state.go('login');     //Needs to log in (token not found in local storage)
         })

       }

       init();
    });

    
}
