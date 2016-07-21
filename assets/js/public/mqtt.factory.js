(function(angular,mqtt) {
  'use strict';
  angular
  .module('CatFeeder')
  .factory('mqttSocket', function($rootScope,$log){
        var service = {};
        var client = {};
        var onConnectionLost =function(response){};
        var onMessageArrived = function(message){};
        var onConnect = function(){};
        var subscription={};
        var connected = false;
        service.connect = function(host, port,path,clientId) {
            
            $log.log("Try to connect to MQTT Broker " + host + " with user " + clientId);
            client = new mqtt.Client(host,parseInt(port),'/'+path,clientId);

            client.onConnectionLost = function(response){
                connected=false;
                if (response.errorCode !== 0)
	                   $log.log("onConnectionLost:"+response.errorMessage);
                onConnectionLost(response);
                $log.log('Mqtt connection is lost');
                $rootScope.$broadcast("MQTT.CONNECTION_CLOSE");
            } ;
            client.onMessageArrived =function(message){
                console.dir(message.destinationName);
                onMessageArrived(message);
                if(message.destinationName in subscription)subscription[message.destinationName](message);
                $log.log('Message arrived:'+message.payloadString);
            } 
            client.connect({
                onSuccess:function(){
                    connected=true;
                    onConnect();
                    $log.log("Mqtt connection is open");
                    $rootScope.$broadcast("MQTT.CONNECTION_OPEN")
                },
                mqttVersion:4
            });
        }



        service.publish = function(topic, payload) {
            if(!connected)return;
            client.publish(topic,payload, {retain: true});
            $log.log('publish-Event sent '+ payload + ' with topic: ' + topic + ' ' + client);
        }

        service.onMessage = function(callback) {
            onMessageArrived = callback;
        }

        service.onConnectionLost = function(callback){
            onConnectionLost=callback;
            
        }
        
        service.onConnect = function(callback){
            onConnect = callback;
           
        }
        
        service.subscribe = function(topic,callback){
            if(!connected)return;
            client.subscribe(topic);
            if(callback){
                subscription[topic]=callback;
            }
            $log.log('subscribe to topic:'+topic);
        }
        
        return service;
  })
})(angular,Paho.MQTT);

