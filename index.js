require("@babel/core").transform("code");

let checkWord = require('check-word'),
    words     = checkWord('en'); // setup the language for check, default is en

let list =  require('./list.js');

list = list.list;



const getRandomLetters = (number) => {
    let letter = [];
    let finalList = [];
    for (let [first, second] of Object.entries(list)) {
        // Ternary conditional that appends etaoin shrdlu twice and then does random selection of da letters
        second > 1 ? letter = letter.concat( new Array(second).fill(first)): letter.push(first);
    }
    for(const x of Array(number).keys()){
        // takes random element of array with duplicates for more common letters, push to the final list
        finalList.push(letter[Math.floor(Math.random() * letter.length)]);
    }
    return finalList;
}

console.log(getRandomLetters(15));


    
console.log(words.check('dog')); // true
words.check('perro'); // false
words.check('hi'); // true