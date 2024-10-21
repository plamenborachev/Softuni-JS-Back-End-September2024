import express from 'express';
import mongooseInit from './config/mongooseInit.js';
import handlebarsInit from './config/handlebarsInit.js';
import expressInit from './config/expressInit.js';

import routes from './routes.js';
import { PORT } from './config/constants.js';

const app = express();

//Setup db
mongooseInit();
//Setup view engine
handlebarsInit(app);
//Setup express
expressInit(app);

app.use(routes);

app.listen(PORT, () => console.log(`Server is listening on http://localhost:${PORT}...`));