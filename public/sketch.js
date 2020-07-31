// Rachel Fernandes
// Keep track of our socket connection

console.log("hi");

//UI/UX Stuffs
let button,
  scoreCard,
  myScore,
  opponentCard,
  opponentScore,
  testLetter,
  nameInputBox,
  partnerInputBox,
  timerValue,
  woodBackground,
  submitButton,
  submitOpponent,
  releasedLetters,
  pushed,
  opponentName,
  xPositions,
  yPositions,
  userClickedLetters,
  countLetters,
  letterToMove,
  letterToMoveInd;
let letterBoxes = [];
let letterTiles = [];

//Socket stuffs
let socket, player, opponent, game;
let players = {};


function Player(name, score) {
  this.name = name;
  this.score = score;
  this.hasOpponent = false;
  this.foundWords = new Set();
  this.update = function()
  {
    socket.emit('update', { name: this.name, score: this.score });
  }
}


function playerString(p) {
  return `Player: ${p.name} Score: ${p.score}`;
}

function setup() {
  // Canvas & color settings


  createCanvas(800, 800);
  colorMode(RGB, 255);
  backgroundColor = color(156, 143, 173);
  releasedLetters = [];
  userClickedLetters = [];
  countLetters = 0;
  myScore = 0;
  opponentScore = 0;
  pushed = false;
  // createLetters();
  //JUST PUTTING THESE TWO LETTERS TO TEST

  woodBackground = createImg(
    "https://cdn.glitch.com/d66db9a2-678a-44dd-b3a0-061d10374d19%2Fupdated-wooden-bg.svg?v=1595980097536",
    "wood background"
  );
  woodBackground.size(800, 800);
  woodBackground.position(5, 5);
 

  //more socket stuff
  
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
  

  //input boxes for name
  nameInputBox = createInput("Input Your Name");
  nameInputBox.position(350, 350);

  submitButton = createButton("SUBMIT");
  submitButton.position(
    350 + nameInputBox.width / 2 - submitButton.width / 2,
    430
  );
  submitButton.mousePressed(handlePlayerInput);

  //check if names are valid
  //if they are valid

  xPositions = [125, 215, 305, 395, 485, 575];
  yPositions = [335, 425];
}

function handlePlayerInput() {
  var n = nameInputBox.value();

    console.log("players", players);
    if(n in players)
    {
      alert("That username is taken. Try again");
      console.log("Username " + n + " was taken.");
    }
    else
    {
  
  player = new Player(n, 0);
  console.log({
    name: player.name,
    score: player.score,
    hasOpponent: player.hasOpponent
  });
  socket.emit('start', {name: player.name});
  console.log("Player name set to " + player.name);
  submitButton.mousePressed(startRequest);
  partnerInputBox = createInput("Opponent Name");
  partnerInputBox.position(350, 390);
  }
}

function startRequest() {
  hideStartItems();
  var n = partnerInputBox.value();

  
    if(n in players)
    {
      if(players[n].hasOpponent)
      {
        alert("That opponent was taken. Try again");
        console.log("Opponent " + n + " was taken.");
      }
      else
      {
  

        opponent = players[n];
        socket.emit('pairUp', { id: opponent.id });
  
  opponentName = n;
  console.log(opponentName);
  console.log("pair up emitted");
  player.hasOpponent = true;
  console.log("chose opponent " + n);
  
        document.getElementById("opponentText").innerHTML = opponent.name + " " + opponent.id;
      }
    }
    
  
    else
    {
      alert("That opponent does not exist. Try again");
      console.log("Opponent " + n + "does not exist.");
    }
  

  startButton = createButton("START GAME");
  startButton.mouseClicked(setLetterBoxes);
  startButton.size(200, 100);
  //startButton.position(310, 350); MIDDLE OF SCREEN
  startButton.position(310, 360);
  startButton.style("font-family", "Arial");
  startButton.style("font-size", "32px");
}

function hideStartItems() {
  console.log("she really is hiding everything.");
  nameInputBox.hide();
  partnerInputBox.hide();
  submitButton.hide();
}


function draw() {
  //pressLetter(game.letters[q], q)
}

function translation(l, i) {
  //We want to check if any one of the letters have been pressed

  if (userClickedLetters.length < 6) {
    userClickedLetters += letterToMove;
    console.log("Placing letter " + l);
    if (userClickedLetters.length == 1) {
      letterTiles[i].position(xPositions[0], yPositions[0]);
      displayLetterUpOne(l);
    } else if (userClickedLetters.length == 2) {
      letterTiles[i].position(xPositions[1], yPositions[0]);
      displayLetterUpTwo(l);
    } else if (userClickedLetters.length == 3) {
      letterTiles[i].position(xPositions[2], yPositions[0]);
      displayLetterUpThree(l);
    } else if (userClickedLetters.length == 4) {
      letterTiles[i].position(xPositions[3], yPositions[0]);
      displayLetterUpFour(l);
    } else if (userClickedLetters.length == 5) {
      letterTiles[i].position(xPositions[4], yPositions[0]);
      displayLetterUpFive(l);
    } else {
      letterTiles[i].position(xPositions[5], yPositions[0]);
      displayLetterUpSix(l);
    }

    if (i == 0) {
      displayLetterOne(" ");
    } else if (i == 1) {
      displayLetterTwo(" ");
    } else if (i == 2) {
      displayLetterThree(" ");
    } else if (i == 3) {
      displayLetterFour(" ");
    } else if (i == 4) {
      displayLetterFive(" ");
    } else if (i == 5) {
      displayLetterSix(" ");
    }
  }
}

function gameOver() //to be called when the timer runs out
{
    player.update();
}

function setLetterBoxes() {
  startButton.hide();
  console.log("timer do be going.");
  //createLetters();
  createGrayBoxes();
  timerCountdown();
  typeOpponentName();
  typeNames();

  //score
  scoreCard = createImg(
    "https://cdn.glitch.com/d66db9a2-678a-44dd-b3a0-061d10374d19%2Fplayer-1-score-bg.svg?v=1595979072870"
  );
  scoreCard.size(1000, 700);
  scoreCard.position(-90, -140);

  opponentCard = createImg(
    "https://cdn.glitch.com/d66db9a2-678a-44dd-b3a0-061d10374d19%2Fplayer-2-score-bg.svg?v=1595979077930"
  );
  opponentCard.size(800, 500);
  opponentCard.position(280, -180);

  enterButtonUp = createImg(
    "https://cdn.glitch.com/d66db9a2-678a-44dd-b3a0-061d10374d19%2Fnew-button.svg?v=1596137120102"
  );
  enterButtonUp.position(330, 550);
  enterButtonUp.size(150, 150);
  enterButtonUp.mousePressed(dictionaryVerif);

  console.log("Can we see this?");

  for (var q = 0; q < 6; q++) {
    letterTiles.push(
      createImg(
        "https://cdn.glitch.com/d66db9a2-678a-44dd-b3a0-061d10374d19%2Fblank-release.svg?v=1596119411539"
      )
    );
    letterTiles[q].size(70, 70);
    letterTiles[q].position(xPositions[q], yPositions[1]);
    console.log("Can we see this?");
  }

  letterTiles[0].mousePressed(function() {
    console.log("letter pressed");
    letterToMove = game.letters[0];
    letterToMoveInd = 0;
    console.log(letterToMove);
    console.log("letterToMoveInd", letterToMoveInd);
    translation(letterToMove, letterToMoveInd);
  });

  letterTiles[1].mousePressed(function() {
    console.log("letter pressed");
    letterToMove = game.letters[1];
    letterToMoveInd = 1;
    console.log(letterToMove);
    console.log("letterToMoveInd", letterToMoveInd);
    translation(letterToMove, letterToMoveInd);
  });

  letterTiles[2].mousePressed(function() {
    console.log("letter pressed");
    letterToMove = game.letters[2];
    letterToMoveInd = 2;
    console.log(letterToMove);
    console.log("letterToMoveInd", letterToMoveInd);
    translation(letterToMove, letterToMoveInd);
  });

  letterTiles[3].mousePressed(function() {
    console.log("letter pressed");
    letterToMove = game.letters[3];
    letterToMoveInd = 3;
    console.log(letterToMove);
    console.log("letterToMoveInd", letterToMoveInd);
    translation(letterToMove, letterToMoveInd);
  });

  letterTiles[4].mousePressed(function() {
    console.log("letter pressed");
    letterToMove = game.letters[4];
    letterToMoveInd = 4;
    console.log(letterToMove);
    console.log("letterToMoveInd", letterToMoveInd);
    translation(letterToMove, letterToMoveInd);
  });

  letterTiles[5].mousePressed(function() {
    console.log("letter pressed");
    letterToMove = game.letters[5];
    letterToMoveInd = 5;
    console.log(letterToMove);
    console.log("letterToMoveInd", letterToMoveInd);
    translation(letterToMove, letterToMoveInd);
  });

  //0 1 2 3 4 5
  /*letterTiles.push(
      createImg(
        "https://cdn.glitch.com/d66db9a2-678a-44dd-b3a0-061d10374d19%2Fblank-release.svg?v=1596119411539"
      )
    );*/

  displayLetterOne(game.letters[0]);
  displayLetterTwo(game.letters[1]);
  displayLetterThree(game.letters[2]);
  displayLetterFour(game.letters[3]);
  displayLetterFive(game.letters[4]);
  displayLetterSix(game.letters[5]);

  /*displayLetterUpOne(game.letters[0]);
  displayLetterUpTwo(game.letters[1]);
  displayLetterUpThree(game.letters[2]);
  displayLetterUpFour(game.letters[3]);
  displayLetterUpFive(game.letters[4]);
  displayLetterUpSix(game.letters[5]);*/
}

function dictionaryVerif() {
  if(!player.foundWords.has(userClickedLetters) && game.words.has(userClickedLetters))
  {
    console.log(userClickedLetters + " was valid");
    player.score += 100 * userClickedLetters.length;
    player.foundWords.add(userClickedLetters);
  }
  else
  {
    console.log(userClickedLetters + " was invalid");
  }
  userClickedLetters = "";
  //code to move letters back to their spaces 
}
function timeIsUp() {
  //hide enter button
  // hide blocks + letters
  // show "time is up graphic"
  // display score of offense & defense
  /* make an if statement, if offenseScore > defenseScore,
  else if defenseScore > offenseScore,
 else if defenseScore === offenseScore
  */
}
function timerCountdown() {
  var seconds = 60,
    $seconds = document.querySelector("#countdown");
  (function countdown() {
    $seconds.textContent = seconds + " second" + (seconds == 1 ? "" : "s");
    if (seconds-- > 0) setTimeout(countdown, 1000);
  })();
  if (seconds == 0) {
    timeIsUp();
  }
  //INTEGRATE WITH OLIVER
}

function typeNames() {
  var name = player.name;
  $name = document.querySelector("#printName");
  (function printName() {
    $name.textContent = player.name;
  })();
  console.log(nameInputBox.value());
}

function typeOpponentName() {
  var name = opponentName;
  $name = document.querySelector("#printOpponentName");
  (function printOpponentName() {
    $name.textContent = opponentName;
  })();
  console.log(partnerInputBox.value());
}

function displayLetterOne(l) {
  var choice1;
  $choice1 = document.querySelector("#displayLetter1");
  (function displayLetter1() {
    console.log(l);
    $choice1.textContent = l;
    console.log("if this works, then yay letter 1");
  })();
}

function displayLetterTwo(l) {
  var choice1;
  $choice1 = document.querySelector("#displayLetter2");
  (function displayLetter2() {
    console.log(l);
    $choice1.textContent = l;
    console.log("if this works, then yay letter 2");
  })();
}

function displayLetterThree(letterrrr) {
  var choice1;
  $choice1 = document.querySelector("#displayLetter3");
  (function displayLetter3() {
    console.log(letterrrr);
    $choice1.textContent = letterrrr;
    console.log("if this works, then yay letter 3");
  })();
}

function displayLetterFour(letterrrr) {
  var choice1;
  $choice1 = document.querySelector("#displayLetter4");
  (function displayLetter4() {
    console.log(letterrrr);
    $choice1.textContent = letterrrr;
    console.log("if this works, then yay letter 4");
  })();
}

function displayLetterFive(letterrrr) {
  var choice1;
  $choice1 = document.querySelector("#displayLetter5");
  (function displayLetter5() {
    console.log(letterrrr);
    $choice1.textContent = letterrrr;
    console.log("if this works, then yay letter 5");
  })();
}

function displayLetterSix(letterrrr) {
  var choice1;
  $choice1 = document.querySelector("#displayLetter6");
  (function displayLetter6() {
    console.log(letterrrr);
    $choice1.textContent = letterrrr;
    console.log("if this works, then yay letter 6");
  })();
}

function displayLetterUpOne(l) {
  var choice;
  $choice = document.querySelector("#displayLetterUp1");
  (function displayLetterUp1() {
    console.log(l);
    $choice.textContent = l;
    console.log("if this works, then yay letter 1");
  })();
}
function displayLetterUpTwo(l) {
  var choice;
  $choice = document.querySelector("#displayLetterUp2");
  (function displayLetterUp2() {
    console.log(l);
    $choice.textContent = l;
    console.log("if this works, then yay letter 1");
  })();
}
function displayLetterUpThree(l) {
  var choice;
  $choice = document.querySelector("#displayLetterUp3");
  (function displayLetterUp3() {
    console.log(l);
    $choice.textContent = l;
    console.log("if this works, then yay letter 1");
  })();
}
function displayLetterUpFour(l) {
  var choice;
  $choice = document.querySelector("#displayLetterUp4");
  (function displayLetterUp4() {
    console.log(l);
    $choice.textContent = l;
    console.log("if this works, then yay letter 1");
  })();
}
function displayLetterUpFive(l) {
  var choice;
  $choice = document.querySelector("#displayLetterUp5");
  (function displayLetterUp5() {
    console.log(l);
    $choice.textContent = l;
    console.log("if this works, then yay letter 1");
  })();
}
function displayLetterUpSix(l) {
  var choice;
  $choice = document.querySelector("#displayLetterUp6");
  (function displayLetterUp6() {
    console.log(l);
    $choice.textContent = l;
    console.log("if this works, then yay letter 1");
  })();
}

function createGrayBoxes() {
  for (var q = 0; q < 6; q++) {
    let i = createImg(
      "https://cdn.glitch.com/d66db9a2-678a-44dd-b3a0-061d10374d19%2Fupdated-gray-slot.svg?v=1595979263009"
    );
    i.size(70, 70);
    i.position(xPositions[q], yPositions[0]);
    letterBoxes.push(i);
  }
}


