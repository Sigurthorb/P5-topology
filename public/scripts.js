var opts = {
    container: "#tree"
};

var nodes = {};
var data, t;

function convertTopology(topology){
    return topology.sort().map(ch => {  
        let node = {
            text: { name: ch }
        };
        if(ch.length) {
            node.parent = nodes['n' + ch.substring(0, ch.length-1)];
        } else {
            node.text.name = "root";
        }
        nodes['n' + ch] = node;
        return node;
    });
}

function renderTree(topology){
    nodes = {};
    // topology = ["", "0", "00", "000", "001", "01", "010", "011", "1", "10", "100", "101", "11", "110", "111"];
    let n = convertTopology(topology);
    n.unshift(opts);
    if(t) t.destroy();
    t = new Treant(n);
}

$(function () {
    var socket = io();

    socket.on('topology-change', function(networks){
        data = networks;
        let preVal = $('#network-selector').val();
        $('#network-selector').empty();
        for (var network in networks) {
            // check if the property/key is defined in the object itself, not in parent
            if (networks.hasOwnProperty(network)) {
                $('#network-selector').append($("<option>").attr('value', network).text(network));
            }
        }
        //If there was a network selected previously, select it again
        if(preVal){
          $('#network-selector').val(preVal);  
        }
            
        /*if(!$.isEmptyObject(data))*/ renderTree(data[$('#network-selector').val()]);
    });

    $('#network-selector').change(() => {
        renderTree(data[$('#network-selector').val()]);
    });
});

