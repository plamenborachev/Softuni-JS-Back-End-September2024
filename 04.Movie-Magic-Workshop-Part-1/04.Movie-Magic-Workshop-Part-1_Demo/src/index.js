import express from 'express';
import handlebars from 'express-handlebars';

import routes from './routes.js';

//Setup express
const app = express();

//Setup handlebars
app.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));
app.set('view engine', 'hbs');
app.set('views', './src/views');

//config needed for parsing req body
app.use(express.urlencoded({ extended: false }));
//Setup static route
app.use(express.static('public'));

app.use(routes);

app.listen(5000, () => console.log('Server is listening on http://localhost:5000...'));
