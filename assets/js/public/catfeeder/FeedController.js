angular.module('CatFeeder')
.controller('FeedController',['$log','$rootScope','$scope','toastr','$interval','$timeout','Application','mqttSocket','randomClientId','$sails','$mdDialog','$mdMedia'/*,'Settings'*/,function($log,$rootScope,$scope,toastr,$interval,$timeout,app,mqttSocket,randomClientId,$sails,$mdDialog,$mdMedia/*,Settings*/){
    //toastr.success('Feed the Cat!!');
    $scope.seconds=5;
    $scope.steps=10;
    $scope.autofeed=$scope.open=$scope.close=false;
    $scope.elapsed=0;
    //$scope.mode=Settings.mode;
  
    
    function feed(){
        $sails.get('/feeder/feed')
        .success(function(data, status, headers, jwr){
            console.dir(data);
        })
        .error(function(data, status, headers, jwr){
            console.dir(data);
        });
    };
    
    function notfeed(){
        $sails.get('/feeder/notfeed')
        .success(function(data, status, headers, jwr){
            console.dir(data);
        })
        .error(function(data, status, headers, jwr){
            toastr.error(data);
            //console.dir(resp);
        });
    };
    
    function open(){
        $sails.post('/feeder/open',{steps:10})
        .success(function(data, status, headers, jwr){
            console.dir(data);
        })
        .error(function(data, status, headers, jwr){
            toastr.error(data);
            //console.dir(resp);
        });
    }
    
    function close(){
         $sails.post('/feeder/close',{steps:10})
        .success(function(data, status, headers, jwr){
            console.dir(data);
        })
        .error(function(data, status, headers, jwr){
            toastr.error(data);
            //console.dir(resp);
        });
    }
    
    function reset(){
         $sails.get('/feeder/reset')
        .success(function(data, status, headers, jwr){
            console.dir(data);
        })
        .error(function(data, status, headers, jwr){
            toastr.error(data);
            //console.dir(resp);
        });
    }
  /*  feederSocket.on('feeder/isfeeding',function(message){
        $log.log('Message from feeder/isfeeding:');$log.log(message);
        $scope.isfeeding=(message.payloadString=='0x01');
        $scope.$apply();
    })*/
    $scope.$$postDigest(function(){
        $scope.$watch('autofeed',function(){
            
        });
        
        $scope.$watch('manuel',function(){
           
        });
    });
    
    $scope.onAutoChange = function(state){
        var stop=undefined;
        var stopfeeding=function(){
            if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            notfeed();
            stop = undefined;
        }
        
        $scope.autofeed=false;
        $scope.isrunning=false;
        }

        if($scope.autofeed){
            $scope.isrunning=true;
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
            $scope.isrunning=false;
        }
    };
    
    $scope.onManuelChange = function(state) {
        if(state){
            feed();
            toastr.success('Start Feed Manuel');
        //   send('feed');
        }else{
            notfeed();
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
    
    
    $sails.on('feed',function(){
        toastr.success('je donne a manger au chat');
    });
    
    $sails.on('notfeed',function(){
        toastr.success('J\'ai donné à manger au chat');
    });
    
    $sails.on('mqtt_disconnect',function(){
        toastr.warn('Serveur MQTT Deconnecté');
    });
    
    $sails.on('mqtt_connect',function(){
        toastr.warn('Serveur MQTT Connecté');
    });
    
   // applySettings();
    
}])

;
