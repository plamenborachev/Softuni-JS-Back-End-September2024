const fs = require('fs');

const readableStream = fs.createReadStream('./lorem.txt', {
    encoding: 'utf-8',
    highWaterMark: 1000 //chunk size
});

readableStream.on('data', (chunk) => {
    console.log('------------NEW CHUNK--------------');
    console.log(chunk);
});

readableStream.on('end', () => {
    console.log('Readable stream closed');
});

readableStream.on('close', () => {
    console.log('Readable stream closed');
});