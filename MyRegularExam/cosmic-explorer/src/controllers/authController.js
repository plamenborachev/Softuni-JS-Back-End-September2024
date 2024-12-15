import { Router } from 'express';
import authService from '../services/authService.js';
import { AUTH_COOKIE_NAME, TITLE_LOGIN_PAGE, TITLE_REGISTER_PAGE } from '../config/constants.js';
import { getErrorMessage } from '../utils/errorUtils.js';
import { isGuest, isAuth } from "../middlewares/authMiddleware.js"

const authController = Router();

authController.get('/register', isGuest, (req, res) => {
    res.render('auth/register', {title: TITLE_REGISTER_PAGE});
});

authController.post('/register', isGuest, async (req, res) => {
    const { username, email, password, rePassword } = req.body;

    try{
        const token = await authService.register(username, email, password, rePassword);
        res.cookie(AUTH_COOKIE_NAME, token, { httpOnly: true });
        res.redirect('/');
    } catch(err) {
        const error = getErrorMessage(err);
        res.render('auth/register', {title: TITLE_REGISTER_PAGE, username, email, error});
    }
});

authController.get('/login', isGuest, (req, res) => {
    res.render('auth/login', {title: TITLE_LOGIN_PAGE});
});

authController.post('/login', isGuest, async (req, res) => {
    const { username, password } = req.body;

    try {
        const token = await authService.login(username, password);
        // console.log(token);
        res.cookie(AUTH_COOKIE_NAME, token, { httpOnly: true });
        res.redirect('/');
    } catch(err){
        const error = getErrorMessage(err);
        res.render('auth/login', {title: TITLE_LOGIN_PAGE, username, error});
    }    
});

authController.get('/logout', isAuth, (req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME);
    res.redirect('/');
});

export default authController;
