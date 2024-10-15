import { Router } from 'express';
import volcanoServise from '../services/volcanoServise.js';

const homeController = Router();

homeController.get('/', (req, res) => {
    res.render('home', {title: 'Home page'});
});

//to test authMiddleware
// homeController.get('/authorized', (req, res) => {
//     res.send(req.user);
// });

export default homeController;