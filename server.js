// Rachel Fernandes
// Based off of Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/ZjVyKXp9hec

// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html

var players = [];

function Player(id, name, score) {
  this.id = id;
  this.name = name;
  this.score = score;
  this.hasOpponent = false;
}

// Using express: http://expressjs.com/
var express = require('express');
// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);
//io.on('connection', function(client){});
//io.listen(3000, {
//  SameSite: none,
//  Secure
//});

setInterval(heartbeat, 33);

function heartbeat() {
  io.sockets.emit('heartbeat', players);
}

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on(
  'connection',
  // We are given a websocket object in our function
  function(socket) {
    console.log('We have a new player: ' + socket.id);
    
    socket.on('start', function(data) {
      console.log(socket.id + ' ' + data.name + ' ' + data.score);
      players.push(new Player(socket.id, data.name, data.score));
    });

    socket.on('update', function(data) {      
      var playa;
      for (var i = 0; i < players.length; i++)
        if (socket.id == players[i].id) 
          playa = players[i];
        
      if(playa != undefined)
      {
        playa.name = data.name;
        playa.score = data.score; 
      }
    });

    socket.on('disconnect', function(reason) {
      // Reconnect the socket if the disconnect was caused by the server
      if (reason === 'io server disconnect')
        socket.connect();
      else
        console.log('Player ' + socket.id +' has disconnected');
    });

  }
);
