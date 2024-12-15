import { Router } from 'express';
import { TITLE_HOME_PAGE } from '../config/constants.js';

const homeController = Router();

homeController.get('/', (req, res) => {
    res.render('home', {title: TITLE_HOME_PAGE});
});

//to test authMiddleware
// homeController.get('/authorized', (req, res) => {
//     res.send(req.user);
// });

export default homeController;