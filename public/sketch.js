// Rachel Fernandes
// Based off of Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/ZjVyKXp9hec

// Keep track of our socket connection
var socket;
var player;
var opponent;
var game;
var players = {};

function setup() {
  createCanvas(200, 200);

  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect(window.location.hostname); //'http://localhost:3000'

  socket.on('allPlayerData', function(data) { 
    players = {};
    for (var key in data)
        if (data.hasOwnProperty(key))          
            players[data[key].name] = data[key];
    console.log(players);
  }); 
  socket.on('gameData', function(data) { 
    game = data;
    console.log("gameData", data);
  }); 

  document.getElementById("playerButton").onclick = function (){
    var n = document.getElementById("playerInput").value;
    console.log("players", players);

    if(n in players)
    {
      document.getElementById("playerText").innerHTML = "That username is taken. Try again";
      console.log("Username " + n + " was taken.");
    }
    else
    {
      player = new Player(n, 0);
      console.log({ name: player.name, score: player.score, hasOpponent: player.hasOpponent });
      socket.emit('start', {name: player.name});
      document.getElementById("playerText").innerHTML = playerString(player);
      console.log("Player name set to " + player.name);
    }
  }

  document.getElementById("opponentButton").onclick = function (){
    //set player name to input
    var n = document.getElementById("opponentInput").value;
    if(n in players)
    {
      if(players[n].hasOpponent)
      {
        document.getElementById("opponentText").innerHTML = "That opponent was taken. Try again";
        console.log("Opponent " + n + " was taken.");
      }
      else
      {
        opponent = players[n];
        socket.emit('pairUp', { id: opponent.id });
        console.log("pair up emitted");
        player.hasOpponent = true;
        document.getElementById("opponentText").innerHTML = opponent.name + " " + opponent.id;
        console.log("chose opponent " + opponent.name);
      }
    }
    else
    {
      document.getElementById("opponentText").innerHTML = "That opponent does not exist. Try again";
      console.log("Opponent " + n + "does not exist.");
    }
  }
}

function draw() 
{
  background(0);
}

function gameOver() //to be called when the timer runs out
{
    player.update();
}

function playerString(p)
{
    return `Player: ${ p.name } Score: ${ p.score }`;
}

function Player(name, score) {
  this.name = name;
  this.score = score;
  this.hasOpponent = false;

  this.update = function()
  {
    socket.emit('update', { name: this.name, score: this.score });
  }
}


