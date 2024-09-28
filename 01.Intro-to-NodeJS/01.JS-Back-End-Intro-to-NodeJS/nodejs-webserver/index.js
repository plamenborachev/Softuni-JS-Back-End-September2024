const http = require('http');

const server = http.createServer((req, res) => {
    console.log(`Incomming HTTP Request -> ${req.url}`);

    res.writeHead(200, {
        'content-type': 'text/html',
    });

    if (req.url === '/cats') {
        res.write('<h1>Cats!</h1>');
    } else {
        res.write('<h1>Hello From Node.js Web Server!</h1>');
    }

    res.end();
});

server.listen(5000);
console.log('Server is running on http://localhost:5000...');
