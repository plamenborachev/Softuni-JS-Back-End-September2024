import { Schema, model, Types } from 'mongoose';

const deviceSchema = new Schema({
    brand: {
        type: String,
        required: [true, 'Brand is required!'],
        minLength: [2, 'The Brand should be at least 2 characters, got \'{VALUE}\'!'],
    },
    model: {
        type: String,
        required: [true, 'Model is required!'],
        minLength: [5, 'The Model should be at least 5 characters, got \'{VALUE}\'!'],
    },
    hardDisk: {
        type: String,
        required: [true, 'Hard disk is required!'],
        minLength: [5, 'The Hard disk should be at least 5 characters, got \'{VALUE}\'!'],
    },
    screenSize: {
        type: String,
        required: [true, 'Screen size is required!'],
        minLength: [1, 'The Screen size should be at least 1 characters, got \'{VALUE}\'!'],
    },
    ram: {
        type: String,
        required: [true, 'Ram is required!'],
        minLength: [2, 'The Ram should be at least 2 characters, got \'{VALUE}\'!'],
    },
    operatingSystem: {
        type: String,
        required: [true, 'Operating system is required!'],
        minLength: [5, 'The Operating system should be at least 5 characters, got \'{VALUE}\'!'],
        maxLength: [20, 'The Operating system should be not longer than 20 characters, got \'{VALUE}\'!'],
    },
    cpu: {
        type: String,
        required: [true, 'CPU is required!'],
        minLength: [10, 'The CPU should be at least 10 characters, got \'{VALUE}\'!'],
        maxLength: [50, 'The CPU should be not longer than 50 characters, got \'{VALUE}\'!'],
    },
    gpu: {
        type: String,
        required: [true, 'GPU is required!'],
        minLength: [10, 'The GPU should be at least 10 characters, got \'{VALUE}\'!'],
        maxLength: [50, 'The GPU should be not longer than 50 characters, got \'{VALUE}\'!'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required!'],
        min: [0, 'The Price should be positive number, got \'{VALUE}\'!'],
    },
    color: {
        type: String,
        required: [true, 'Color is required!'],
        minLength: [2, 'The Color should be at least 2 characters, got \'{VALUE}\'!'],
        maxLength: [10, 'The Color should be not longer than 10 characters, got \'{VALUE}\'!'],
    },
    weight: {
        type: String,
        minLength: [1, 'The weight should be at least 1 characters, got \'{VALUE}\'!'],
        required: [true, 'Weight is required!'],
    },
    image: {
        type: String,
        required: [true, 'Image is required!'],
        validate: [/^https?:\/\//, 'The Image should start with http:// or https://, got \'{VALUE}\'!'],
    },
    preferredList: [
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

const Device = model('Device', deviceSchema);

export default Device;