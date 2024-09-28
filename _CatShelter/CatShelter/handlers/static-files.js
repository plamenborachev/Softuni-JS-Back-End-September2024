const url = require('url');
const fs = require('fs');
const getContentType = require("./getContentType");

module.exports = (req, res) => {
    if (req.url.startsWith('/content') && req.method === 'GET'){
        if (req.url.endsWith('png') || req.url.endsWith('jpg') || req.url.endsWith('jpeg') || req.url.endsWith('ico') || req.url.endsWith('webp')){
            fs.readFile(`./${req.url}`, (error, data) => {
                if (error) {
                    console.log(error);
                    res.writeHead(404, {
                        "Content-Type": "text/plain"
                    });
                    res.write("Error was found!\n");
                    res.end();
                    return;
                }
    
                res.writeHead(200, {
                    "Content-Type": getContentType(req.url)
                });
                res.write(data);
                res.end();
            });
        } else {
            fs.readFile(`./${req.url}`, "utf-8", (error, data) => {
                if (error) {
                    console.log(error);
                    res.writeHead(404, {
                        "Content-Type": "text/plain"
                    });
                    res.write("Error was found!\n");
                    res.end();
                    return;
                }

                res.writeHead(200, {
                    "Content-Type": getContentType(req.url)
                });
                res.write(data);
                res.end();
            });
        }
    } else {
        return true;
    }
}