import { Router } from "express";
import { isAuth } from "../middlewares/authMiddleware.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import courseService from "../services/courseService.js";
import userService from "../services/userService.js";

const courseController = Router();

courseController.get('/create', isAuth, (req, res) => {
    res.render('course/create', {title: 'Create Page'});
});

courseController.post('/create', isAuth, async (req, res) => {
    const courseData = req.body;
    const ownerId = req.user._id;

    //console.log(deviceData);

    try {
        await courseService.create(courseData, ownerId);
        res.redirect('/courses/catalog');
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        return res.render('course/create', { error: errorMessage, course: courseData, title: 'Create Page'});
    }
});

courseController.get('/catalog', async (req, res) => {
    const courses = await courseService.getAll().lean();
    res.render('course/catalog', { courses, title: 'Catalog Page'});
});

courseController.get('/details/:courseId', async (req, res) => {
    const { course, owner, isOwner, signedUp, signUps } = await checkOwnerAndSignedUp(req, res);

    // console.log(device.preferredList);
    // console.log(req.user?._id);
    // console.log(isOwner);
    // console.log(preferred);

    res.render('course/details', { course, owner, isOwner , signedUp, signUps, title: 'Details Page'});
});

courseController.get('/signUp/:courseId', isAuth, async (req, res) => {
    const courseId = req.params.courseId;
    const userId = req.user._id;
    const { course, owner, isOwner, signedUp, signUps} = await checkOwnerAndSignedUp(req, res);

    // console.log(device.preferredList);
    // console.log(req.user?._id);
    // console.log(isOwner);
    // console.log(preferred);

    if (isOwner){
        return res.render('course/details',
            { error: `You are owner of ${course.title} and can not sign up for it!`, course, owner, isOwner, signedUp, signUps, title: 'Details Page'});
        // res.setError('You cannot vote for this volcano!');
        // return res.redirect('/404');
    }   

    if (signedUp){
        return res.render('course/details',
            { error: 'You\'ve already signed up for this course!', course, owner, isOwner, signedUp, signUps, title: 'Details Page'});
    }

    try {
        await courseService.signUp(courseId, userId);
        res.redirect(`/courses/details/${courseId}`);
    } catch(err){ 
        console.log(err);
    }    
});

courseController.get('/delete/:courseId', isAuth, async (req, res) => {
    const courseId = req.params.courseId;
    const { course, owner, isOwner, signedUp, signUps} = await checkOwnerAndSignedUp(req, res);

    // Check if owner
    if (!isOwner) {
        return res.render('course/details',
            { course, owner, isOwner: false, signedUp, signUps, error: 'You cannot delete this course!', title: 'Details Page'});
        // res.setError('You cannot delete this volcano!');
        // return res.redirect('/404');
    }

    try {
        await courseService.remove(courseId);
        res.redirect('/courses/catalog');
    } catch (err) {
        console.log(err);       
        // const errorMessage = getErrorMessage(err);
        // return res.render('volcano/details', { volcano: volcano, error: err , title: 'Details'});
    }
});

courseController.get('/edit/:courseId', isAuth, async (req, res) => {
    const { course, owner, isOwner, signedUp, signUps} = await checkOwnerAndSignedUp(req, res);

    if (!isOwner) {
        return res.render('course/details', { course, owner, isOwner: false, signedUp, signUps, error: 'You cannot edit this course!', title: 'Details Page'});
        // res.setError('You cannot delete this movie!');
        // return res.redirect('/404');
    }  

    res.render('course/edit', { course, title: 'Edit Page'});
});

courseController.post('/edit/:courseId', isAuth, async (req, res) => {
    const courseData = req.body;
    const courseId = req.params.courseId;

    const { course, owner, isOwner, signedUp, signUps} = await checkOwnerAndSignedUp(req, res);

    if (!isOwner) {
        return res.render('device/details',
            { course, isOwner: false, signedUp, signUps, error: 'You cannot edit this course!', title: 'Details Page'});
        // res.setError('You cannot delete this movie!');
        // return res.redirect('/404');
    }  

    try {
        await courseService.edit(courseId, courseData);
        res.redirect(`/courses/details/${courseId}`);
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        return res.render('course/edit', { error: errorMessage, course: courseData, title: 'Edit Page' });
    }
});


async function checkOwnerAndSignedUp(req, res) {
    const courseId = req.params.courseId;
    const userId = req.user?._id;
    let course = {};
    let owner = {};

    try {
        course = await courseService.getOne(courseId).lean(); 
        owner = await userService.owner(course.owner).lean();
    } catch (err){
        console.log(err);
        res.redirect('/404');
    } 

    //console.log(course);
    //console.log(owner);

    const isOwner = course.owner && course.owner.toString() === userId;
    const signedUp = course.signUpList?.some(signUp => signUp._id.toString() === userId);
    const signUps = course.signUpList.map(signUp => signUp.email).join(', ');

    // console.log(signUps);

    return { course, owner, isOwner, signedUp, signUps};
}

export default courseController;