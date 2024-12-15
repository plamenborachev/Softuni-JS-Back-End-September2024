import { Router } from "express";
import { isAuth } from "../middlewares/authMiddleware.js";
import { TITLE_CATALOG_PAGE, TITLE_CREATE_PAGE, TITLE_DETAILS_PAGE, TITLE_EDIT_PAGE, TITLE_SEARCH_PAGE } from "../config/constants.js";
import planetService from "../services/planetService.js";
import { getErrorMessage } from "../utils/errorUtils.js";

const planetController = Router();

planetController.get('/create', isAuth, (req, res) => {
    res.render('planet/create', {title: TITLE_CREATE_PAGE});
});

planetController.post('/create', isAuth, async (req, res) => {
    const planetData = req.body;
    const ownerId = req.user._id;

    //console.log(deviceData);

    try{
        await planetService.create(planetData, ownerId);
        res.redirect('/planets/catalog');
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        return res.render('planet/create', { error: errorMessage, planet: planetData, title: TITLE_CREATE_PAGE});
    }
});

planetController.get('/catalog', async (req, res) => {
    const planets = await planetService.getAll().lean();
    res.render('planet/catalog', { planets, title: TITLE_CATALOG_PAGE});
});

planetController.get('/details/:planetId', async (req, res) => {
    const { planet, isOwner, liked } = await checkOwnerAndLiked(req, res);

    // console.log(planet.likedList);
    // console.log(req.user?._id);
    // console.log(isOwner);
    // console.log(preferred);

    res.render('planet/details', { planet, isOwner , liked, title: TITLE_DETAILS_PAGE});
});

planetController.get('/like/:planetId', isAuth, async (req, res) => {
    const planetId = req.params.planetId;
    const userId = req.user._id;
    const { planet, isOwner, liked } = await checkOwnerAndLiked(req, res);

    // console.log(planet.likedList);
    // console.log(req.user?._id);
    // console.log(isOwner);
    // console.log(preferred);

    if (isOwner){
        return res.render('planet/details',
            { error: `You are creator of ${planet.name} and can not like it!`, planet, isOwner, liked, title: TITLE_DETAILS_PAGE});
    }

    if (liked){
        return res.render('planet/details',
            { error: 'You\'ve already liked this planet!', planet, isOwner, liked, title: TITLE_DETAILS_PAGE});
    }

    try {
        await planetService.like(planetId, userId);
        res.redirect(`/planets/details/${planetId}`);
    } catch(err){ 
        console.log(err);
    }    
});

planetController.get('/delete/:planetId', isAuth, async (req, res) => {
    const planetId = req.params.planetId;
    const { planet, isOwner, liked } = await checkOwnerAndLiked(req, res);

    // Check if owner
    if (!isOwner) {
        return res.render('planet/details',
            { planet, isOwner: false, liked, error: `You are not creator of ${planet.name} and cannot delete it!`, title: TITLE_DETAILS_PAGE});
    }

    try {
        await planetService.remove(planetId);
        res.redirect('/planets/catalog');
    } catch (err) {
        console.log(err);
    }
});

planetController.get('/edit/:planetId', isAuth, async (req, res) => {
    const { planet, isOwner, liked } = await checkOwnerAndLiked(req, res);

    if (!isOwner) {
        return res.render('planet/details',
            { planet, isOwner: false, liked, error: `You are not creator of ${planet.name} and cannot edit it!`, title: TITLE_DETAILS_PAGE});
    }  

    res.render('planet/edit', { planet, title: TITLE_EDIT_PAGE});
});

planetController.post('/edit/:planetId', isAuth, async (req, res) => {
    const planetData = req.body;
    const planetId = req.params.planetId;

    const { planet, isOwner, liked } = await checkOwnerAndLiked(req, res);

    if (!isOwner) {
        return res.render('planet/details',
            { planet, isOwner: false, liked, error: `You are not creator of ${planet.name} and cannot edit it!`, title: TITLE_DETAILS_PAGE});
    }  

    try {
        await planetService.edit(planetId, planetData);
        res.redirect(`/planets/details/${planetId}`);
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        return res.render('planet/edit', { error: errorMessage, planet: planetData, title: TITLE_EDIT_PAGE});
    }
});

planetController.get('/search', async (req, res) => {
    const filter = req.query;
    // console.log(filter);
    const planets = await planetService.getAll(filter).lean();
    res.render('planet/search', { planets, filter, title: TITLE_SEARCH_PAGE});
});


async function checkOwnerAndLiked(req, res) {
    const planetId = req.params.planetId;
    const userId = req.user?._id;
    let planet = {};

    try {
        planet = await planetService.getOne(planetId).lean();
    } catch (err){
        console.log(err);
        res.redirect('/404');
    } 

    const isOwner = planet.owner && planet.owner.toString() === userId;
    const liked = planet.likedList?.some(like => like._id.toString() === userId);
    return { planet, isOwner, liked };
}

export default planetController;