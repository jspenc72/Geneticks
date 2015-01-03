'use strict';
angular.module('Geneticks.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicScrollDelegate, $timeout, $db, Tests, GeneticksAuth, userdb_pub_remote, userdb_pri_remote) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginModal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };

  $scope.scrollBottom = function() {
    $ionicScrollDelegate.scrollBottom(true);
  };

  // Open the login modal
  $scope.login = function() {
    $scope.loginModal.show();
  };

  $scope.doSignUp = function(){
    if($scope.loginData.user.email || $scope.loginData.user.password){
      var usermetadata = {
        identities : [],
        remoteDB : 'remote-pri-db'
      };
      GeneticksAuth.signup($scope.loginData.user.email, $scope.loginData.user.password, usermetadata);
    }else{
      alert("You must provide a valid email and password");
    }
  }

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    GeneticksAuth.login($scope.loginData.user.email, $scope.loginData.user.password);
    $scope.closeLogin();
  }

  $scope.doLogout = function(){
    GeneticksAuth.logout();
  }
  
  $scope.doCheckSession = function(){
    GeneticksAuth.session();
  }

  $scope.saveTests = function(myTests){
    console.log("Saving Tests");
    console.log(myTests.length);
    var progress = 0;
    for(var j = 0; j < myTests.length; j++){
      myTests[j].laboratory = '';
      // jTest.id = 'test_'+myTests[j].#accession_version + myTests[j].GTR_identifier;
      // Tests.create(jTest);
      progress = j/myTests.length*100;
      console.log(progress.toFixed(2)+"%");
    }    

    Tests.bulk(myTests, function(err, response){
      console.log("callback");
      if(err){
        console.log("error");
        
        console.log(err);
      }else{
        console.log("success");
        console.log(response);
      }

    });
    return console.log("Save Complete");
  }
  $scope.reloadTests = function(){
    var myTests = [];
    function addToArray(tmpTest){
      myTests.push(tmpTest);    
    }
    function init() {      
      window.resolveLocalFileSystemURL(cordova.file.dataDirectory + "test_condition_gene.txt", gotFile, fail);
    }

    function fail(e) {
      console.log("FileSystem Error");
      console.dir(e);
    }

    function gotFile(fileEntry) {
      console.log("gotFile");
      var tmpTestTemplate = {};
      var tmpTest = {};
      fileEntry.file(function(file) {
        var reader = new FileReader();
        var dosave = function(testarr){
          console.log("Doing Save");
          console.log(testarr)
          $scope.saveTests();
        };
        reader.onloadend = function(e) {
          //Split via Rows
          var arrayOfLines = this.result.match(/[^\r\n]+/g);
          console.log("arrayOfLines: "+arrayOfLines.length);
          var rows = [];
          for (var i = 0; i < arrayOfLines.length; i++) {
            //Split via Columns
            var lineArray = arrayOfLines[i].split(/\t/);   
            //Get the first line in the Array, Column Header
            if(i==0){
              //Define properties of a new object based on column headers
              for(var j = 0; j < lineArray.length; j++){
                tmpTestTemplate[lineArray[j]] = '';
              }
              console.log(tmpTestTemplate);
            }else if(i>=1){
              //Create a temporary Test object for each line in the data set from a template generated based off the header row.
              tmpTest = {};
              tmpTest = angular.copy(tmpTestTemplate);

              var x = 0;
              for (var j in tmpTest) {                
                if (tmpTest.hasOwnProperty(j)) {
                  tmpTest[j] = lineArray[x];
                }
                x++;
                // console.log("Partial "+x);
                // console.log(tmpTest);
              }   
              //Add the object to the array of Genetic "Test" objects
              addToArray(tmpTest);
            }
            if(i==arrayOfLines.length-1){
              console.log("myTests: "+myTests.length);
              $scope.saveTests(myTests);
            }
          }
        } 
        console.log("readAsText");
        reader.readAsText(file);
      });

    }   
    init();
    console.log("Reloading");
  }
})

.controller('LoginCtrl', function($scope, $stateParams, Genes) {
})

.controller('GenesCtrl', function($scope, $ionicModal, Genes) {
  $scope.init = function(){
    Genes.all()
    .then(function (docs) {
      $scope.genes = docs.genes;
      $scope.$apply();
    });    
  };
  $scope.init();
  $scope.edit = function(doc){
    $scope.shouldCreateGene = false;
    $scope.shouldUpdateGene = true;
    $scope.gene = doc;
    $scope.geneModal.show();
  }
  $scope.update = function(doc){
    Genes.update(doc);
    $scope.geneModal.hide();
  }
  $scope.new = function(){
    $scope.shouldCreateGene = true;
    $scope.shouldUpdateGene = false;
    $scope.gene = {};
    $scope.geneModal.show();    
  }
  $scope.create = function(doc){
    Genes.create(doc);
    $scope.geneModal.hide();
  }
  $scope.delete = function(doc){
    //if Confirm Delete
    $scope.destroy(doc);
    //if Cancel, Do nothing

  }
  $scope.destroy = function(doc){
    Genes.destroy(doc);
  }
  /////////////////
  //MODALS
  /////////////////
  $scope.shouldCreateGene = false;
  $scope.shouldUpdateGene= false;
  $ionicModal.fromTemplateUrl('templates/gene-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.geneModal = modal;
  });
})

.controller('GeneCtrl', function($scope, $stateParams, Genes) {
})

.controller('TestsCtrl', function($scope, $ionicModal, Tests) {
  $scope.init = function(){
    Tests.all()
    .then(function (docs) {
      $scope.tests = docs.tests;
      $scope.$apply();
    });    
  };
  $scope.init();
  $scope.edit = function(doc){
    $scope.shouldCreateTest = false;
    $scope.shouldUpdateTest = true;
    $scope.test = doc;
    $scope.testModal.show();
  }
  $scope.update = function(doc){
    Tests.update(doc);
    $scope.testModal.hide();
  }
  $scope.new = function(){
    $scope.shouldCreateTest = true;
    $scope.shouldUpdateTest = false;
    $scope.test = {};
    $scope.testModal.show();    
  }
  $scope.create = function(doc){
    Tests.create(doc);
    $scope.testModal.hide();
  }
  $scope.delete = function(doc){
    //if Confirm Delete
    $scope.destroy(doc);
    //if Cancel, Do nothing

  }
  $scope.destroy = function(doc){
    Tests.destroy(doc);
  }
  /////////////////
  //MODALS
  /////////////////
  $scope.shouldCreateTest = false;
  $scope.shouldUpdateTest = false;
  $ionicModal.fromTemplateUrl('templates/test-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.testModal = modal;
  });
})

.controller('TestCtrl', function($scope, $stateParams, Tests) {
})

.controller('LaboratoriesCtrl', function($scope, $ionicModal, Laboratories) {
  $scope.init = function(){
    Laboratories.all()
    .then(function (docs) {
      $scope.laboratories = docs.laboratories;
      $scope.$apply();
    });    
  };
  $scope.init();
  $scope.edit = function(doc){
    $scope.shouldCreateLaboratory = false;
    $scope.shouldUpdateLaboratory = true;
    $scope.laboratory = doc;
    $scope.laboratoryModal.show();
  }

  $scope.update = function(doc){
    Laboratories.update(doc);
    $scope.laboratoryModal.hide();
  }

  $scope.new = function(){
    $scope.shouldCreateLaboratory = true;
    $scope.shouldUpdateLaboratory = false;
    $scope.laboratory = {};
    $scope.laboratoryModal.show();    
  }

  $scope.create = function(doc){
    Laboratories.create(doc);
    $scope.laboratoryModal.hide();
  }

  $scope.delete = function(doc){
    //if Confirm Delete
    $scope.destroy(doc);
    //if Cancel, Do nothing

  }

  $scope.destroy = function(doc){

    Laboratories.destroy(doc);
  }

  /////////////////
  //MODALS
  /////////////////
  $scope.shouldCreateLaboratory = false;
  $scope.shouldUpdateLaboratory = false;
  
  $ionicModal.fromTemplateUrl('templates/laboratory-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.laboratoryModal = modal;
  });
})

.controller('LaboratoryCtrl', function($scope, $stateParams) {
})