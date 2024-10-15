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

homeController.get('/catalog', async (req, res) => {
    const volcanoes = await volcanoServise.getAll().lean();
    res.render('home/catalog', { volcanoes });
});

export default homeController;