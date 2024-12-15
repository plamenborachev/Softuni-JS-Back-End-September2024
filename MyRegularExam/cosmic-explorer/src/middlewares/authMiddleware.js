import jwt from '../lib/jwt.js';

import { AUTH_COOKIE_NAME, JWT_SECRET } from '../config/constants.js';

//test by homeController.get('/authorized')
export const authMiddleware = async (req, res, next) => {
    const token = req.cookies[AUTH_COOKIE_NAME];
    if (!token) {
        return next();
    }

    try {
        const decodedToken = await jwt.verify(token, JWT_SECRET)
        req.user = decodedToken;
        req.isAuthenticated = true;

        res.locals.user = decodedToken;
        res.locals.isAuthenticated = true;

        next();
    } catch (err) {
        console.log(err);
        res.clearCookie(AUTH_COOKIE_NAME);        
        return res.redirect('/auth/login');
    }
};

export const isAuth = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    
    next();
}

export const isGuest = (req, res, next) => {
    if (req.user) {
        return res.redirect('/404');
    }    
    next();
}
