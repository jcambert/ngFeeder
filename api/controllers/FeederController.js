/**
 * FeedController
 *
 * @description :: Server-side logic for managing feeds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	auto:function(req,res){
        sails.log('want autofeed');
        
        if (!req.isSocket) {return res.badRequest();}
        
       // console.dir(sails.sockets);
       console.dir (sails.sockets.getId(req));
        
        sails.sockets.join(req,'feeder');
        
        sails.sockets.broadcast('feeder','autofeed',{id:sails.sockets.getId(req)});
        
        return res.ok();
    },
    notfeed:function(req,res){
        return request(req,res,'notfeed');
    }
};

function request(req,res,from) {
    sails.log('want '+from);
    if (!req.isSocket) {return res.badRequest();}
        
    // console.dir(sails.sockets);
    sails.log (sails.sockets.getId(req));
    
    sails.sockets.join(req,'feeder');
    
    sails.sockets.broadcast('feeder',from,{id:sails.sockets.getId(req)});
    
    return res.ok();
}

