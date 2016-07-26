angular
.module('CatFeeder', ['ngMaterial', 'ngMessages','compareTo','ngAnimate','toastr','ui.router','ngSails','sailsResource'])
.constant('Application',{title:'CatFeeder',version:'0.1',mqtt:{server:/*'test.mosquitto.org'*/'192.168.0.21',port:/*8080*/1883,path:'/'}})
.config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider,$mdIconProvider) {
    console.log('Catfeeder configuration');
    $urlRouterProvider.otherwise('/dashboard');
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
      $mdThemingProvider
      .theme('default')
        .primaryPalette('green', {
          'default': '600'
        })
        .accentPalette('teal', {
          'default': '500'
        })
        .warnPalette('defaultPrimary');

    $mdThemingProvider.theme('dark', 'default')
      .primaryPalette('defaultPrimary')
      .dark();

    $mdThemingProvider.theme('grey', 'default')
      .primaryPalette('grey');

    $mdThemingProvider.theme('custom', 'default')
      .primaryPalette('defaultPrimary', {
        'hue-1': '50'
    });

    $mdThemingProvider.definePalette('defaultPrimary', {
      '50':  '#FFFFFF',
      '100': 'rgb(255, 198, 197)',
      '200': '#E75753',
      '300': '#E75753',
      '400': '#E75753',
      '500': '#E75753',
      '600': '#E75753',
      '700': '#E75753',
      '800': '#E75753',
      '900': '#E75753',
      'A100': '#E75753',
      'A200': '#E75753',
      'A400': '#E75753',
      'A700': '#E75753'
    });
})
.service('randomClientId',function(){
    var lut = []; for (var i=0; i<256; i++) { lut[i] = (i<16?'0':'')+(i).toString(16); }

    function rndClientId()
    {
    var d0 = Math.random()*0xffffffff|0;
    var d1 = Math.random()*0xffffffff|0;
    var d2 = Math.random()*0xffffffff|0;
    var d3 = Math.random()*0xffffffff|0;
    return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
      lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
      lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
      lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff];
  }
  return rndClientId;
})
//.factory('feederSocket',function(socketFactory){return socketFactory();})
/*.service('Settings',['sailsResource','$rootScope',function(sailsResource){
    var self=this;
      
      var settings={};
      
    
    self.settings=function(){return settings;}
    self.setSettings=function(s){
        console.dir(s);
        settings=s;
    }
    self.load=function(res){
        if(res){
            res('Setting').query(function(items){
                settings=items[0] || {};
                //console.dir(settings);
            });
            
            
        }
        
    };
    self.save=function(res){
       // console.dir(settings);
        settings.$save();
    };
    
  
         
}])*/

.run(function($rootScope,$state,Application/*,Settings*/,sailsResource) {
    console.log('Catfeeder running ..');
   // Settings.load(sailsResource);
    $rootScope.app=Application;
    $state.go('home.dashboard');
    
})
;