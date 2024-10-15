import express from 'express';
import handlebars from 'express-handlebars';
import { connect } from "mongoose";
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import routes from './routes.js';
import { authMiddleware } from './middlewares/authMiddleware.js';

const app = express();

//Setup db
const url = process.env.DB_URL || 'mongodb://localhost:27017';
connect(url, { dbName: 'volcanoes' }) //TODO: change db name & project name in json
    .then(() => console.log('Successfully connected to DB!'))
    .catch((err) => console.log('Cannot connect to DB: ' + err));

//Setup view engine
app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    // helpers: {
    //     rating: function(rating) {
    //         if (!Number.isInteger(rating)) {
    //             return 'n\\a';
    //         }
        
    //         return '&#x2605;'.repeat(rating);
    //     }
    // }
}));
app.set('view engine', 'hbs');
app.set('views', './src/views');

//Setup express
app.use('/static', express.static('src/public'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(authMiddleware);
app.use(routes);

app.listen(3000, () => console.log('Server is listening on http://localhost:3000...'));