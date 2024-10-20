import { Router } from 'express';
import deviceService from '../services/deviceService.js';
import { isAuth } from "../middlewares/authMiddleware.js";

const homeController = Router();

homeController.get('/', async (req, res) => {
    //Visualize the last 3 added post
    const getTopThreeDevices = await deviceService.getTopThree().lean();
    res.render('home', {getTopThreeDevices, title: 'TechStore - Laptops and Computers'});
});

homeController.get('/about', (req, res) => {
    res.render('home/about', {title: 'TechStore - About Us'});
});

homeController.get('/profile', isAuth, async (req, res) => {
    const userId = req.user._id;
    const devicesCreated = await deviceService.getDevicesCreatedByUser(userId).lean();
    const devicesPreferred = await deviceService.getDevicesPreferredByUser(userId).lean();
    //console.log(devicesCreated);

    res.render('home/profile', {devicesCreated, devicesPreferred, title: 'TechStore - Profile'});
});

//to test authMiddleware
// homeController.get('/authorized', (req, res) => {
//     res.send(req.user);
// });

export default homeController;