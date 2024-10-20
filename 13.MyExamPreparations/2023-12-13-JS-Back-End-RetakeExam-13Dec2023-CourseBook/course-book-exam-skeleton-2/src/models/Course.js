import { Schema, model, Types } from 'mongoose';
// import mongoose from 'mongoose';

const courseSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required!'],
        minLength: [5, 'The Title should be at least 5 characters, got \'{VALUE}\'!'],
    },
    type: {
        type: String,
        required: [true, 'Type is required!'],
        minLength: [3, 'The Type should be at least 3 characters, got \'{VALUE}\'!'],
    },
    certificate: {
        type: String,
        required: [true, 'Certificate is required!'],
        minLength: [2, 'The Certificate should be at least 2 characters, got \'{VALUE}\'!'],
    },
    image: {
        type: String,
        required: [true, 'Image is required!'],
        validate: [/^https?:\/\//, 'The Image should start with http:// or https://, got \'{VALUE}\'!'],
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
        minLength: [10, 'The Description should be at least 10 characters, got \'{VALUE}\'!'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required!'],
        min: [0, 'The Price should be a positive number, got \'{VALUE}\'!'],
    }, 
    signUpList: [
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
{
    timestamps: true
}
);

// courseSchema.method('getUsername', function () {
//     return this.signUpList.map(x => x.username);
// })

const Course = model('Course', courseSchema);

export default Course;