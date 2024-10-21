import { Router } from 'express';
import { isAuth } from "../middlewares/authMiddleware.js";
import courseService from '../services/courseService.js';

const homeController = Router();

homeController.get('/', async (req, res) => {
    //Visualize the last 3 added post
    const getTopThreeCourses = await courseService.getTopThree().lean();
    res.render('home', { getTopThreeCourses, title: 'Home Page'});
});

homeController.get('/profile', isAuth, async (req, res) => {
    const userId = req.user._id;
    const coursesCreated = await courseService.getServicesCreatedByUser(userId).lean();
    const coursesSignedUp = await courseService.getCoursesSignedUpByUser(userId).lean();
    //console.log(devicesCreated);

    res.render('home/profile', {coursesCreated, coursesSignedUp, title: 'Profile Page'});
});

// homeController.get('/about', (req, res) => {
//     res.render('home/about', {title: 'TechStore - About Us'});
// });

//to test authMiddleware
// homeController.get('/authorized', (req, res) => {
//     res.send(req.user);
// });

export default homeController;