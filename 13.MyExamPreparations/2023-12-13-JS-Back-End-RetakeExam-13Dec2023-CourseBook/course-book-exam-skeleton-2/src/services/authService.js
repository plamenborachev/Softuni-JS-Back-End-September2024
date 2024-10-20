import bcrypt from 'bcrypt';
import jwt from '../lib/jwt.js';

import User from "../models/User.js";
import { JWT_SECRET } from '../config/constants.js';

const register = async (username, email, password, rePassword) => {    
    const user = await User.findOne({ $or: [{email}, {username}] });

    if (password !== rePassword){
        throw new Error('Password missmatch!');
    }

    if (user){
        throw new Error('User already exists!');
    }

    const newUser = await User.create({ username, email, password });

    return generateToken(newUser);
}

const login = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Invalid user or password');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error('Invalid user or password');
    }

    return generateToken(user);
}

const generateToken = async(user) => {
    const payload = {
        _id: user._id,
        email: user.email,
        name: user.name,
    };

    const header = { expiresIn: '2h' };

    const token = await jwt.sign(payload, JWT_SECRET, header);

    return token;
}

export default {
    register,
    login,
}
