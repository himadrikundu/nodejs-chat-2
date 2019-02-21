var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Blocks HTML characters (security equivalent to htmlentities in PHP)
    fs = require('fs');

var globals = require('./globals.js'); 


//----
//const http = require('mitol');

// Loading the page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket, username) {
    // When the username is received it’s stored as a session variable and informs the other people
    socket.on('new_client', function(username) {
        username = ent.encode(username);
        socket.username = username;
        socket.broadcast.emit('new_client', username);
    });

    // When a message is received, the client’s username is retrieved and sent to the other people
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {username: socket.username, message: message});
    }); 
});

var port =process.env.PORT || '3000';
console.log("port"+ port);
//app.listen(process.env.PORT || '3000');
app.listen(port, function () {
	  var addr = app.address();
	  console.log('   app listening on http://' + addr.address + ':' + addr.port);
	});

/*app.listen(8080, '9.251.54.221', function() {
    console.log('Listening to port:  ' + 8080);
});*/


