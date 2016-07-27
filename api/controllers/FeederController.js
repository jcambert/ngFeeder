/**
 * FeedController
 *
 * @description :: Server-side logic for managing feeds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	feed:function(req,res){
        return request(req,res,'feed');
        /*sails.log('want autofeed');
        
        if (!req.isSocket) {return res.badRequest();}
        
       // console.dir(sails.sockets);
       console.dir (sails.sockets.getId(req));
        
        sails.sockets.join(req,'feeder');
        
        sails.sockets.broadcast('feeder','autofeed',{id:sails.sockets.getId(req)});
        
        return res.ok();*/
    },
    
    notfeed:function(req,res){
        return request(req,res,'notfeed');
    },
    open:function (req,res){
        if (!req.isSocket || (req.method!='POST')) {return res.badRequest();}
        MqttService.publish('feeder','open');
        return res.ok();
    },
    close:function (req,res){
        if (!req.isSocket || (req.method!='POST')) {return res.badRequest();}
        MqttService.publish('feeder','close');
        return res.ok();
    },
    reset:function(req,res){
        if (!req.isSocket) {return res.badRequest();}
        
    },
    register:function(req,res){
        //if (!req.isSocket || (req.method!='GET')) {return res.badRequest();}
        sails.sockets.join(req,'feeder');
        return res.json({id:sails.sockets.getId(req)});
    }
};
MqttService.on('disconnect',function(){
    sails.sockets.broadcast('feeder','mqtt_disconnect',{});
});
MqttService.on('connect',function(){
    sails.sockets.broadcast('feeder','mqtt_connect',{});
});
function request(req,res,from) {
    sails.log('want '+from);
    if (!req.isSocket) {return res.badRequest();}
        
    // console.dir(sails.sockets);
    sails.log (sails.sockets.getId(req));
    
    
    
    MqttService.publish('feeder',from);
    
    sails.sockets.broadcast('feeder',from,{id:sails.sockets.getId(req)});
    
    return res.ok();
}

