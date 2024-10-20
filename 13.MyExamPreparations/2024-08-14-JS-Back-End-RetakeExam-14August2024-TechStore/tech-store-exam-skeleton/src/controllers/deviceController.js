import { Router } from "express";
import { isAuth } from "../middlewares/authMiddleware.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import deviceService from "../services/deviceService.js";

const deviceController = Router();

deviceController.get('/create', isAuth, (req, res) => {
    res.render('device/create', {title: 'TechStore - Create Product'});
});

deviceController.post('/create', isAuth, async (req, res) => {
    const deviceData = req.body;
    const ownerId = req.user._id;

    //console.log(deviceData);

    try{
        await deviceService.create(deviceData, ownerId);
        res.redirect('/devices/catalog');
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        return res.render('device/create', { error: errorMessage, device: deviceData, title: 'TechStore - Create Product'});
    }
});

deviceController.get('/catalog', async (req, res) => {
    const devices = await deviceService.getAll().lean();
    res.render('device/catalog', { devices: devices, title: 'TechStore - Product Catalog'});
});

deviceController.get('/details/:deviceId', async (req, res) => {
    const { device, isOwner, preferred } = await checkOwnerAndPreferred(req, res);

    // console.log(device.preferredList);
    // console.log(req.user?._id);
    // console.log(isOwner);
    // console.log(preferred);

    res.render('device/details', { device: device, isOwner , preferred: preferred, title: 'TechStore - Laptop Details'});
});

deviceController.get('/prefer/:deviceId', isAuth, async (req, res) => {
    const deviceId = req.params.deviceId;
    const userId = req.user._id;
    const { device, isOwner, preferred } = await checkOwnerAndPreferred(req, res);

    // console.log(device.preferredList);
    // console.log(req.user?._id);
    // console.log(isOwner);
    // console.log(preferred);

    if (isOwner){
        return res.render('device/details',
            { error: `You are owner of ${device.brand} and can not prefer it!`, device: device, isOwner, preferred: preferred, title: 'TechStore - Laptop Details'});
        // res.setError('You cannot vote for this volcano!');
        // return res.redirect('/404');
    }   

    if (preferred){
        return res.render('device/details',
            { error: 'You\'ve already preferred this device!', device: device, isOwner, preferred: preferred, title: 'TechStore - Laptop Details' });
    }

    try {
        await deviceService.prefer(deviceId, userId);
        res.redirect(`/devices/details/${deviceId}`);
    } catch(err){ 
        console.log(err);
    }    
});

deviceController.get('/delete/:deviceId', isAuth, async (req, res) => {
    const deviceId = req.params.deviceId;
    const { device, isOwner, preferred } = await checkOwnerAndPreferred(req, res);

    // Check if owner
    if (!isOwner) {
        return res.render('device/details',
            { device: device, isOwner: false, preferred, error: 'You cannot delete this device!', title: 'TechStore - Laptop Details'});
        // res.setError('You cannot delete this volcano!');
        // return res.redirect('/404');
    }

    try {
        await deviceService.remove(deviceId);
        res.redirect('/devices/catalog');
    } catch (err) {
        console.log(err);       
        // const errorMessage = getErrorMessage(err);
        // return res.render('volcano/details', { volcano: volcano, error: err , title: 'Details'});
    }
});

deviceController.get('/edit/:deviceId', isAuth, async (req, res) => {
    const { device, isOwner, preferred } = await checkOwnerAndPreferred(req, res);

    if (!isOwner) {
        return res.render('device/details', { device: device, isOwner: false, preferred: preferred, error: 'You cannot edit this device!', title: 'TechStore - Laptop Details'});
        // res.setError('You cannot delete this movie!');
        // return res.redirect('/404');
    }  

    res.render('device/edit', { device: device, title: 'TechStore - Edit Product'});
});

deviceController.post('/edit/:deviceId', isAuth, async (req, res) => {
    const deviceData = req.body;
    const deviceId = req.params.deviceId;

    const { device, isOwner, preferred } = await checkOwnerAndPreferred(req, res);

    if (!isOwner) {
        return res.render('device/details',
            { deviceData: deviceData, isOwner: false, hasVoted, error: 'You cannot edit this device!', title: 'Details'});
        // res.setError('You cannot delete this movie!');
        // return res.redirect('/404');
    }  

    try {
        await deviceService.edit(deviceId, deviceData);
        res.redirect(`/devices/details/${deviceId}`);
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        return res.render('device/edit', { error: errorMessage, device: deviceData, title: 'TechStore - Edit Product' });
    }
});

export default deviceController;

async function checkOwnerAndPreferred(req, res) {
    const deviceId = req.params.deviceId;
    const userId = req.user?._id;
    let device = {};

    try {
        device = await deviceService.getOne(deviceId).lean();        
    } catch (err){
        console.log(err);
        res.redirect('/404');
    } 

    const isOwner = device.owner && device.owner.toString() === userId;
    const preferred = device.preferredList?.some(prefer => prefer._id.toString() === userId);
    return { device, isOwner, preferred };
}
