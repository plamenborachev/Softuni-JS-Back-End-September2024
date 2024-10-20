import { Router } from 'express';
import authService from '../services/authService.js';
import { AUTH_COOKIE_NAME } from '../config/constants.js';
import { getErrorMessage } from '../utils/errorUtils.js';
import { isGuest, isAuth } from "../middlewares/authMiddleware.js"

const authController = Router();

authController.get('/register', isGuest, (req, res) => {
    res.render('auth/register', {title: 'TechStore - Register'});
});

authController.post('/register', isGuest, async (req, res) => {
    const { name, email, password, rePassword } = req.body;

    try{
        const token = await authService.register(name, email, password, rePassword);
        res.cookie(AUTH_COOKIE_NAME, token, { httpOnly: true });
        res.redirect('/');
    } catch(err) {
        const error = getErrorMessage(err);
        res.render('auth/register', {title: 'TechStore - Register', name, email, error});
    }
});

authController.get('/login', isGuest, (req, res) => {
    res.render('auth/login', {title: 'TechStore - Login'});
});

authController.post('/login', isGuest, async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await authService.login(email, password);
        // console.log(token);
        res.cookie(AUTH_COOKIE_NAME, token, { httpOnly: true });
        res.redirect('/');
    } catch(err){
        const error = getErrorMessage(err);
        res.render('auth/login', {title: 'TechStore - Login', email, error});
    }    
});

authController.get('/logout', isAuth, (req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME);
    res.redirect('/');
});

export default authController;
