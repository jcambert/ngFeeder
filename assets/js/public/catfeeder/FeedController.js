angular.module('CatFeeder')
.controller('FeedController',
['$log','$rootScope','$scope','toastr','$interval','$timeout','Application',
'randomClientId','$sails','$mdDialog','$mdMedia','Settings',
function($log,$rootScope,$scope,toastr,$interval,$timeout,app,
        randomClientId,$sails,$mdDialog,$mdMedia,Settings){
            
    //toastr.success('Feed the Cat!!');
    $scope.seconds=Number(Settings.getSettings().seconds) || 5;
    $scope.steps=Number(Settings.getSettings().steps) || 10;
    $scope.autofeed=$scope.open=$scope.close=false;
    $scope.elapsed=0;
    //$scope.mode=Settings.mode;
    //$scope.running=false;
    $scope.isme=true;
    $scope.me=undefined;
    $scope.connected=false;
    
    $rootScope.$on('$sailsResourceUpdated', function(event, message) {
        if(message.model == 'setting') {
             $scope.seconds=Number(Settings.getSettings().seconds);
             $scope.steps=Number(Settings.getSettings().steps);
             //$scope.$apply();
        }
    });

    function feed(){
       // if($scope.running)return;
        $scope.running=true;
        $sails.get('/feeder/feed')
        .success(function(data, status, headers, jwr){
            $log.log(data);
            //$scope.running=false;
        })
        .error(function(data, status, headers, jwr){
            toastr.error(data);
            //$scope.running=false;
        });
       
    };
    
    function notfeed(){
        //$scope.running=true;
        $sails.get('/feeder/notfeed')
        .success(function(data, status, headers, jwr){
            $log.log(data);
            //$scope.running=false;
        })
        .error(function(data, status, headers, jwr){
            toastr.error(data);
            //$scope.running=false;
            //console.dir(resp);
        });
    };
    
    function open(){
        //if($scope.running)return;
       // $scope.running=true;
        $sails.post('/feeder/open',{steps:10})
        .success(function(data, status, headers, jwr){
            $log.log(data);
            //$scope.running=false;
        })
        .error(function(data, status, headers, jwr){
            toastr.error(data);
            //$scope.running=false;
            //console.dir(resp);
        });
    }
    
    function close(){
        //if($scope.running)return;
        //$scope.running=true;
         $sails.post('/feeder/close',{steps:10})
        .success(function(data, status, headers, jwr){
            $log.log(data);
           // $scope.running=false;
        })
        .error(function(data, status, headers, jwr){
            toastr.error(data);
            //$scope.running=false;
            //console.dir(resp);
        });
    }
    
    function reset(){
        //if($scope.running)return;
         //$scope.running=true;
         $sails.get('/feeder/reset')
        .success(function(data, status, headers, jwr){
            $log.log(data);
            //$scope.running=false;
        })
        .error(function(data, status, headers, jwr){
            toastr.error(data);
           //$scope.running=false;
        });
    }

    
    $scope.onAutoChange = function(state){
        var stop=undefined;
        var stopfeeding=function(){
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                notfeed();
                stop = undefined;
            }
            
            $scope.autofeed=false;
            $scope.isautorun=false;
        }

        if($scope.autofeed){
            $scope.isautorun=true;
            $scope.elapsed=0;
            feed();
            toastr.success('Auto feeding');
        // send('autofeed');
            //feederSocket.emit('feeder/autofeed');
            stop=$interval(function(){
                $scope.elapsed+=1;
                if($scope.elapsed==$scope.seconds)stopfeeding();
            },1000);
            
        }else{
            $scope.isautorun=false;
        }
    };
    
    $scope.onManuelChange = function(state) {
        if(state){
            $scope.ismanualrun=true;
            feed();
            toastr.success('Start Feed Manuel');
        //   send('feed');
        }else{
            notfeed();
            $scope.ismanualrun=false;
            toastr.success('Stop Feed Manuel');
        //send('notfeed');
        }
    };
    
    
    $scope.open = function () {
      open();
    };
    
    $scope.close = function(){
       close();
    };
    
    $scope.reset = function(){
        reset();
    };
    
    
    $sails.on('feed',function(data){
        checkIfIsMe(data.id);
        //toastr.success(data);
        toastr.success('je donne a manger au chat');
    });
    
    $sails.on('notfeed',function(data){
        checkIfIsMe($scope.me);
        //toastr.success(data);
        toastr.success('J\'ai donné à manger au chat');
    });
    
    $sails.on('mqtt_disconnect',function(){
        toastr.warn('Serveur MQTT Deconnecté');
    });
    
    $sails.on('mqtt_connect',function(){
        toastr.success('Serveur MQTT Connecté');
    });
    
    
    $sails.on('connect',function(){
        register();
    })
    
    $sails.on('disconnect',function(){
        $scope.connected=false;
        toastr.warning('Attention vous etes deconnecté du serveur');
        
    })
    function register(){
        $sails.get('/feeder/register')
            .success(function(data, status, headers, jwr){
                $log.log(data);
                $scope.connected=true;
                $scope.me=data.id;
                toastr.success('Bienvenue:'+$scope.me);
            })
            .error(function(data, status, headers, jwr){
                toastr.error(data);
                console.dir(status);
            });
    }
    function checkIfIsMe(id){
         $scope.isme=($scope.me==id) /*$scope.running*/;
    }
    
   // applySettings();
    
}])

;
