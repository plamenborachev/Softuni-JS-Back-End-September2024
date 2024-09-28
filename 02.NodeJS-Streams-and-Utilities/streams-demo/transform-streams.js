const fs = require('fs');
const zlib = require('zlib');

const readStream = fs.createReadStream('./lorem.txt', {
    encoding: 'utf-8'
});

const writeStream = fs.createWriteStream('./lorem-gzip.txt', {
    encoding: 'utf-8'
});

let gzip = zlib.createGzip();

readStream.pipe(gzip).pipe(writeStream);