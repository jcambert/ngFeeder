angular.module('CatFeeder')
.controller('CatFeederController',['$scope','toastr',function($scope,toastr){
    toastr.success('Bienvenue');
}])

;