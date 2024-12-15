import { Schema, model, Types } from 'mongoose';

const planetSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
        minLength: [2, 'The Name should be at least 2 characters, got \'{VALUE}\'!'],
    },
    age: {
        type: Number,
        required: [true, 'Age is required!'],
        min: [0, 'The Age should be a positive number, got \'{VALUE}\'!'],
    },
    solarSystem: {
        type: String,
        required: [true, 'Solar System is required!'],
        minLength: [2, 'The Solar System should be at least 2 characters, got \'{VALUE}\'!'],
    },
    type: {
        type: String,
        enum: {
            values: ['Inner', 'Outer', 'Dwarf'],
            message: '\'{VALUE}\' is not supported for type!'
        },
        //required: [true, 'Type is required!'],
    },
    moons: {
        type: Number,
        required: [true, 'Moons are required!'],
        min: [0, 'The moons should be a positive number, got \'{VALUE}\'!'],
    },
    size: {
        type: Number,
        required: [true, 'Size is required!'],
        min: [0, 'The size should be a positive number, got \'{VALUE}\'!'],
    },
    rings: {
        type: String,
        enum: {
            values: ['Yes', 'No'],
            message: '\'{VALUE}\' is not supported for rings!'
        },
        //required: [true, 'Rings are required!'],
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
        minLength: [10, 'The Description should be between 10 and 100 characters long, got \'{VALUE}\'!'],
        maxLength: [100, 'The Description should be between 10 and 100 characters long, got \'{VALUE}\'!'],
    },
    image: {
        type: String,
        required: [true, 'Image is required!'],
        validate: [/^https?:\/\//, 'The Image should start with http:// or https://, got \'{VALUE}\'!'],
    },
    likedList: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ],
    owner: {
        type: Types.ObjectId,
        ref: 'User',
    },
},
);

const Planet = model('Planet', planetSchema);

export default Planet;