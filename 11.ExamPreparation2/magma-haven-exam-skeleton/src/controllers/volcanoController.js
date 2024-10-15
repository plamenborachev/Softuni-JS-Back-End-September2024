import { Router } from "express";

import volcanoService from "../services/volcanoServise.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import volcanoServise from "../services/volcanoServise.js";

const volcanoController = Router();

volcanoController.get('/create', isAuth, (req, res) => {
    res.render('volcanoes/create');
});

volcanoController.post('/create', isAuth, async (req, res) => {
    const volcanoData = req.body;
    const ownerId = req.user?._id;

    try{
        await volcanoService.create(volcanoData, ownerId);
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        return res.render('volcanoes/create', { error: errorMessage, volcano: volcanoData });
    }      
    res.redirect('/');
});

volcanoController.get('/details/:volcanoId', async (req, res) => {
    const volcanoId = req.params.volcanoId;
    const volcano = await volcanoService.getOne(volcanoId).lean();

    const isOwner = volcano.owner && volcano.owner.toString() === req.user?._id;

    res.render('volcanoes/details', { volcano: volcano, isOwner });
});

volcanoController.get('/delete/:volcanoId', isAuth, async (req, res) => {
    const volcanoId = req.params.volcanoId;

    // Check if owner
    const volcano = await volcanoService.getOne(volcanoId).lean();

    if (volcano.owner?.toString() !== req.user._id) {
        return res.render('volcanoes/details', { volcano, isOwner: false, error: 'You cannot delete this volcano!' });
        // res.setError('You cannot delete this movie!');
        // return res.redirect('/404');
    }

    try {
        await volcanoService.remove(volcanoId);
    } catch (err) {
        //TODO error handling delete        
        // const errorMessage = getErrorMessage(err);
        return res.render('volcanoes/details', { volcano: volcano, error: err });
    }     

    res.redirect('/');
});

volcanoController.get('/edit/:volcanoId', isAuth, async (req, res) => {
    const volcanoId = req.params.volcanoId;
    const volcano = await volcanoService.getOne(volcanoId).lean();

    if (volcano.owner?.toString() !== req.user._id) {
        return res.render('volcanoes/details', { volcano, isOwner: false, error: 'You cannot edit this volcano!' });
        // res.setError('You cannot delete this movie!');
        // return res.redirect('/404');
    }  

    res.render('volcanoes/edit', { volcano });
});

volcanoController.post('/edit/:volcanoId', isAuth, async (req, res) => {
    //TODO momgoose validation not working
    const volcanoData = req.body;
    const volcanoId = req.params.volcanoId;

    try {
        await volcanoServise.edit(volcanoId, volcanoData);
    } catch (err) {
        //TODO error handling edit 
        const errorMessage = getErrorMessage(err);
        return res.render('volcanoes/edit', { error: errorMessage, volcano: volcanoData });
    }
    
    res.redirect(`/volcano/details/${volcanoId}`);
});

export default volcanoController;