'use strict';
// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('Geneticks', ['ionic', 'config', 'Geneticks.controllers', 'Geneticks.services'])

.run(function($ionicPlatform) {
    //The directory to store data
    var store;

    //URL of our asset
    var assetURL = "http://ftp.ncbi.nlm.nih.gov/pub/GTR/data/test_condition_gene.txt";

    //File name of our important data file we didn't ship with the app
    var fileName = "test_condition_gene.txt";

    function initDownload() {
      console.log("Checking for data file.");
      store = cordova.file.dataDirectory;
      //Check for the file. 
      window.resolveLocalFileSystemURL(store + fileName, appStart, downloadAsset);

    }

    function downloadAsset() {
      var fileTransfer = new FileTransfer();
      console.log("About to start transfer");
      fileTransfer.download(assetURL, store + fileName, 
        function(entry) {
          console.log("Success!");
          appStart();
        }, 
        function(err) {
          console.log("Error");
          console.dir(err);
        });
    }

    //only called when the file exists or has been downloaded.
    function appStart() {
      console.log("Download ready!");
    }
  $ionicPlatform.ready(function() {
    console.log("***IONIC READY***");
    
    //Download Genetic Tests

    initDownload();



    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })

    .state('app.search', {
      url: '/search',
      views: {
        'menuContent' :{
          templateUrl: 'templates/search.html'
        }
      }
    })

    .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent' :{
          templateUrl: 'templates/browse.html'
        }
      }
    })

    .state('app.login', {
      url: '/login',
      views: {
        'menuContent' :{
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
        }
      }
    })

    .state('app.genes', {
      url: '/genes',
      views: {
        'menuContent' :{
          templateUrl: 'templates/genes.html',
          controller: 'GenesCtrl'
        }
      }
    })

    .state('app.gene', {
      url: '/genes/:geneId',
      views: {
        'menuContent' :{
          templateUrl: 'templates/gene.html',
          controller: 'GeneCtrl'
        }
      }
    })

    .state('app.tests', {
      url: '/tests',
      views: {
        'menuContent' :{
          templateUrl: 'templates/tests.html',
          controller: 'TestsCtrl'
        }
      }
    })

    .state('app.test', {
      url: '/tests/:testId',
      views: {
        'menuContent' :{
          templateUrl: 'templates/test.html',
          controller: 'TestCtrl'
        }
      }
    })

    .state('app.laboratories', {
      url: '/laboratories',
      views: {
        'menuContent' :{
          templateUrl: 'templates/laboratories.html',
          controller: 'LaboratoriesCtrl'
        }
      }
    })

    .state('app.laboratory', {
      url: '/laboratories/:laboratoryId',
      views: {
        'menuContent' :{
          templateUrl: 'templates/laboratory.html',
          controller: 'LaboratoryCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/tests');
});

