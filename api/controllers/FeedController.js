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
        
        console.dir(sails.sockets);
        
        sails.sockets.join(req,'feeder');
        
        //sails.sockets.broadcast('feeder','autofeed',req);
        
        return res.ok();
    }
};

