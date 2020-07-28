require("@babel/core").transform("code");

let checkWord = require('check-word'),
    words = checkWord('en'); // setup the language for check, default is en

let list = require('./list.js');

list = list.list;

// source: https://codereview.stackexchange.com/a/7042

function getCombinations(letters, currentWord)
{
    //THIS IS A RECURSIVE FUNCTION!!!
    //It gets a bit slow if you do 10 or more letters since it would have to make over 9 million combos
    //But for anything less than that it will run in a split second :))
    //Kinda glad we only need 6 letters hehe
    //If anything here doesn't make sense, ask Rachel :))
    for(var i = 0; i < letters.length; i++)
    {
      var lett = letters.shift(); //remove first letter so it is not added to the same word twice
      currentWord += lett; //add the letter to current word
      allWords.push(currentWord); //add the current word to the list
      if(letters.length > 0) //if there's more letters that havent been added to the current word yet
        getCombinations(letters, currentWord); //recur to add the remaining letters to the current word 
      letters.push(lett); //add the letter you removed earlier to the end of the list so it will be included in the next words
      currentWord = currentWord.slice(0, -1); //remove the last letter you added so you can add a different letter next time
    }
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
    let results = getCombinations(array)
    let wordArray = []
    console.log(array)
    // console.log(results)
    for (result of results) {
        if (words.check(result)) {
            wordArray.push(result)
        }
    }
    return wordArray
}

var allWords = [];
getCombinations(['a', 'b', 'c', 'd'], "", 0);
console.log(allWords);
//console.log(getWords(getRandomLetters(10)));