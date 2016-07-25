angular.module('CatFeeder')
.controller('FeedController',['$log','$rootScope','$scope','toastr','$interval','Application','mqttSocket','randomClientId','feederSocket','$mdDialog','$mdMedia','Settings',function($log,$rootScope,$scope,toastr,$interval,app,mqttSocket,randomClientId,feederSocket,$mdDialog,$mdMedia,Settings){
    toastr.success('Feed the Cat!!');
    $scope.seconds=5;
    $scope.steps=10;
    //$scope.autofeed=$scope.open=$scope.close=false;
    $scope.elapsed=0;
    //$scope.mode=Settings.mode;
  
    
    $rootScope.$on('$sailsResourceUpdated', function(event, message) {
        if(message.model == 'setting') {
            console.dir('Setting has changed');
            $scope.apply();
            applySettings();
        }
    });
    
    function applySettings(){
        
            //$scope.mode=message.data.mode;
           if(!Settings.mode){
               //use socketio
               useSocketIo();
           }else{
               //use mqtt
               useMqtt();
           }
        
    }
    function useSocketIo(){
        $log.log('Use Socket Io');
        io.socket.on('autofeed', function gotHelloMessage (data) {
            console.dir(data);
            console.log('Socket `' + data.id + '` joined the party!');
        });
    }
    
    function useMqtt(){
       $log.log('use Mqtt');
       mqttSocket.onConnect(function(){
            mqttSocket.subscribe('feeder/isfeeding',function(message){
                $log.log('Message from feeder/isfeeding:');$log.log(message);
                $scope.isfeeding=(message.payloadString=='0x01');
                $scope.$apply();
            });
       //mqttSocket.publish('feeder/isfeed','');
        });
        mqttSocket.connect(app.mqtt.server,app.mqtt.port,app.mqtt.path,randomClientId());
    }
  
    function send(action){
        var msg='feeder/'+action;
        console.dir(msg);
        if(!Settings.mode){
             io.socket.get(action, function(data, response) {
                console.dir(response);
                //console.dir(response);
            });
        }else{
            mqttSocket.publish(action,'');
        }
    }
    
    feederSocket.on('feeder/isfeeding',function(message){
        $log.log('Message from feeder/isfeeding:');$log.log(message);
        $scope.isfeeding=(message.payloadString=='0x01');
        $scope.$apply();
    })
    $scope.$watch('autofeed',function(){
        var stop=undefined;
        var stopfeeding=function(){
            if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
          }
          toastr.success('J\'ai donné à manger au chat');
          $scope.autofeed=false;
          $scope.isrunning=false;
        }

        if($scope.autofeed){
            $scope.isrunning=true;
            toastr.success('Auto feeding');
            send('autofeed');
            //feederSocket.emit('feeder/autofeed');
            stop=$interval(function(){
                $scope.elapsed+=1;
                if($scope.elapsed==$scope.seconds)stopfeeding();
            },1000);
            
        }else{
            $scope.isrunning=false;
        }
    });
    
    $scope.$watch('manuel',function(){
        if($scope.manuel){
            toastr.success('Start Feed Manuel');
            send('feed');
        }else{
            toastr.success('Stop Feed Manuel');
            send('notfeed');
        }
    });
    
    $scope.open = function () {
        send('open');
    };
    
    $scope.close = function(){
        send('close');
    };
    
    $scope.reset = function(){
        send('reset');
    };
    
    
    $scope.test = function(){
        send('auto');
    };
    
    
    
    applySettings();
    
}])

;
