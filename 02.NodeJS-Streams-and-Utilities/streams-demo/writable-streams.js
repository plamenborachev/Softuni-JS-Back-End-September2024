const fs = require('fs');

const writeStream = fs.createWriteStream('./output.txt', {
    encoding: 'utf-8',
    flags: 'a' //to add to file, not to overwrite
});

writeStream.write('Hello!\n');
writeStream.write('My name is Pesho');

writeStream.end();


