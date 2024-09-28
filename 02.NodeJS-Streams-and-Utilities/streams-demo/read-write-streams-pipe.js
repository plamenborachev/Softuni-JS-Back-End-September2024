const fs = require('fs');

const readableStream = fs.createReadStream('./lorem.txt', {
    encoding: 'utf-8'
});

const writeStream = fs.createWriteStream('./lorem-copy.txt', {
    encoding: 'utf-8'
});

// readableStream.on('data', (chunk) => {
//     writeStream.write(chunk);
// });

// readableStream.on('end', () => {
//     writeStream.end();
// });

readableStream.pipe(writeStream);