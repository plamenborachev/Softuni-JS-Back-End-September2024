const express = require('express');
const routes = require('./routes');
const { PORT } = require('./constants');
const initDatabase = require('./config/mongooseConfig');

const app = express();


require('./config/hbsConfig')(app);
require('./config/expressConfig')(app);

app.use(routes);

initDatabase()
    .then(() => {
        app.listen(PORT, () => console.log(`The app is running on http://localhost:${PORT}....`));
    })
    .catch((err) => {
        console.log('Connot connect database:', err);
    })