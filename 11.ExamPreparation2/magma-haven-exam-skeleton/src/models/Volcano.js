import { Schema, model, Types } from 'mongoose';

const NAME_MIN_LENGTH = 2;
const LOCATION_MIN_LENGTH = 3;
const ELEVATION_MIN = 0;
const LAST_ERUPTION_MIN = 0;
const LAST_ERUPTION_MAX = 2024;
const DESCRIPTION_MIN_LENGTH = 10;

const volcanoSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
        minLength: [NAME_MIN_LENGTH, `The Name should be at least ${NAME_MIN_LENGTH} characters, got '{VALUE}'!`],
    },
    location: {
        type: String,
        required: [true, 'Location is required!'],
        minLength: [LOCATION_MIN_LENGTH, `The Location should be at least ${LOCATION_MIN_LENGTH} characters, got '{VALUE}'!`],
    },
    elevation: {
        type: Number,
        required: [true, 'Elevation is required!'],
        min: [ELEVATION_MIN, `The Elevation should be minimum ${ELEVATION_MIN}, got '{VALUE}'!`],
    },
    lastEruption: {
        type: Number,
        required: [true, 'Last eruption is required!'],
        min: [LAST_ERUPTION_MIN, `The Year of Last Eruption should be between ${LAST_ERUPTION_MIN} and ${LAST_ERUPTION_MAX}, got '{VALUE}'!`],
        max: [LAST_ERUPTION_MAX, `The Year of Last Eruption should be between ${LAST_ERUPTION_MIN} and ${LAST_ERUPTION_MAX}, got '{VALUE}'!`],
    },
    image: {
        type: String,
        required: [true, 'Image is required!'],
        //TODO The Volcano Image should start with http:// or https://
    },
    typeVolcano: {
        type: String,
        enum: {
            values: ['Supervolcanoes', 'Submarine', 'Subglacial', 'Mud', 'Stratovolcanoes', 'Shield'],
            message: '{VALUE} is not supported!'
        },
        required: [true, 'Type volcano is required!'],
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
        minLength: [DESCRIPTION_MIN_LENGTH, `The Description should be a minimum of ${DESCRIPTION_MIN_LENGTH} characters long, got '{VALUE}'`],
    },    
    voteList : [{        //FIXME ???
        votes: {
            type: Types.ObjectId,
            ref: 'User'
        },
    }],
    owner: {
        type: Types.ObjectId,
        ref: 'User',
    }
});

const Volcano = model('Volcano', volcanoSchema);

export default Volcano;