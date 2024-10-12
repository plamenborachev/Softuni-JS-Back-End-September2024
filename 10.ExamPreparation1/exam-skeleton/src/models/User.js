import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        //minLength: [3, 'Your password is too short!'],
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        //minLength: [3, 'Your password is too short!'],
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        //minLength: [3, 'Your password is too short!'],
    },
});

// Hash password before save
userSchema.pre('save', async function () {
    const hash = await bcrypt.hash(this.password, SALT_ROUNDS);

    this.password = hash;
});

const User = model('User', userSchema);

export default User;
