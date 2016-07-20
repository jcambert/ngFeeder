angular
.module('CatFeeder', ['ngMaterial', 'ngMessages','compareTo','ngAnimate','toastr','ui.router'])
.config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider,$mdIconProvider) {
    console.log('Catfeeder configuration');
    $stateProvider
      .state('home', {
        url: '',
        templateUrl: 'templates/main.html',
        controller: 'CatFeederController',
        abstract: true
      })
      .state('home.dashboard', {
        url: '/dashboard',
        templateUrl: 'templates/dashboard.html',
        data: {
          title: 'Dashboard'
        }
      });
})
.run(function($state) {
    console.log('Catfeeder running ..');
    $state.go('home.dashboard');
})
;