// Rachel Fernandes, Kyla Guru, Priscilla Maryanski

//UI/UX Stuffs
let scoreCard,
  opponentCard,
  testLetter,
  nameInputBox,
  partnerInputBox,
  woodBackground,
  submitButton,
  submitOpponent,
  opponentName,
  xPositions,
  yPositions,
  letterToMove,
  letterToMoveInd;
let on1 = false;
let on2 = false;
let on3 = false;
let on4 = false;
let on5 = false;
let on6 = false;
let timesUp = false;
let opponentScore = 0;
let letterBoxes = [];
let letterTiles = [];
let releasedLetters = [];
let userClickedLetters = "";
let words;
let receivedOpponentScore = false;

//Socket stuffs
let socket, player, opponent, game;
let players = {};

//Holds player info
function Player(name, score) {
  this.name = name;
  this.score = score;
  this.hasOpponent = false;
  this.foundWords = new Set();
}

function setup() {
  console.log("Starting setup!");
  // Canvas & color settings
  createCanvas(800, 800);
  colorMode(RGB, 255);
  backgroundColor = color(156, 143, 173);
    countLetters = 0;
  myScore = 0;
  opponentScore = 0;
  pushed = false;
  woodBackground = createImg(
    "https://cdn.glitch.com/d66db9a2-678a-44dd-b3a0-061d10374d19%2Fupdated-wooden-bg.svg?v=1595980097536",
    "wood background"
  );
  woodBackground.size(800, 800);
  woodBackground.position(5, 5);
 
  //more socket stuff 
  //socket = io.connect('http://localhost:3000');
  socket = io.connect(window.location.hostname);
  socket.on('allPlayerData', function(data) { 
    players = {};
    for (var key in data)
        if (data.hasOwnProperty(key))          
            players[data[key].name] = data[key];
    console.log(players);
  }); 
  socket.on('gameData', function(data) { 
    game = data;
    player.hasOpponent = true;
    game.letters = shuffle(game.letters);
    words = new Set(game.words);
    console.log("gameData", data);
  });
  socket.on('opponentChoseMe', function(data) {
    opponent = players[data.name];
    opponentName = data.name;
    player.hasOpponent = true;
    console.log("opponent " + data.name + " chose me");
    hideStartItems();
    startButton = createButton("START GAME");
    startButton.mouseClicked(setLetterBoxes);
    startButton.size(200, 100);
    startButton.position(310, 360);
    startButton.style("font-family", "Arial");
    startButton.style("font-size", "32px");
  });
  socket.on('opponentScore', function(data) {
    opponent.score = data.score;
    receivedOpponentScore = true;
    console.log("opponentscore", opponent.score);
  });

  //Input for username and opponent
  nameInputBox = createInput("Input Your Name");
  nameInputBox.position(350, 350);
  submitButton = createButton("SUBMIT");
  submitButton.position(350 + nameInputBox.width / 2 - submitButton.width / 2, 430);
  submitButton.mousePressed(handlePlayerInput);
  xPositions = [125, 215, 305, 395, 485, 575];
  yPositions = [335, 425];
  noLoop();
  console.log("Done with setup!");
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
    socket.emit('start', {name: player.name});
    console.log("Player name set to " + player.name);
    submitButton.mousePressed(startRequest);
    partnerInputBox = createInput("Opponent Name");
    partnerInputBox.position(350, 390);
    submitButton.mousePressed(startRequest);
  }
}

function startRequest() {
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
      console.log("Pair up emitted");
      opponentName = n;
      player.hasOpponent = true;
      console.log("Chose opponent " + n);
      hideStartItems();
      startButton = createButton("START GAME");
      startButton.mouseClicked(setLetterBoxes);
      startButton.size(200, 100);
      startButton.position(310, 360);
      startButton.style("font-family", "Arial");
      startButton.style("font-size", "32px");
    }
  }
  else
  {
    alert("That opponent does not exist. Try again");
    console.log("Opponent " + n + "does not exist.");
  }
}

function hideStartItems() {
  console.log("She really is hiding everything.");
  nameInputBox.hide();
  partnerInputBox.hide();
  submitButton.hide();
}


function translation(l, i) {
  //Check if the string is within length
  if (userClickedLetters.length < 6) {
    userClickedLetters += letterToMove;
    console.log("Placing letter " + l);
    letterTiles[i].position( xPositions[userClickedLetters.length - 1], yPositions[0]);
    if (userClickedLetters.length == 1) {
      displayLetterUpOne(l);
    } else if (userClickedLetters.length == 2) {
      displayLetterUpTwo(l);
    } else if (userClickedLetters.length == 3) {
      displayLetterUpThree(l);
    } else if (userClickedLetters.length == 4) {
      displayLetterUpFour(l);
    } else if (userClickedLetters.length == 5) {
      displayLetterUpFive(l);
    } else {
      displayLetterUpSix(l);
    }

    if (i == 0) {
      displayLetterOne("");
    } else if (i == 1) {
      displayLetterTwo("");
    } else if (i == 2) {
      displayLetterThree("");
    } else if (i == 3) {
      displayLetterFour("");
    } else if (i == 4) {
      displayLetterFive("");
    } else if (i == 5) {
      displayLetterSix("");
    }
  }
}

function createLetterTiles() {
  for (var q = 0; q < letterTiles.length; q++) {
    letterTiles[q].hide();
  }
  letterTiles = [];

  for (var q = 0; q < 6; q++) {
    letterTiles.push(
      createImg(
        "https://cdn.glitch.com/d66db9a2-678a-44dd-b3a0-061d10374d19%2Fblank-release.svg?v=1596119411539"
      )
    );
    letterTiles[q].size(70, 70);
    letterTiles[q].position(xPositions[q], yPositions[1]);
  }

  letterTiles[0].mousePressed(function() {
    if (!on1 && !timesUp) {
      letterToMove = game.letters[0];
      letterToMoveInd = 0;
      console.log("letter pressed", letterToMove);
      console.log("letterToMoveInd", letterToMoveInd);
      on1 = true;
      translation(letterToMove, letterToMoveInd);
    }
  });

  letterTiles[1].mousePressed(function() {
    if (!on2 && !timesUp) {
      letterToMove = game.letters[1];
      letterToMoveInd = 1;
      console.log("letter pressed", letterToMove);
      console.log("letterToMoveInd", letterToMoveInd);
      on2 = true;
      translation(letterToMove, letterToMoveInd);
    }
  });

  letterTiles[2].mousePressed(function() {
    if (!on3 && !timesUp) {
      letterToMove = game.letters[2];
      letterToMoveInd = 2;
      console.log("letter pressed", letterToMove);
      console.log("letterToMoveInd", letterToMoveInd);
      on3 = true;
      translation(letterToMove, letterToMoveInd);
    }
  });

  letterTiles[3].mousePressed(function() {
    if (!on4 && !timesUp) {
      letterToMove = game.letters[3];
      letterToMoveInd = 3;
      console.log("letter pressed", letterToMove);
      console.log("letterToMoveInd", letterToMoveInd);
      on4 = true;
      translation(letterToMove, letterToMoveInd);
    }
  });

  letterTiles[4].mousePressed(function() {
    if (!on5 && !timesUp) {
      letterToMove = game.letters[4];
      letterToMoveInd = 4;
      console.log("letter pressed", letterToMove);
      console.log("letterToMoveInd", letterToMoveInd);
      on5 = true;
      translation(letterToMove, letterToMoveInd);
    }
  });

  letterTiles[5].mousePressed(function() {
    if (!on6 && !timesUp) {
      letterToMove = game.letters[5];
      letterToMoveInd = 5;
      console.log("letter pressed", letterToMove);
      console.log("letterToMoveInd", letterToMoveInd);
      on6 = true;
      translation(letterToMove, letterToMoveInd);
    }
  });
  console.log("letter tiles created");
}

function setLetterBoxes() {
  startButton.hide();
  createGrayBoxes();
  timerCountdown();
  console.log("Timer do be going.");
  typeOpponentName();
  scoreRealTime();
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

  createLetterTiles();

  //Display letter text
  displayLetterOne(game.letters[0]);
  displayLetterTwo(game.letters[1]);
  displayLetterThree(game.letters[2]);
  displayLetterFour(game.letters[3]);
  displayLetterFive(game.letters[4]);
  displayLetterSix(game.letters[5]);
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

function originalLocations() {
  //create all gray boxes and ensure they have no text
  console.log("original");

  for (var q = 0; q < 6; q++) {
    letterTiles[q].position(xPositions[q], yPositions[1]);
    console.log("tiles length: " + letterTiles.length);
  }

  createGrayBoxes();
  createLetterTiles();

  displayLetterUpOne("");
  displayLetterUpTwo("");
  displayLetterUpThree("");
  displayLetterUpFour("");
  displayLetterUpFive("");
  displayLetterUpSix("");

  displayLetterOne(game.letters[0]);
  displayLetterTwo(game.letters[1]);
  displayLetterThree(game.letters[2]);
  displayLetterFour(game.letters[3]);
  displayLetterFive(game.letters[4]);
  displayLetterSix(game.letters[5]);

  on1 = false;
  on2 = false;
  on3 = false;
  on4 = false;
  on5 = false;
  on6 = false;
}


function dictionaryVerif() {
  console.log(userClickedLetters);
  console.log(player.foundWords);
  console.log(words);
  if(!player.foundWords.has(userClickedLetters) && words.has(userClickedLetters))
  {
    console.log(userClickedLetters + " was valid");
    player.score += 100 * userClickedLetters.length;
    player.foundWords.add(userClickedLetters);
    scoreRealTime();
  }
  else
  {
    console.log(userClickedLetters + " was invalid");
  }
  //Move letters back to their spaces and clear the current word
  originalLocations();
  userClickedLetters = "";
}

function scoreRealTime() {
  var yourScore = player.score;
  $yourScore = document.querySelector("#printScoreRealTime");
  (function printScoreRealTime() {
    $yourScore.textContent = "Score: " + player.score;
  })();
  console.log(player.score);
}

function timerCountdown() {
  var seconds = 30,
    $seconds = document.querySelector("#countdown");
  (function countdown() {
    $seconds.textContent = seconds + " second" + (seconds == 1 ? "" : "s");
    if (seconds-- > 0)
      setTimeout(countdown, 1000);
    else {
      timeIsUp();
      timesUp = true;
    }
    })();
}

function timeIsUp() {
  socket.emit('playerScore', {score: player.score, opponent: opponent.id});
  //hide enter button
  enterButtonUp.hide();  
  timesUpImage = createImg(
    "https://cdn.glitch.com/d66db9a2-678a-44dd-b3a0-061d10374d19%2Ftimeisup.svg?v=1596163592001"
  );
  timesUpImage.position(300, 600);
  timesUpImage.size(200, 200);
  timesUpImage.mousePressed(dictionaryVerif); 
  
  showPlayerResults();
  loop();
}

function draw()
{
  if(opponent.score >= 0 || receivedOpponentScore)
  {
    showOpponentResults();
    noLoop();
  }
}

function showPlayerResults(){
  var playerScore = player.score;
  $playerScore = document.querySelector("#printPlayerScore");
  (function printPlayerScore() {
    $playerScore.textContent = "Your score: " + playerScore;
  })();
  console.log(player.score);
}

function showOpponentResults() {
  var opponentScore = opponent.name;
  $opponentScore = document.querySelector("#printOpponentScore");
  (function printOpponentScore() { //sorry! dont want to have two w the same name
    $opponentScore.textContent = opponent.name + "'s Score: " + opponent.score;
  })();
  console.log(opponent);
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
  var name = opponent.name;
  $name = document.querySelector("#printOpponentName");
  (function printOpponentName() {
    $name.textContent = opponent.name;
  })();
  console.log(partnerInputBox.value());
}

function displayLetterOne(l) {
  var choice1;
  $choice1 = document.querySelector("#displayLetter1");
  (function displayLetter1() {
    console.log(l);
    $choice1.textContent = l;
  })();
}

function displayLetterTwo(l) {
  var choice1;
  $choice1 = document.querySelector("#displayLetter2");
  (function displayLetter2() {
    console.log(l);
    $choice1.textContent = l;
  })();
}

function displayLetterThree(letterrrr) {
  var choice1;
  $choice1 = document.querySelector("#displayLetter3");
  (function displayLetter3() {
    console.log(letterrrr);
    $choice1.textContent = letterrrr;
  })();
}

function displayLetterFour(letterrrr) {
  var choice1;
  $choice1 = document.querySelector("#displayLetter4");
  (function displayLetter4() {
    console.log(letterrrr);
    $choice1.textContent = letterrrr;
  })();
}

function displayLetterFive(letterrrr) {
  var choice1;
  $choice1 = document.querySelector("#displayLetter5");
  (function displayLetter5() {
    console.log(letterrrr);
    $choice1.textContent = letterrrr;
  })();
}

function displayLetterSix(letterrrr) {
  var choice1;
  $choice1 = document.querySelector("#displayLetter6");
  (function displayLetter6() {
    console.log(letterrrr);
    $choice1.textContent = letterrrr;
  })();
}

function displayLetterUpOne(l) {
  var choice;
  $choice = document.querySelector("#displayLetterUp1");
  (function displayLetterUp1() {
    console.log(l);
    $choice.textContent = l;
  })();
}
function displayLetterUpTwo(l) {
  var choice;
  $choice = document.querySelector("#displayLetterUp2");
  (function displayLetterUp2() {
    console.log(l);
    $choice.textContent = l;
  })();
}
function displayLetterUpThree(l) {
  var choice;
  $choice = document.querySelector("#displayLetterUp3");
  (function displayLetterUp3() {
    console.log(l);
    $choice.textContent = l;
  })();
}
function displayLetterUpFour(l) {
  var choice;
  $choice = document.querySelector("#displayLetterUp4");
  (function displayLetterUp4() {
    console.log(l);
    $choice.textContent = l;
  })();
}
function displayLetterUpFive(l) {
  var choice;
  $choice = document.querySelector("#displayLetterUp5");
  (function displayLetterUp5() {
    console.log(l);
    $choice.textContent = l;
  })();
}
function displayLetterUpSix(l) {
  var choice;
  $choice = document.querySelector("#displayLetterUp6");
  (function displayLetterUp6() {
    console.log(l);
    $choice.textContent = l;
  })();
}



