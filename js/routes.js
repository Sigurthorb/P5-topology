let db = require("./db.js");
let uuid = require("uuid/v4")

module.exports = function(router) {
  router.post("/network", function(req, res, next) {
    let networkId = uuid();
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    db.createNetwork(networkId, ip, function(err) {
      if(!err) {
        res.send(networkId);
      } else {
        res.status(409).send(err);
      }
    });
  });

  router.get("/network/:networkId", function(req, res, next) {
    let network = req.params.networkId;
    let ip = req.connection.remoteAddress;

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
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    db.join(network, channel, ip, function(err) {
      if(!err) {
        res.send();
      } else {
        res.status(404).send(err);
      }
    });
  });

  router.delete("/network/:networkId/channel/:channel", function(req, res, next) {
    let network = req.params.networkId;
    let channel = req.params.channel;
    let ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
    
    db.leave(network, channel, ip, function(err) {
      if(!err) {
        res.send();
      } else {
        res.status(404).send(err);
      }
    });
  });
  
  return router;
}