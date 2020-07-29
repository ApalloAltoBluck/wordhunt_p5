// Rachel Fernandes
// Based off of Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/ZjVyKXp9hec
// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html

//Oliver's letter/word code below
require("@babel/core").transform("code");

let checkWord = require('check-word'),
    words = checkWord('en'); // setup the language for check, default is en

let list = require('./list.js');

list = list.list;


let comboWrapper = (letters) => {
    let currentWord = '';
    let allWords = [];

    getCombinations(letters,currentWord);
    function getCombinations(letters, currentWord) {
        for (let i = 0; i < letters.length; i++) {
            let lett = letters.shift(); //remove first letter so it is not added to the same word twice
            currentWord += lett; //add the letter to current word
            allWords.push(currentWord); //add the current word to the list
            if (letters.length > 0) {//if there's more letters that havent been added to the current word yet
                getCombinations(letters, currentWord); //recur to add the remaining letters to the current word 
            }
            letters.push(lett); //add the letter you removed earlier to the end of the list so it will be included in the next words
            currentWord = currentWord.slice(0, -1); //remove the last letter you added so you can add a different letter next time
        }
    }
    return allWords
}


const getRandomLetters = (number) => {
    let letter = [];
    let finalList = [];
    for (let [first, second] of Object.entries(list)) {
        // Ternary conditional that appends etaoin shrdlu twice and then does random selection of da letters
        second > 1 ? letter = letter.concat(new Array(second).fill(first)) : letter.push(first);
    }
    for (const x of Array(number).keys()) {
        // takes random element of array with duplicates for more common letters, push to the final list
        finalList.push(letter[Math.floor(Math.random() * letter.length)]);
    }
    return finalList;
}


const getWords = (array) => {
    let results = comboWrapper(array)
    let wordArray = []
    console.log(array)
    for (result of results) {
        if (words.check(result)) {
            wordArray.push(result)
        }
    }
    return wordArray
}

//console.log(getWords(getRandomLetters(5)));


//Rachel's server code below

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
  this.letters = getRandomLetters(6); //call oliver's function to get random letters
  this.words = getWords(this.letters); //call oliver's function to get possible words from letters
  this.winner;
}

var express = require('express'); // Using express: http://expressjs.com/
var app = express();
var server = app.listen(process.env.PORT || 3000, listen); // process.env.PORT is related to deploying on heroku

function listen() // This call back just tells us that the server has started
{
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at http://' + host + ':' + port);
}

app.use(express.static('public'));
var io = require('socket.io')(server);

//setInterval(heartbeat, 33);
//function heartbeat() {
//  io.sockets.emit('heartbeat', players);
//}

function sendGameData(id) 
{
  io.to(id).emit('gameData', games[id]);
}

// Callback runs for each individual user that connects
io.sockets.on('connection',
  function(socket)
  {
    console.log('We have a new player: ' + socket.id);
    
    socket.on('start', function(data) 
    {
      console.log(socket.id + ' ' + data.name);
      players[socket.id] = new Player(socket.id, data.name);
      console.log('players', players);
      io.sockets.emit('allPlayerData', players);
    });

    socket.on('update', function(data) 
    {      
      players[socket.id].name = data.name;
      players[socket.id].score = data.score;
    });

    socket.on('pairUp', function(data) 
    { 
      players[socket.id].hasOpponent = true;
      players[data.id].hasOpponent = true;
      io.sockets.emit('allPlayerData', players);     
      var g = new Game(players[socket.id], players[data.id]);
      games[socket.id] = g;
      games[data.id] = g;
      console.log('games', games);
      sendGameData(socket.id);
      sendGameData(data.id);
    });

    socket.on('disconnect', function(reason) 
    {
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
