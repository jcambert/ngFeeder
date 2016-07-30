var mqtt=require('mqtt'),
port=sails.config.mqtt.port,
host=sails.config.mqtt.server;

var client = mqtt.connect({ port: port, host: host, keepalive: 10000});
client.on('connect', function () {
  sails.log('connected to MqttServer:'+host+ ' on port:'+port);
});

var MqttService = {  
  publish: function (to,what) {
    sails.log.info('Publish to Mqtt:'+to+'/'+what);
    /*client.publish({
        topic: to
      , payload: what
      , qos: 0
      });*/
    client.publish(to+'/'+what,'',0,function(){
        sails.log.info('published');
    });
  },
  subscribe:function(to){
      client.subscribe(to);
  },
  on:function(msg,callback){
      client.on(msg,callback)
  }
};

sails.log('MqttService created');
module.exports = MqttService; 