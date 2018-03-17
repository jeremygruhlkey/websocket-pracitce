var express = require('express');
var socket = require('socket.io');

// This socket connects the server to the API.
const IEXsocket = require('socket.io-client')('https://ws-api.iextrading.com/1.0/tops')

var app = express();

var PORT = 3000;

var server = app.listen(PORT, function() {
    console.log('App listening on PORT ' + PORT);
  });

app.use(express.static('public'));

// Socket setup 
// this socket connects the server to the clients
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
        // console.log("Symbol: " + symbol + ", Price: " + lastPrice)
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

// issues start here
app.get("/api/stocks/:stock", function(req, res) {
    let stock = req.params.stock
    let userSocket = require('socket.io-client')('https://ws-api.iextrading.com/1.0/tops?symbols=SNAP')
    // console.log(userSocket);
    res.json(stock);
    userSocket.on('response', response => {
        let data = JSON.parse(response);
        console.log(data);
        let symbol = data.symbol;
        let lastPrice = data.lastSalePrice;
        console.log("Symbol: " + symbol + ", Price: " + lastPrice)
        io.sockets.emit("portfolio", {description: "price " + lastPrice});
    
    })
    userSocket.on('connect', () => {
        console.log("userSocket connected");
        })
   
})