let db = require("./db.js");
let uuid = require("uuid/v4");

module.exports = function(router) {
  router.post("/network", function(req, res, next) {
    let networkId = uuid();
    let io = req.app.get('socketio');

    db.createNetwork(networkId, function(err, data) {
      if(!err) {
        res.send(networkId);
        io.emit('topology-change', data);
      } else {
        res.status(409).send(err);
      }
    });
  });

  router.get("/network/:networkId", function(req, res, next) {
    let network = req.params.networkId;

    db.getTopology(network, function(err, data) {
      if(!err) {
        res.send(data);
      } else {
        res.status(404).send(err);
      }
    });
  });

  router.post("/network/:networkId/channel/:channel", function(req, res, next) {
    let network = req.params.networkId;
    let channel = req.params.channel;
    let io = req.app.get('socketio');
    
    db.join(network, channel, function(err, data) {
      if(!err) {
        res.send();
        io.emit('topology-change', data);
      } else {
        res.status(404).send(err);
      }
    });
  });

  router.delete("/network/:networkId/channel/:channel", function(req, res, next) {
    let network = req.params.networkId;
    let channel = req.params.channel;
    let io = req.app.get('socketio');
    
    db.leave(network, channel, function(err, data) {
      if(!err) {
        res.send();
        io.emit('topology-change', data);
      } else {
        res.status(404).send(err);
      }
    });
  });

  // root leaving
  router.delete("/network/:networkId/channel", function(req, res, next) {
    let network = req.params.networkId;
    let io = req.app.get('socketio');
    
    db.leave(network, "", function(err, data) {
      if(!err) {
        res.send();
        io.emit('topology-change', data);
      } else {
        res.status(404).send(err);
      }
    });
  });
  
  return router;
}