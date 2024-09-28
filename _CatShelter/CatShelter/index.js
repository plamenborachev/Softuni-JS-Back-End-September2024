const http = require('http');
const port = 5000;
const handlers = require('./handlers');

const server = http.createServer((req, res) => {
    /*res.writeHead(200, {
        'Content-Type': 'text/plain'
    });

    res.write('Hello from Node.js');
    res.end();*/

    for (let handler of handlers) {
        if (!handler(req, res)){
            break;
        }        
    }
});

server.listen(port);
console.log(`Server is listening on http://localhost:${port}`);