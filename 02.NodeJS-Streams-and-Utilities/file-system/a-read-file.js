const fs = require('fs');
const fsPromises = require('fs/promises');

//Synchronous reading
const inputText = fs.readFileSync('./input.txt', 'utf8');
console.log(inputText);

//Asynchronous reading
fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err){
        console.log(err);
        return
    }
    console.log(data);
});

console.log('after async');

//Asynchronous reading with promises
fsPromises.readFile('./input.txt', {encoding: 'utf8'})
    .then(result => console.log(result))
    .then(err => console.log(err));


