
let db = {};

let join = function(networkId, channel, ip, cb) {
  if(db[networkId]) {
    db[networkId].push([channel, ip]);
    cb();
  } else {
    cb({error: "NETWORK_NOT_FOUND"});
  }
}

let leave = function(networkId, channel, ip, cb) {
  if(db[networkId]) {
    let index = -1;
    for(var i = 0; i < db[networkId].length; i++) {
      let entry = db[networkId][i];
      if(entry[0] === channel && entry[1] === ip) {
        index = i;
        break;
      }
    }

    if(index >= 0) {
      db[networkId].splice(index, 1);
      cb();
    } else {
      cb({error: "ENTRY_NOT_FOUND_IN_NETWORK", channel: channel, ip: ip});
    }
  } else {
    cb({error: "NETWORK_NOT_FOUND"});
  }
}


let getTopology = function(networkId, cb) {
  if(db[networkId]) {
    // TODO: Currently only returning exact number in channel, not users in sub-channels. need to decide on channel string format for parent channel addition
    let topology = {};
    for(var i = 0; i < db[networkId].length; i++) {
      let channel = db[networkId][i][0];
      if(!topology[channel]) {
        topology[channel] = 0;
      }
      topology[channel]++;
    }
    cb(null, topology);
  } else {
    cb({error: "NETWORK_NOT_FOUND"});
  }
}

let createNetwork = function(networkId, cb) {
  if(!db[networkId]) {
    db[networkId] = [];
    cb();
  } else {
    cb({error: "NETWORK_EXISTS"});
  }
}

module.exports = {
  join: join,
  createNetwork: createNetwork,
  leave: leave,
  getTopology: getTopology
}