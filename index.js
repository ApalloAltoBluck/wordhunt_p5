let list = {
    'a': 3,
    'b': 1,
    'c': 1,
    'd': 2,
    'e': 3,
    'f': 1,
    'g': 1,
    'h': 2,
    'i': 3,
    'j': 1,
    'k': 1,
    'l': 2,
    'm': 1,
    'n': 2,
    'o': 3,
    'p': 1,
    'q': 1,
    'r': 2,
    's': 2,
    't': 2,
    'u': 3,
    'v': 1,
    'w': 1,
    'x': 1,
    'y': 1,
    'z': 1,
};


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

console.log(getRandomLetters(8));