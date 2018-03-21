$(document).ready(function(){


    // Make connection
    // this 'socket' is a separate frontend socket variable
    // and not connected to the one in server on the backend
    var socket = io('http://localhost:3000');

    var userID = faker.random.uuid
    var stocks = ['snap', 'aig', 'fb', 'aapl', 'amzn', 'abt', 'ach', 'mdc', 'mfa'];
    var randomNum = Math.floor(Math.random() * stocks.length);
    var userStocks = stocks.slice(randomNum);

    // creates user is info to identify the socket in the server
    var user = {
        id: userID,
        stocks: userStocks
    }

    // receives "broadcast" emit from server containing the top 10 data
    socket.on("broadcast", function(data){
        // console.log(data);
        
    })

    // sends the user id to the server to establish specific connection 
    // right now works on page load of /index.html    
    socket.on("connect", function(){
        socket.emit("loggedin", user); // sends the user id

        socket.on("newData", function(data){
            // stock data
            console.log(data);
        })
    })

   const displayObject = {};
    // receives portfolio emit from server
    socket.on("portfolio", function(data){
        $("#stocks").empty();
        displayObject[data.name] = data.price
        console.log(data);
        Object.keys(displayObject).forEach(name => {
            const price = displayObject[name] 
            const stock = $("<p>").text(name)
            const stockPrice = $("<p>").text(price)
            $("#stocks").append(stock);
            $("#stocks").append(price);
        })
    })
    
            
            





})