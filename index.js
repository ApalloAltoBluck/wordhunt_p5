require("@babel/core").transform("code");

let checkWord = require('check-word'),
    words = checkWord('en'); // setup the language for check, default is en

let list = require('./list.js');

list = list.list;

// source: https://codereview.stackexchange.com/a/7042

function getCombinations(letters, currentWord)
{
  for(var i = 0; i < letters.length; i++)
  {
    currentWord += letters[i];
      if (currentWord.length < letters.length) 
        getCombinations(letters, currentWord);
      allWords.push(currentWord);
      currentWord = currentWord.slice(0, -1);
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
getCombinations(['a', 'b', 'c'], "");
console.log(allWords);
//console.log(getWords(getRandomLetters(10)));