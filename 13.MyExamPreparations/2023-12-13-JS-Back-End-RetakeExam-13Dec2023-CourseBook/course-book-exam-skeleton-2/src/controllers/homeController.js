import { Router } from 'express';
import courseService from '../services/courseService.js';

const homeController = Router();

homeController.get('/', async (req, res) => {
    //Visualize the last 3 added post
    const getTopThreeCourses = await courseService.getTopThree().lean();
    res.render('home', { getTopThreeCourses, title: 'Home Page'});
});

// homeController.get('/about', (req, res) => {
//     res.render('home/about', {title: 'TechStore - About Us'});
// });

//to test authMiddleware
// homeController.get('/authorized', (req, res) => {
//     res.send(req.user);
// });

export default homeController;