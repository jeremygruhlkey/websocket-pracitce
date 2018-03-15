var express = require('express');
var socket = require('socket.io');

//
const IEXsocket = require('socket.io-client')('https://ws-api.iextrading.com/1.0/tops')
//

var app = express();

var PORT = 3000;

var server = app.listen(PORT, function() {
    console.log('App listening on PORT ' + PORT);
  });

app.use(express.static('public'));

// Socket setup 

var io = socket(server);

  // listens for a connection and calls the connection method
  // which then runs the function callback with the paramater
  // socket referring to the socket between the server and THAT client
io.on('connection', function(socket){
    console.log("Made socket connection " + socket.id);
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

// Listen to the channel's messages
IEXsocket.on('message', message => {
        let data= JSON.parse(message)
        let symbol = data.symbol;
        let lastPrice = data.lastSalePrice;
        console.log("Symbol: " + symbol + ", Price: " + lastPrice)
        io.sockets.emit("broadcast", {description: "price " + lastPrice});
})

// Connect to the channel
IEXsocket.on('connect', () => {

  // Subscribe to topics (i.e. appl,fb,aig+)
  IEXsocket.emit('subscribe', 'snap,fb,aig')

  // Unsubscribe from topics (i.e. aig+)
//   IEXsocket.emit('unsubscribe', 'aig+')
})

// Disconnect from the channel
IEXsocket.on('disconnect', () => console.log('Disconnected.'))