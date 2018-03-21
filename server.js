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
    // here an below sets up a new user specific IEX connection 
    // subscribes to stocks from variable
    // and delivers the result to the client
    var iex = require("socket.io-client")('https://ws-api.iextrading.com/1.0/tops');

    //receives "loggedin" emit from index.js
    socket.on("loggedin", (user) => {
        const { id, stocks} = user;
        console.log(stocks);
        // will send out message back through socket when subscription data received from below
        iex.on('message', message => {
            let data= JSON.parse(message)
            // console.log(message);
            let symbol = data.symbol;
            let lastPrice = data.lastSalePrice;
            console.log("Symbol: " + symbol + ", Price: " + lastPrice)
            // setInterval(() => {
            socket.emit("portfolio", {name: symbol, price: + lastPrice});
            // }), 1000
        })

        //connect to the channel, and subscribe to the stocks sent in user
        iex.on("connect", () => {
            iex.emit("subscribe", stocks.join(",")) //will be dynamic data from db
            // below was hard coded practice data 
            // var newData = {
            //     stocks,
            //     money: stocks.length * 100
            // }

            // setInterval(() => {
            //     socket.emit("newData", newData)
            // }, 3000);
        })

        // iex.on("message", message => {
        //     console.log(message)
        //     // process data and send back to user on each update from IEX
        //     socket.emit("newData", 'some stock data here')
        // })

    })


    socket.on('disconnect', function(){
        console.log('user disconnected');
        iex.close();
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

