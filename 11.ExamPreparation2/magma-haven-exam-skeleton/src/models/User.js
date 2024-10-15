import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
const USERNAME_MIN_LENGTH = 2;
const EMAIL_MIN_LENGTH = 10;
const PASSWORD_MIN_LENGTH = 4;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        minLength: [USERNAME_MIN_LENGTH, `Your username should be at least ${USERNAME_MIN_LENGTH} characters long!`],
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        minLength: [EMAIL_MIN_LENGTH, `The email should be at least ${EMAIL_MIN_LENGTH} characters long!`],
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        minLength: [PASSWORD_MIN_LENGTH, `The password should be at least ${PASSWORD_MIN_LENGTH} characters long!`],
    },
});

// Hash password before save
userSchema.pre('save', async function () {
    const hash = await bcrypt.hash(this.password, SALT_ROUNDS);

    this.password = hash;
});

const User = model('User', userSchema);

export default User;
