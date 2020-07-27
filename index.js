require("@babel/core").transform("code");

let checkWord = require('check-word'),
    words = checkWord('en'); // setup the language for check, default is en

let list = require('./list.js');

list = list.list;

// source: https://codereview.stackexchange.com/a/7042
function getCombinations(chars) {
    var result = [];
    var f = function (prefix, chars) {
        for (var i = 0; i < chars.length; i++) {
            result.push(prefix + chars[i]);
            f(prefix + chars[i], chars.slice(i + 1));
        }
    }
    f('', chars);
    return result;
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

console.log(getWords(getRandomLetters(10)));