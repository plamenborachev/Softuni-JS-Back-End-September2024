const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const formidable = require('formidable');
const breeds = require('../data/breeds');
const cats = require('../data/cats');

module.exports = (req, res) => {
    if (req.url === '/cats/add-cat' && req.method === 'GET'){         
        //console.log('/cats/add-cat GET...start');

        let filePath = path.normalize(path.join(__dirname, "../views/addCat.html"));
        //console.log('filePath => ' + filePath);

        const input = fs.createReadStream(filePath);   // fs.readFile() can be used as well
        //console.log('input => ' + input);

        input.on("data", (data) => {
            //console.log('data => ' + data);

            //console.log('breeds => ' + breeds);

            let catBreedPlaceholder = breeds.map((breed) => `<option value="${breed}">${breed}</option>`);    // It acts like 
            //console.log('catBreedPlaceholder => ' + catBreedPlaceholder);

            let modifiedData = data.toString().replace('{{catBreeds}}', catBreedPlaceholder);                              // proto handlebars
            //console.log('modifiedData => ' + modifiedData);

            res.write(modifiedData);
            //console.log('res => ' + res);
        });

        input.on("end", () => res.end());
        input.on("error", (err) => console.log(err));

        //console.log('/cats/add-cat GET...end');
    } else if (req.url === '/cats/add-breed' && req.method === 'GET'){
        let filePath = path.normalize(path.join(__dirname, "../views/addBreed.html"));
        const input = fs.createReadStream(filePath);   // fs.readFile() can be used as well

        input.on("data", (data) => res.write(data));
        input.on("end", () => res.end());
        input.on("error", (err) => console.log(err));
    } else if (req.url === '/cats/add-breed' && req.method === 'POST'){
        console.log("add-breed post start...");
        let filePath = path.normalize(path.join(__dirname, "../data/breeds.json"));
        console.log(filePath);

        // 1. Parse the incoming data from the form
        let formData = "";

        req.on("data", (data) => {
            console.log(data);
            formData += data;
        });

        req.on("end", () => {
            let body = qs.parse(formData);
            console.log(body);

            // 2. Read the breeds.json file
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    console.log("Error: ", err);
                    return;
                }

                let breeds = JSON.parse(data);
                console.log("breeds => " + breeds);
                
                let breed = body.breed;
                console.log("breed => " + breed);
                
                // 3. Modify the breeds.json file
                if (breed){
                    breeds.push(body.breed);                              
                
                    let json = JSON.stringify(breeds.sort());

                    // 4. Update the breeds.json file
                    fs.writeFile(filePath, json, () => console.log("The breed was uploaded successfully!"));

                    // 5. Redirect to the home page ('/') and end the response
                    res.writeHead(301, { "location": "/" });
                    res.end();          
                } else {
                    //alert("Please fill 'Breed Name'");
                    return true;
                }               
            });             
        });
    } else if (req.url === "/cats/add-cat" && req.method === "POST") {
        let form = new formidable.IncomingForm();           // form is used for processing various form data 
        form.parse(req, (err, fields, files) => {           // fields - passing info from form fields, files - from preset formidable
            if (err) throw err;
            console.log('fields => ' + JSON.stringify(fields));
            console.log('files => ' + JSON.stringify(files));

            // move of the uploaded file (in this case - picture)
            let oldPath = files['image'][0].filepath;                         // taking them from the default formidable folder
            console.log('oldPath => ' + oldPath);
            
            let fileName = files['image'][0].originalFilename;
            let newPath = path.normalize(path.join(__dirname, "../content/images/" + fileName));  // creating new path in my folder
            console.log('newPath => ' + newPath);

            fs.copyFile(oldPath, newPath, (err) => {                   // transfer     
                if (err) throw err;
                console.log("Files was uploaded sccessfully!");
            });

            // Add new object to cats.json
            fs.readFile("./data/cats.json", "utf-8", (err, data) => {
                if (err) throw err;

                let allCats = JSON.parse(data);                          // parsing to array of objects
                
                let name = fields['name'][0];
                let description = fields['description'][0];
                let breed = fields['breed'][0];

                allCats.push({ id: cats.length + 1, name: name, description: description, breed: breed, image: fileName, taken: false });   // constructing and adding the new object
                let json = JSON.stringify(allCats);                     // set back to JSON
                fs.writeFile("./data/cats.json", json, () => {          // rewrite the original file with the new cat info
                    res.writeHead(301, { location: "/" });              // redirect
                    res.end();
                });
            });
        });
    } else if (req.url.includes("/cats-edit") && req.method === "GET") {
        let filePath = path.normalize(path.join(__dirname, "../views/editCat.html"));
        const input = fs.createReadStream(filePath);   // fs.readFile() can be used as well
        const currentCat = cats[Number(req.url.match(/\d+$/g)) - 1];
        console.log(currentCat);
        
        input.on("data", (data) => {
            let modifiedData = data.toString().replace('{{id}}', currentCat.id);

            console.log(currentCat.name);
            modifiedData = modifiedData.toString().replace('{{name}}', currentCat.name);
            modifiedData = modifiedData.toString().replace('{{description}}', currentCat.description);

            const breedsAsOptions = breeds.map((b) => `<option value="${b}">${b}</option>`);
            modifiedData = modifiedData.replace("{{catBreeds}}", breedsAsOptions.join("/"));

            modifiedData = modifiedData.replace("{{breed}}", currentCat.breed);
            res.write(modifiedData);
        });
        input.on("end", () => res.end());
        input.on("error", (err) => console.log(err));
    } else if (req.url.includes("/cats-find-new-home") && req.method === "GET") {
        let filePath = path.normalize(path.join(__dirname, "../views/catShelter.html"));
        const input = fs.createReadStream(filePath);   // fs.readFile() can be used as well
        const currentCat = cats[Number(req.url.match(/\d+$/g)) - 1];
        console.log(currentCat);

        input.on("data", (data) => {
            let modifiedData = data.toString().replace('{{id}}', currentCat.id);

            console.log(currentCat.name);
            modifiedData = modifiedData.toString().replaceAll('{{name}}', currentCat.name);
            modifiedData = modifiedData.toString().replace('{{description}}', currentCat.description);
            modifiedData = modifiedData.toString().replace('{{image}}', path.join('../content/images/' + currentCat.image));

            const breedsAsOptions = breeds.map((b) => `<option value="${b}">${b}</option>`);
            modifiedData = modifiedData.replace("{{catBreeds}}", breedsAsOptions.join("/"));

            modifiedData = modifiedData.replaceAll("{{breed}}", currentCat.breed);
            res.write(modifiedData);
        });
        input.on("end", () => res.end());
        input.on("error", (err) => console.log(err));
    } else if (req.url.includes("/cats-edit") && req.method === "POST") {     // similiar logic to Add Cat
        const catId = Number(req.url.match(/\d+$/g)) - 1;
        console.log("catId => " + catId);
        let form = new formidable.IncomingForm();           // form is used for processing various form data 

        form.parse(req, (err, fields, files) => {           // fields - passing info from form fields, files - from preset formidable
            console.log("form.parse...");
            console.log("fields => " + JSON.stringify(fields));
            console.log("files => " + JSON.stringify(files));

            if (err) throw err;

            let fileName;

            if (files) {          // check if during edit there is a new picture file. If not - it will be empty
                console.log("form.parse...");
                // move of the uploaded file (in this case - picture)
                let oldPath = files['image'][0].filepath;                         // taking them from the default formidable folder
                console.log('oldPath => ' + oldPath);
            
                fileName = files['image'][0].originalFilename;
                let newPath = path.normalize(path.join(__dirname, "../content/images/" + fileName));  // creating new path in my folder

                fs.copyFile(oldPath, newPath, (err) => {                   // transfer     
                    if (err) throw err;
                    console.log("Files was uploaded sccessfully!");
                });
            }

            console.log("fileName => " + fileName);

            // Edit object in cats.json
            fs.readFile("./data/cats.json", "utf-8", (err, data) => {
                if (err) throw err;

                let allCats = JSON.parse(data);                         // parsing to array of objects
                console.log("allCats => " + JSON.stringify(allCats));

                let name = fields['name'][0];
                let description = fields['description'][0];
                let breed = fields['breed'][0];

                allCats[catId] = { id: catId + 1, name: name, description: description, breed: breed, image: fileName, taken: false};   // constructing and replacing the object
                console.log("allCats[catId] => " + JSON.stringify(allCats[catId]));

                let json = JSON.stringify(allCats);                     // set back to JSON
                fs.writeFile("./data/cats.json", json, () => {          // rewrite the original file with the new cat info
                    res.writeHead(301, { location: "/" });              // redirect
                    res.end();
                });
            });
        });
    } else if (req.url.includes("/cats-find-new-home") && req.method === "POST") {
        const catId = Number(req.url.match(/\d+$/g)) - 1;
        console.log("catId => " + catId);

        fs.readFile("./data/cats.json", "utf-8", (err, data) => {
            if (err) throw err;

            let allCats = JSON.parse(data);                         // parsing to array of objects
            allCats[catId].taken = true;
            console.log("allCats[catId] => " + JSON.stringify(allCats[catId]));

            let json = JSON.stringify(allCats);                     // set back to JSON
            fs.writeFile("./data/cats.json", json, () => {          // rewrite the original file with the new cat info
                res.writeHead(301, { location: "/" });              // redirect
                res.end();
            });
        });
    } else {
        return true;
    }
}