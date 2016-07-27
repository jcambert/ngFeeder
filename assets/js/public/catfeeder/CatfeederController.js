angular.module('CatFeeder')
.controller('CatFeederController',['$scope','toastr','$mdDialog','$mdMedia','Settings','sailsResource',function($scope,toastr,$mdDialog,$mdMedia,Settings,sailsResource){
 //   toastr.success('Bienvenue');
    
    $scope.showSettings = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
            controller: 'SettingsController',
            templateUrl: 'templates/settings.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: useFullScreen,
            locals: {
             settings:Settings.getSettings()
            }
           
        })
        .then(function(result) {
            //$scope.status = 'You said the information was "' + result + '".';
            Settings.setSettings(result);
            Settings.save(sailsResource);
        }, function() {
            $scope.status = 'You cancelled the dialog.';
        });
      
    };
}])
.controller('SettingsController',['$scope','$mdDialog','locals',function($scope,$mdDialog,locals){
  $scope.settings=locals.settings;
  console.dir($scope.settings);
  $scope.save = function() {
    $mdDialog.hide($scope.settings);
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
}])
;