$(document).ready(function(){


    // Make connection
    // this 'socket' is a separate frontend socket variable
    // and not connected to the one in server on the backend
    var socket = io('http://localhost:3000');

    var userID = faker.random.uuid
    var stocks = ['snap', 'aig', 'fb', 'aapl', 'amzn', 'abt', 'ach', 'mdc', 'mfa'];
    var randomNum = Math.floor(Math.random() * stocks.length);
    var userStocks = stocks.slice(randomNum);

    var user = {
        id: userID,
        stocks: userStocks
    }

    socket.on("broadcast", function(data){
        console.log(data);
        
    })

    socket.on("connect", function(){
        socket.emit("loggedin", user); // sends the user id

        socket.on("newData", function(data){
            // stock data
            console.log(data);
        })
    })





})