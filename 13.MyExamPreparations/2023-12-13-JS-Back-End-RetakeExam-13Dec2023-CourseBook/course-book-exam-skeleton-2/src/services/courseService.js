import Course from '../models/Course.js'

const getAll = () => Course.find();

const getTopThree = () => Course.find().sort({createdAt: -1}).limit(3);

const getServicesCreatedByUser = (ownerId) => Course.find({owner: ownerId});

const getCoursesSignedUpByUser = (userId) => Course.find({ signUpList: userId});

const create = (course, ownerId) => Course.create({ ...course, owner: ownerId });

const getOne = (courseId) => Course.findById(courseId).populate('signUpList');

const signUp = (courseId, userId) => {
    // const movie = await Movie.findById(movieId);
    // movie.casts.push(castId);
    // return movie.save();
    return Course.findByIdAndUpdate(courseId, { $push: { signUpList: userId } });
};

const remove = (courseId) => Course.findByIdAndDelete(courseId);

const edit = (courseId, data) => Course.findByIdAndUpdate(courseId, data, {runValidators: true});

export default {
    getAll,
    getTopThree,
    getServicesCreatedByUser,
    getCoursesSignedUpByUser,
    create,
    getOne,
    signUp,
    remove,
    edit,
}