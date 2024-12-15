import { Router } from 'express';
import { TITLE_HOME_PAGE } from '../config/constants.js';

const homeController = Router();

homeController.get('/', (req, res) => {
    res.render('home', {title: TITLE_HOME_PAGE});
});

// homeController.get('/about', (req, res) => {
//     res.render('home/about', {title: 'TechStore - About Us'});
// });

//to test authMiddleware
// homeController.get('/authorized', (req, res) => {
//     res.send(req.user);
// });

export default homeController;