angular.module('CatFeeder')
.controller('FeedController',['$log','$scope','toastr','$interval','Application','mqttSocket','randomClientId','feederSocket',function($log,$scope,toastr,$interval,app,mqttSocket,randomClientId,feederSocket){
    toastr.success('Feed the Cat!!');
    $scope.seconds=5;
    $scope.steps=10;
    $scope.autofeed=$scope.open=$scope.close=false;
    $scope.elapsed=0;
    
   /* mqttSocket.onConnect(function(){
       mqttSocket.subscribe('feeder/isfeeding',function(message){
           $log.log('Message from feeder/isfeeding:');$log.log(message);
           $scope.isfeeding=(message.payloadString=='0x01');
           $scope.$apply();
       });
       //mqttSocket.publish('feeder/isfeed','');
    });
    mqttSocket.connect(app.mqtt.server,app.mqtt.port,app.mqtt.path,randomClientId());
    */
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
            //mqttSocket.publish('feeder/autofeed','');
            feederSocket.emit('feeder/autofeed');
            stop=$interval(function(){
                $scope.elapsed+=1;
                if($scope.elapsed==$scope.seconds)stopfeeding();
            },1000);
            
        }else{
            $scope.isrunning=false;
        }
    });
    
    $scope.$watch('manuel',function(){
        
    });
    
    feederSocket.emit('feeder/isfeed');
}])

;