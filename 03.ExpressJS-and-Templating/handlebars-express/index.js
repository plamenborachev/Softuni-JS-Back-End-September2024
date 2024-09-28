import express from 'express';
import handlebars from 'express-handlebars';
import formidable from 'formidable';
import fs from 'fs/promises';

const app = express();

//Middleware for parsing the body into parts
app.use(express.urlencoded({ extended: false }));

//Setup static files folder
app.use('/uploads', express.static('uploads'));

const cats = [
    { name: 'Navcho', age: 9, breed: 'Persian' },
    { name: 'Sisa', age: 14, breed: 'Angora' },
    { name: 'Garry', age: 7, breed: 'Angora' },
    { name: 'Kitty', age: 2, breed: 'Persian', forSale: true }
];

// 1. Register/Add view engine
app.engine('hbs', handlebars.engine({
    extname: 'hbs' //change template files extension
}));

// 2. Set default view engine
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    // 3. Return template as response
    res.render('home'
        // , { layout: 'secondary'} //use secondary layout; if not set - uses default main layout
    );
});

app.get('/cats', (req, res) => {
    res.render('cats', { cats });
});

app.get('/cats/add', (req, res) => {
    console.log("addCat");
    res.render('addCat');
});

app.get('/cats/:catName', (req, res) => {
    console.log("catDetails");
    const currentCat = cats.find(cat => cat.name === req.params.catName);

    res.render('catDetails', { cat: currentCat })
});

app.post('/cats/:catName/upload', async (req, res) => {
    const form = formidable({});
    const [fileds, files] = await form.parse(req);
    console.log(files);

    //if (files){
        const [persistentFile] = files.photo;

        const oldPath = persistentFile.filepath.toString();
        const newPath = `./uploads/${persistentFile.originalFilename}`;
        await fs.copyFile(oldPath, newPath);
    
        const currentCat = cats.find(cat => cat.name === req.params.catName);
        currentCat.imageUrl = newPath;
    //}  

    res.redirect(`/cats/${req.params.catName}`);
});

app.post('/cats/add', (req, res) => {
    //Middleware for parsing the body into parts
    //app.use(express.urlencoded({ extended: false }));
    const newCat = req.body;

    cats.push(newCat);

    res.redirect('/cats');
});

app.listen(5000, () => console.log('Server is listening on http://localhost:5000'));
