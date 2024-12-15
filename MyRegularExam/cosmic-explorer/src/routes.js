import { Router } from 'express';

import homeController from './controllers/homeController.js';
import authController from './controllers/authController.js';
import { TITLE_ERROR_PAGE } from './config/constants.js';
import planetController from './controllers/planetController.js';

const routes = Router();

routes.use(homeController);
routes.use('/auth', authController);
routes.use('/planets', planetController);

routes.all('*', (req, res) => {
    res.render('home/404', {title: TITLE_ERROR_PAGE});
});

export default routes;