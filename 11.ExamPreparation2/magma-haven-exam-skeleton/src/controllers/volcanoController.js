import { Router } from "express";

import volcanoService from "../services/volcanoServise.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import volcanoServise from "../services/volcanoServise.js";

const volcanoController = Router();

volcanoController.get('/catalog', async (req, res) => {
    const volcanoes = await volcanoServise.getAll().lean();
    res.render('volcano/catalog', { volcanoes, title: 'Catalog'});
});

volcanoController.get('/create', isAuth, (req, res) => {
    res.render('volcano/create', {title: 'Create'});
});

volcanoController.post('/create', isAuth, async (req, res) => {
    const volcanoData = req.body;
    const ownerId = req.user._id;

    try{
        await volcanoService.create(volcanoData, ownerId);
        res.redirect('/catalog');
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        return res.render('volcano/create', { error: errorMessage, volcano: volcanoData, title: 'Create'});
    }
});

volcanoController.get('/details/:volcanoId', async (req, res) => {
    const volcanoId = req.params.volcanoId;
    const userId = req.user?._id;

    const volcano = await volcanoService.getOne(volcanoId).lean();
    const isOwner = volcano.owner && volcano.owner.toString() === userId;
    // const hasVoted = volcano.voteList.find(vote => vote.vote.email === req.user.email) ? true : false;
    const hasVoted = volcano.voteList?.some(vote => vote.vote._id.toString() === userId);

    // console.log(volcano.voteList);
    // console.log(req.user?._id);
    // console.log(isOwner);
    // console.log(hasVoted);

    res.render('volcano/details', { volcano: volcano, isOwner , hasVoted, title: 'Details'});
});

volcanoController.get('/vote/:volcanoId', isAuth, async (req, res) => {
    const volcanoId = req.params.volcanoId;
    const userId = req.user._id;

    //TODO error handling
    const volcano = await volcanoService.getOne(volcanoId).lean();
    const isOwner = volcano.owner && volcano.owner.toString() === userId;
    const hasVoted = volcano.voteList?.some(vote => vote.vote._id.toString() === userId);

    if (isOwner){
        return res.render('volcano/details',
            { error: `You are owner of ${volcano.name} and can not vote for it!`, volcano: volcano, isOwner, hasVoted, title: 'Details'});
        // res.setError('You cannot vote for this volcano!');
        // return res.redirect('/404');
    }   

    if (hasVoted){
        return res.render('volcano/details',
            { error: 'You\'ve already voted for this volcano!', volcano: volcano, isOwner, hasVoted, title: 'Details' });
    }

    try {
        await volcanoService.vote(volcanoId, userId);
        res.redirect(`/volcano/details/${volcanoId}`);
    } catch(err){
        //TODO vote error handling 
        console.log(err);
    }    
});

volcanoController.get('/delete/:volcanoId', isAuth, async (req, res) => {
    const volcanoId = req.params.volcanoId;
    const userId = req.user._id;

    const volcano = await volcanoService.getOne(volcanoId).lean();
    const isOwner = volcano.owner && volcano.owner.toString() === userId;
    const hasVoted = volcano.voteList?.some(vote => vote.vote._id.toString() === userId);

    // Check if owner
    if (!isOwner) {
        return res.render('volcano/details',
            { volcano, isOwner: false, hasVoted, error: 'You cannot delete this volcano!', title: 'Details'});
        // res.setError('You cannot delete this volcano!');
        // return res.redirect('/404');
    }

    try {
        await volcanoService.remove(volcanoId);
        res.redirect('/catalog');
    } catch (err) {
        console.log(err);
        //TODO delete error handling         
        // const errorMessage = getErrorMessage(err);
        // return res.render('volcano/details', { volcano: volcano, error: err , title: 'Details'});
    }
});

volcanoController.get('/edit/:volcanoId', isAuth, async (req, res) => {
    const volcanoId = req.params.volcanoId;
    const userId = req.user._id;

    const volcano = await volcanoService.getOne(volcanoId).lean();
    const isOwner = volcano.owner && volcano.owner.toString() === userId;
    const hasVoted = volcano.voteList?.some(vote => vote.vote._id.toString() === userId);

    if (!isOwner) {
        return res.render('volcano/details', { volcano, isOwner: false, hasVoted, error: 'You cannot edit this volcano!', title: 'Details'});
        // res.setError('You cannot delete this movie!');
        // return res.redirect('/404');
    }  

    res.render('volcano/edit', { volcano, title: 'Edit'});
});

volcanoController.post('/edit/:volcanoId', isAuth, async (req, res) => {
    const volcanoData = req.body;
    const volcanoId = req.params.volcanoId;
    const userId = req.user._id;

    const volcano = await volcanoService.getOne(volcanoId).lean();
    const isOwner = volcano.owner && volcano.owner.toString() === userId;
    const hasVoted = volcano.voteList?.some(vote => vote.vote._id.toString() === userId);

    if (!isOwner) {
        return res.render('volcano/details',
            { volcanoData, isOwner: false, hasVoted, error: 'You cannot edit this volcano!', title: 'Details'});
        // res.setError('You cannot delete this movie!');
        // return res.redirect('/404');
    }  

    try {
        await volcanoServise.edit(volcanoId, volcanoData);
        res.redirect(`/volcano/details/${volcanoId}`);
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        return res.render('volcano/edit', { error: errorMessage, volcano: volcanoData, title: 'Edit' });
    }
});

volcanoController.get('/search', async (req, res) => {
    const filter = req.query;    
    const volcanoes = await volcanoService.getAll(filter).lean();
    res.render('volcano/search', { isSearch: true, volcanoes: volcanoes, filter, title: 'Search'});
});

// async function isVolcanoOwner(volcanoId, userId) {
//     const volcano = await volcanoService.getOne(volcanoId).lean();
//     const isOwner = volcano.owner && volcano.owner.toString() === userId;
//     return isOwner;
// }

// async function hasVotedForVolcano(volcanoId, userId) {
//     const volcano = await volcanoService.getOne(volcanoId).lean();
//     const hasVoted = volcano.voteList?.some(vote => vote.vote._id.toString() === userId);
//     return hasVoted;
// }

export default volcanoController;