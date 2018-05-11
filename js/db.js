let db = {};

let join = function(networkId, channel, cb) {
  if(db[networkId]) {
    db[networkId].push(channel);
    cb(null, db);
  } else {
    cb({error: "NETWORK_NOT_FOUND"});
  }
};

let leave = function(networkId, channel, cb) {
  if(db[networkId]) {
    let index = db[networkId].indexOf(channel);

    if(index >= 0) {
      db[networkId].splice(index, 1);
      if(db[networkId].length === 0) {
        delete db[networkId];
      }
      cb(null, db);
    } else {
      cb({error: "CHANNEL_NOT_FOUND"});
    }
  } else {
    cb({error: "NETWORK_NOT_FOUND"});
  }
};

let getChannelsApplicability = function(channels) {
  let applicability = {};
  for(let i = 0; i < channels.length; i++) {
    let channelAppliesTo = channels[i];
    // channels should count them selfs
    // happens here to exclude equal size channels
    let result = [channelAppliesTo];
    for(let j = 0; j < channels.length; j++) {
      let channel = channels[j];

      if(channelAppliesTo.length > channel.length) {
        // channelAppliesTo is higher in the tree
        if(channelAppliesTo.startsWith(channel)) {
          result.push(channel);
        }
      } else if (channelAppliesTo.length < channel.length) {
        // channelAppliesTo is lower in the tree
        if(channel.startsWith(channelAppliesTo)) {
          result.push(channel);
        }
      }
    }
    applicability[channelAppliesTo] = result;
  }
  return applicability;
};

let getTopology = function(networkId, cb) {
  if(db[networkId]) {
    let topology = {};
    let applicability = getChannelsApplicability(db[networkId]);

    // go through each channel
    for(let i = 0; i < db[networkId].length; i++) {
      let channel = db[networkId][i];
      // Add to the channels it applies to
      for(let j = 0; j < applicability[channel].length; j++) {
        let applicableChannel = applicability[channel][j];
        if(!topology[applicableChannel]) {
          topology[applicableChannel] = 0;
        }
        topology[applicableChannel]++;
      }
    }
    cb(null, topology);
  } else {
    cb({error: "NETWORK_NOT_FOUND"});
  }
};

let createNetwork = function(networkId, cb) {
  if(!db[networkId]) {
    db[networkId] = [""];
    cb(null, db);
  } else {
    cb({error: "NETWORK_EXISTS"});
  }
};

let getDB = function(){
  return db;
};

module.exports = {
  join: join,
  createNetwork: createNetwork,
  leave: leave,
  getTopology: getTopology,
  getDB:getDB
}