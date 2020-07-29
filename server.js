// Rachel Fernandes
// Based off of Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/ZjVyKXp9hec

// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html

var players = {};
var games = {};

function Player(id, name) {
  this.id = id;
  this.name = name;
  this.score = 0;
  this.hasOpponent = false;
}

function Game(p1, p2) {
  this.player1 = p1;
  this.player2 = p2;
  this.letters = ['a', 'b', 'c', 'd', 'e', 'f'];
  this.winner;
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
      console.log(socket.id + ' ' + data.name);
      players[socket.id] = new Player(socket.id, data.name);
      console.log(players);
    });

    socket.on('update', function(data) {      
      players[socket.id].name = data.name;
      players[socket.id].score = data.score;
    });

    socket.on('pairUp', function(data) {      
      var g = new Game(players[socket.id], players[data.id]);
      games[socket.id] = g;
      games[data.id] = g;
      console.log(games);
    });

    socket.on('disconnect', function(reason) {
      // Reconnect the socket if the disconnect was caused by the server
      if (reason === 'io server disconnect')
        socket.connect();
      else
      {
        console.log('Player ' + socket.id +' has disconnected');
        delete players[socket.id];
      }
    });

  }
);
